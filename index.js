'use strict';
const path = require('path');

const ishtml = require('./lib/inlinesource-html');
const isjs = require('./lib/inlinesource-js');

const OPTION = {
  content: null,
  path: null,
  uglify: false
};


const inlinesource = function(op) {
  op = Object.assign({}, OPTION, op);
  if (!op.path) {
    throw new Error(`yyl-inlinesource run error, op.path is null: ${op.path}`);
  }
  const iExt = path.extname(op.path);

  switch (iExt) {
    case '.html':
      return ishtml(op);
    case '.js':
      return isjs(op);

    default:
      return Promise.resolve(op.content);
  }
};

module.exports = inlinesource;
