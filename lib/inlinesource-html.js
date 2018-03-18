'use strict';
const fs = require('fs');
const path = require('path');
const fn = require('./util');

const REG = {
  SCRIPT_TAG: /<script [^>]*src\s*=\s*['"]([^'"]+)["'][^>]*inline[^>]*><\/script>/ig,
  LINK_TAG: /<link [^>]*href\s*=\s*['"]([^'"]+)["'][^>]*inline[^>]*\/>/ig,
  IMG_TAG: /(<img [^>]*src\s*=\s*['"])([^'"]+)(["'][^>]*\/>)/ig,
  SCRIPT_CONTENT: /(<script[^>]*?>)([\s\S]*?)(<\/script>)/ig,
  STYLE_CONTENT: /(<style[^>]*?>)([\s\S]*?)(<\/style>)/ig,
  IMG_INLINE: /\?__inline$/,
  JS_INLINE: /(__inline\s*\(\s*["'])([^'"]+)(['"]\s*\))/g,
  IS_IMG: /^\.(jpg|jpeg|bmp|gif|webp|png|apng|svga)$/,


  IS_HTTP: /^(http[s]?:)|(\/\/\w)/,
  CSS_PATH_REG: /(url\s*\(['"]?)([^'"]*?)(['"]?\s*\))/ig,
  CSS_PATH_REG2: /(src\s*=\s*['"])([^'" ]*?)(['"])/ig,
  CSS_IGNORE_REG: /^(about:|data:|javascript:|#|\{\{)/,
  CSS_IS_ABSLURE: /^\//
};

const ishtml = function(op) {
  let iCnt = op.content.toString();

  iCnt = iCnt
    // 带 inline 的 script 标签
    .replace(REG.SCRIPT_TAG, (str, $1) => {
      const rPath = path.join(op.baseUrl, $1);
      if (!fs.existsSync(rPath)) {
        return Promise.reject(`yyl-inlinesource html run error, reg path is not exists: ${rPath}`);
      }
      let cnt = fs.readFileSync(rPath).toString();
      cnt = cnt.replace(REG.JS_INLINE, (str, $1, $2, $3) => {
        let fixPath = path.join(path.relative(op.baseUrl, path.dirname(rPath)), $2);
        fixPath = fn.formatUrl(fixPath);
        return `${$1}${fixPath}${$3}`;
      });
      return `<script>\n${cnt}\n</script>`;
    })
    // 带 inline 的 link 标签
    .replace(REG.LINK_TAG, (str, $1) => {
      const rPath = path.join(op.baseUrl, $1);
      if (!fs.existsSync(rPath)) {
        return Promise.reject(`yyl-inlinesource html run error, reg path is not exists: ${rPath}`);
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
        let fixPath = path.join(path.relative(op.baseUrl, path.dirname(rPath)), inPath);
        fixPath = fn.formatUrl(fixPath);

        return `${$1}${fixPath}${$3}`;
      };
      rCnt = rCnt
        .replace(REG.CSS_PATH_REG, replaceHandle)
        .replace(REG.CSS_PATH_REG2, replaceHandle);
      // 路径纠正
      return `<style type="text/css">\n${rCnt}\n</style>`;
    })
    // style 标签中 带有 ?__inline 的链接
    .replace(REG.STYLE_CONTENT, (str, $1, $2, $3) => {
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
          const imgPath = fn.hideUrlTail(path.join(op.baseUrl, inPath));
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
    // img 标签中 带有 ?__inline 的链接
    .replace(REG.IMG_TAG, (str, $1, $2, $3) => {
      const rPath = $2;
      const imgPath = fn.hideUrlTail(path.join(op.baseUrl, rPath));
      if (rPath.match(REG.IMG_INLINE)) {
        return `${$1}${fn.url2base64(imgPath)}${$3}`;
      } else {
        return str;
      }
    })
    // script 标签中 带有 __inline() 方法的代码片段
    .replace(REG.SCRIPT_CONTENT, (str, $1, $2, $3) => {
      let scriptCnt = $2;
      scriptCnt = scriptCnt.replace(REG.JS_INLINE, (str, $1, $2) => {
        const filePath = fn.hideUrlTail(path.join(op.baseUrl, $2));
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
