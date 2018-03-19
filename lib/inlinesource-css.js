'use strict';
const path = require('path');

const fn = require('./util');
const REG = require('./reg');

const iscss = function(op) {
  let iCnt = op.content.toString();

  const replaceHandle = (str, $1, $2, $3) => {
    let inPath = $2;

    if (inPath.match(REG.CSS_IGNORE_REG)) {
      return str;
    }

    if (inPath.match(REG.IS_HTTP) || inPath.match(REG.CSS_IS_ABSLURE)) {
      return str;
    }
    // 路径纠正
    inPath = fn.formatUrl(path.join(
      path.relative(op.publishPath, op.baseUrl),
      inPath
    ));
    if (inPath.match(REG.IMG_INLINE)) {
      const imgPath = fn.hideUrlTail(path.join(op.publishPath, inPath));
      return `${$1}${fn.url2base64(imgPath)}${$3}`;
    } else {
      return `${$1}${inPath}${$3}`;
    }
  };
  iCnt = iCnt
    .replace(REG.CSS_PATH_REG, replaceHandle)
    .replace(REG.CSS_PATH_REG2, replaceHandle);
  return Promise.resolve(iCnt);
};

module.exports = iscss;

