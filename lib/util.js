'use strict';
const fs = require('fs');
const path = require('path');

const util = {
  hideUrlTail: (url) => {
    return url
      .replace(/\?.*?$/g, '')
      .replace(/#.*?$/g, '');
  },
  formatUrl: (url) => {
    return url.replace(/\\/g, '/');
  },
  url2base64: (url) => {
    const iPath = util.hideUrlTail(url);
    if (fs.existsSync(iPath)) {
      const ext = path.extname(iPath).slice(1);
      const data = fs.readFileSync(iPath).toString('base64');
      return `data:${ext};base64,${data}`;
    } else {
      return iPath;
    }
  },
  tpl2string: (cnt) => {
    const data = cnt
      .replace(/[']/g, '\\\'')
      .replace(/[\n\r]+/g, '\\n')
      .replace(/\t/g, '\\t');
    return `'${data}'`;
  }
};

module.exports = util;
