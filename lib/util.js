'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');
const REG = require('./reg');

const util = {
  isSameHost: (p1, p2) => {
    if (p1.match(REG.PATH_IS_ABSLURE) && p2.match(REG.PATH_IS_ABSLURE)) {
      return true;
    } else if (p1.match(REG.IS_HTTP) && p2.match(REG.IS_HTTP)) {
      return new url.parse(p1).hostname == url.parse(p2).hostname;
    } else {
      return false;
    }
  },
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
