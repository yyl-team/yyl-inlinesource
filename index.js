'use strict';
const ishtml = require('./lib/inlinesource-html');
const isjs = require('./lib/inlinesource-js');
const iscss = require('./lib/inlinesource-css');

const OPTION = {
  content: null,
  baseUrl: null,
  publishPath: null,
  type: '',
  alias: {}
};


const inlinesource = function(op) {
  op = Object.assign({}, OPTION, op);
  if (!op.baseUrl) {
    return Promise.reject('yyl-inlinesource run error, op.baseUrl is required');
  } else if (!op.content) {
    return Promise.reject('yyl-inlinesource run error, op.content is required');
  }

  if (!op.publishPath) {
    op.publishPath = op.baseUrl;
  }

  switch (op.type) {
    case 'html':
      return ishtml(op);
    case 'js':
      return isjs(op);
    case 'css':
      return iscss(op);

    default:
      return Promise.resolve(op.content);
  }
};

module.exports = inlinesource;
