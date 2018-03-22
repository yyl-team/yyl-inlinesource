'use strict';
const fs = require('fs');
const path = require('path');
const fn = require('./util');
const REG = require('./reg');
const util = require('yyl-util');
const querystring = require('querystring');

const ishtml = function(op) {
  let iCnt = op.content.toString();


  iCnt = iCnt
    // 隔离 script 标签内容
    .replace(REG.HTML_SCRIPT_CONTENT, (str, $1, $2, $3) => {
      if ($1.match(REG.HTML_SCRIPT_TEMPLATE)) {
        return str;
      } else {
        return `${$1}${querystring.escape($2)}${$3}`;
      }
    })
    // 隔离 style 标签内容
    .replace(REG.HTML_STYLE_CONTENT, (str, $1, $2, $3) => {
      return `${$1}${querystring.escape($2)}${$3}`;
    })
    // html 路径纠正
    .replace(REG.HTML_PATH, (str, $1, $2, $3, $4, $5) => {
      let rPath = $4;
      if (
        fn.isAbslute(rPath) ||
        rPath.match(REG.PATH_IGNORE)
      ) {
        return str;
      } else {
        let fixPath = '';
        if (fn.isAbslute(op.publishPath)) {
          fixPath = util.path.join(op.publishPath, rPath);
        } else {
          fixPath = util.path.join(path.relative(op.publishPath, op.baseUrl), rPath);
        }

        if (typeof op.onReplacePath == 'function') {
          fixPath = op.onReplacePath(fixPath);
        }
        return `${$1}${$2}${$3}${fixPath}${$5}`;
      }
    })
    // 取消隔离 script 标签内容
    .replace(REG.HTML_SCRIPT_CONTENT, (str, $1, $2, $3) => {
      if ($1.match(REG.HTML_SCRIPT_TEMPLATE)) {
        return str;
      } else {
        return `${$1}${querystring.unescape($2)}${$3}`;
      }
    })
    // 取消隔离 style 标签内容
    .replace(REG.HTML_STYLE_CONTENT, (str, $1, $2, $3) => {
      return `${$1}${querystring.unescape($2)}${$3}`;
    })
    // 带 inline 的 script 标签 引入 & 内容路径纠正
    .replace(REG.HTML_SCRIPT_TAG_INLINE, (str, $1, $2) => {
      let rPath;
      if (fn.isAbslute($2)) {
        if (fn.isSameHost(op.publishPath, $2)) {
          rPath = util.path.join(op.baseUrl, path.relative(op.publishPath, $2));
        } else {
          Promise.reject(`yyl-inlinesource html run error, not support http path: ${$2}`);
          return str;
        }
      } else {
        if (fn.isAbslute(op.publishPath)) {
          rPath = util.path.join(op.baseUrl, path.relative(op.publishPath, $2));
        } else {
          rPath = util.path.join(op.publishPath, $2);
        }
      }
      if (!fs.existsSync(rPath)) {
        Promise.reject(`yyl-inlinesource html run error, reg path is not exists: ${rPath}`);
        return str;
      }
      let cnt = fs.readFileSync(rPath).toString();
      cnt = cnt.replace(REG.JS_INLINE, (str, $1, $2, $3) => {
        let fixPath;
        if (fn.isAbslute($2)) {
          return str;
        } else {
          fixPath = util.path.join(
            path.relative(op.publishPath, path.dirname(rPath)),
            $2
          );
        }

        return `${$1}${fixPath}${$3}`;
      });
      cnt = cnt.replace(/([\r\n]+)/g, `${$1}`);
      return `${$1}<script>${$1}${cnt}${$1}</script>`;
    })
    // 带 inline 的 link 标签 引入 & 内容路径纠正
    .replace(REG.HTML_LINK_TAG_INLINE, (str, $1, $2) => {
      let rPath;
      if (fn.isAbslute($2)) {
        if (fn.isSameHost(op.publishPath, $2)) {
          rPath = util.path.join(op.baseUrl, path.relative(op.publishPath, $2));
        } else {
          Promise.reject(`yyl-inlinesource html run error, not support http path: ${$2}`);
          return str;
        }
      } else {
        if (fn.isAbslute(op.publishPath)) {
          rPath = util.path.join(op.baseUrl, $2);
        } else {
          rPath = util.path.join(op.publishPath, $2);
        }
      }
      if (!fs.existsSync(rPath)) {
        Promise.reject(`yyl-inlinesource html run error, reg path is not exists: ${rPath}`);
        return str;
      }
      let rCnt = fs.readFileSync(rPath).toString();
      const replaceHandle = (str, $1, $2, $3) => {
        const inPath = $2;

        if (inPath.match(REG.PATH_IGNORE)) {
          return str;
        }

        if (fn.isAbslute(inPath)) {
          return str;
        }

        let fixPath;
        if (fn.isAbslute(op.publishPath)) {
          fixPath = util.path.join(
            op.publishPath,
            path.relative(op.baseUrl, path.join(path.dirname(rPath), inPath))
          );
        } else {
          fixPath = util.path.join(
            path.relative(
              op.publishPath,
              path.join(path.dirname(rPath), inPath)
            )
          );
        }

        return `${$1}${fixPath}${$3}`;
      };
      rCnt = rCnt
        .replace(REG.CSS_PATH, replaceHandle)
        .replace(REG.CSS_PATH2, replaceHandle);
      // 路径纠正
      rCnt = rCnt.replace(/([\r\n]+)/g, `${$1}`);
      return `${$1}<style type="text/css">${$1}${rCnt}${$1}</style>`;
    })

    // img 标签中 带有 ?__inline 的链接
    .replace(REG.HTML_IMG_TAG, (str, $1, $2, $3) => {
      const rPath = $2;
      let imgPath = fn.hideUrlTail(rPath);
      if (rPath.match(REG.IMG_INLINE)) {
        if (fn.isSameHost(imgPath, op.publishPath)) {
          imgPath = path.join(op.baseUrl, path.relative(op.publishPath, imgPath));
        }
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
        let inPath = $2;

        if (inPath.match(REG.PATH_IGNORE)) {
          return str;
        }
        let imgPath;
        if (fn.isSameHost(inPath, op.publishPath)) {
          if (inPath.match(REG.IMG_INLINE)) {
            imgPath = path.join(op.baseUrl, path.relative(op.publishPath, fn.hideUrlTail(inPath)));
            if (fs.existsSync(imgPath)) {
              return `${$1}${fn.url2base64(imgPath)}${$3}`;
            } else {
              return str;
            }
          } else {
            return str;
          }
        } else {
          if (fn.isAbslute(inPath)) {
            return str;
          }
          if (fn.isAbslute(op.publishPath)) {
            inPath = util.path.join(
              op.publishPath,
              path.relative(op.baseUrl, inPath)
            );
          }

          if (inPath.match(REG.IMG_INLINE)) {
            imgPath = fn.hideUrlTail(path.join(op.publishPath, inPath));
            return `${$1}${fn.url2base64(imgPath)}${$3}`;
          } else {
            return `${$1}${inPath}${$3}`;
          }
        }
      };
      styleCnt = styleCnt
        .replace(REG.CSS_PATH, replaceHandle)
        .replace(REG.CSS_PATH2, replaceHandle);

      return `${$1}${styleCnt}${$3}`;
    })

    // script 标签中 带有 __inline() 方法的代码片段
    // TODO 与 inlinesource-js 功能重复, 待优化
    .replace(REG.HTML_SCRIPT_CONTENT, (str, $1, $2, $3) => {
      let scriptCnt = $2;
      scriptCnt = scriptCnt.replace(REG.JS_INLINE, (str, $1, $2) => {
        let filePath;
        if (fn.isSameHost(op.publishPath, $2)) {
          filePath = path.join(op.baseUrl, path.relative(op.publishPath, fn.hideUrlTail($2)));
        } else {
          filePath = fn.hideUrlTail(path.join(op.publishPath, $2));
        }

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

