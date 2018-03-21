'use strict';
const fs = require('fs');
const path = require('path');
const util = require('yyl-util');

const fn = require('./util');
const REG = require('./reg');

const isjs = function(op) {
  let iCnt = op.content.toString();
  iCnt = iCnt.replace(REG.JS_INLINE, (str, $1, $2) => {
    let filePath;
    if (fn.isSameHost(op.publishPath, $2)) {
      filePath = path.join(op.baseUrl, path.relative(op.publishPath, fn.hideUrlTail($2)));
    } else {
      if (op.publishPath.match(REG.IS_HTTP) || op.publishPath.match(REG.PATH_IS_ABSLURE)) {
        filePath = fn.formatUrl(path.join(
          op.baseUrl,
          $2
        ));
      } else {
        filePath = fn.hideUrlTail(util.path.join(op.baseUrl, $2));
      }
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
  return Promise.resolve(iCnt);
};

module.exports = isjs;
