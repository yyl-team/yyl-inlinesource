'use strict';
const path = require('path');
const fs = require('fs');

const util = require('yyl-util');

const fn = require('./util');
const REG = require('./reg');

const iscss = function(op) {
  let iCnt = op.content.toString();

  const replaceHandle = (str, $1, $2, $3) => {
    let inPath = $2;

    if (inPath.match(REG.PATH_IGNORE)) {
      return str;
    }
    let imgPath;
    if (fn.isSameHost(inPath, op.publishPath)) {
      if (inPath.match(REG.IMG_INLINE)) {
        imgPath = util.path.join(op.baseUrl, path.relative(op.publishPath, fn.hideUrlTail(inPath)));
        if (fs.existsSync(imgPath)) {
          return `${$1}${fn.url2base64(imgPath)}${$3}`;
        } else {
          return str;
        }
      } else {
        return str;
      }
    } else {
      if (inPath.match(REG.IS_HTTP) || inPath.match(REG.PATH_IS_ABSLURE)) {
        return str;
      }
      if (op.publishPath.match(REG.IS_HTTP) || op.publishPath.match(REG.PATH_IS_ABSLURE)) {
        // inPath = util.path.join(
        //   op.publishPath,
        //   path.relative(op.baseUrl, inPath)
        // );
        if (inPath.match(REG.IMG_INLINE)) {
          imgPath = fn.hideUrlTail(
            util.path.join(op.baseUrl, inPath)
          );
          return `${$1}${fn.url2base64(imgPath)}${$3}`;
        } else {
          inPath = util.path.join(op.publishPath, inPath);
          return `${$1}${inPath}${$3}`;
        }
      } else {
        // 路径纠正
        inPath = util.path.join(
          path.relative(op.publishPath, op.baseUrl),
          inPath
        );

        if (inPath.match(REG.IMG_INLINE)) {
          imgPath = fn.hideUrlTail(util.path.join(op.publishPath, inPath));
          return `${$1}${fn.url2base64(imgPath)}${$3}`;
        } else {
          return `${$1}${inPath}${$3}`;
        }
      }
    }
  };
  iCnt = iCnt
    .replace(REG.CSS_PATH, replaceHandle)
    .replace(REG.CSS_PATH2, replaceHandle);
  return Promise.resolve(iCnt);
};

module.exports = iscss;

