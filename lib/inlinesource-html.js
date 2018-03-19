'use strict';
const fs = require('fs');
const path = require('path');
const fn = require('./util');
const REG = require('./reg');

const ishtml = function(op) {
  let iCnt = op.content.toString();

  iCnt = iCnt
    // html 路径纠正
    .replace(REG.HTML_PATH_REG, (str, $1, $2, $3, $4, $5) => {
      const rPath = $4;
      if (
        rPath.match(REG.IS_HTTP) ||
        rPath.match(REG.CSS_IS_ABSLURE) ||
        rPath.match(REG.CSS_IGNORE_REG)
      ) {
        return str;
      } else {
        const fixPath = fn.formatUrl(path.join(
          path.relative(op.publishPath, op.baseUrl),
          rPath
        ));
        return `${$1}${$2}${$3}${fixPath}${$5}`;
      }
    })
    // 带 inline 的 script 标签 引入 & 路径纠正
    .replace(REG.HTML_SCRIPT_TAG_INLINE, (str, $1, $2) => {
      const rPath = path.join(op.publishPath, $2);
      if (!fs.existsSync(rPath)) {
        Promise.reject(`yyl-inlinesource html run error, reg path is not exists: ${rPath}`);
        return str;
      }
      let cnt = fs.readFileSync(rPath).toString();
      cnt = cnt.replace(REG.JS_INLINE, (str, $1, $2, $3) => {
        let fixPath = path.join(
          path.relative(op.publishPath, path.dirname(rPath)),
          $2
        );
        fixPath = fn.formatUrl(fixPath);
        return `${$1}${fixPath}${$3}`;
      });
      cnt = cnt.replace(/([\r\n]+)/g, `${$1}`);
      return `${$1}<script>${$1}${cnt}${$1}</script>`;
    })
    // 带 inline 的 link 标签 引入 & 路径纠正
    .replace(REG.HTML_LINK_TAG_INLINE, (str, $1, $2) => {
      const rPath = path.join(op.publishPath, $2);
      if (!fs.existsSync(rPath)) {
        Promise.reject(`yyl-inlinesource html run error, reg path is not exists: ${rPath}`);
        return str;
      }
      let rCnt = fs.readFileSync(rPath).toString();
      const replaceHandle = (str, $1, $2, $3) => {
        const inPath = $2;

        if (inPath.match(REG.CSS_IGNORE_REG)) {
          return str;
        }

        if (inPath.match(REG.IS_HTTP) || inPath.match(REG.CSS_IS_ABSLURE)) {
          return str;
        }
        let fixPath = path.join(
          path.relative(op.publishPath, path.dirname(rPath)),
          inPath
        );
        fixPath = fn.formatUrl(fixPath);

        return `${$1}${fixPath}${$3}`;
      };
      rCnt = rCnt
        .replace(REG.CSS_PATH_REG, replaceHandle)
        .replace(REG.CSS_PATH_REG2, replaceHandle);
      // 路径纠正
      rCnt = rCnt.replace(/([\r\n]+)/g, `${$1}`);
      return `${$1}<style type="text/css">${$1}${rCnt}${$1}</style>`;
    })

    // img 标签中 带有 ?__inline 的链接
    .replace(REG.HTML_IMG_TAG, (str, $1, $2, $3) => {
      const rPath = $2;
      const imgPath = fn.hideUrlTail(rPath);
      if (rPath.match(REG.IMG_INLINE)) {
        return `${$1}${fn.url2base64(imgPath)}${$3}`;
      } else {
        return str;
      }
    })
    // style 标签中 带有 ?__inline 的链接
    // TODO 与 inlinesource-css 功能重复, 待优化
    .replace(REG.HTML_STYLE_CONTENT, (str, $1, $2, $3) => {
      let styleCnt = $2;
      const replaceHandle = (str, $1, $2, $3) => {
        const inPath = $2;

        if (inPath.match(REG.CSS_IGNORE_REG)) {
          return str;
        }

        if (inPath.match(REG.IS_HTTP) || inPath.match(REG.CSS_IS_ABSLURE)) {
          return str;
        }

        if (inPath.match(REG.IMG_INLINE)) {
          const imgPath = fn.hideUrlTail(path.join(
            op.publishPath,
            inPath
          ));
          return `${$1}${fn.url2base64(imgPath)}${$3}`;
        } else {
          return str;
        }
      };
      styleCnt = styleCnt
        .replace(REG.CSS_PATH_REG, replaceHandle)
        .replace(REG.CSS_PATH_REG2, replaceHandle);

      return `${$1}${styleCnt}${$3}`;
    })

    // script 标签中 带有 __inline() 方法的代码片段
    // TODO 与 inlinesource-js 功能重复, 待优化
    .replace(REG.HTML_SCRIPT_CONTENT, (str, $1, $2, $3) => {
      let scriptCnt = $2;
      scriptCnt = scriptCnt.replace(REG.JS_INLINE, (str, $1, $2) => {
        const filePath = fn.hideUrlTail(path.join(op.publishPath, $2));
        if (!fs.existsSync(filePath)) {
          return '\'\'';
        }
        if (filePath.match(REG.IS_IMG)) {
          return `'${fn.url2base64($2)}'`;
        } else {
          let data = fs.readFileSync(filePath).toString();
          return fn.tpl2string(data);
        }
      });
      return `${$1}${scriptCnt}${$3}`;
    });
  return Promise.resolve(iCnt);
  // TODO
};

module.exports = ishtml;
