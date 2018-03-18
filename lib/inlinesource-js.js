'use strict';
const fs = require('fs');
const path = require('path');

const fn = require('./util');

const REG = {
  JS_INLINE: /(__inline\s*\(\s*["'])([^'"]+)(['"]\s*\))/g,
  IS_IMG: /^\.(jpg|jpeg|bmp|gif|webp|png|apng|svga)$/,
  IS_HTTP: /^(http[s]?:)|(\/\/\w)/
};


var isjs = function(op) {
  let iCnt = op.content.toString();
  iCnt = iCnt.replace(REG.JS_INLINE, (str, $1, $2) => {
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
  return Promise.resolve(iCnt);
};

module.exports = isjs;
