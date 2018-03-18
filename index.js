'use strict';
const OPTION = {
  content: null,
  path: null,
  uglify: false
};
const inlinesource = function(op) {
  op = Object.assign({}, OPTION, op);
};

module.exports = inlinesource;
