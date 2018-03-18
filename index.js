'use strict';
const ishtml = require('./lib/inlinesource-html');
const isjs = require('./lib/inlinesource-js');

const OPTION = {
  content: null,
  baseUrl: null,
  type: ''
};


const inlinesource = function(op) {
  op = Object.assign({}, OPTION, op);
  if (!op.baseUrl) {
    return Promise.reject('yyl-inlinesource run error, op.baseUrl is required');
  } else if (!op.content) {
    return Promise.reject('yyl-inlinesource run error, op.content is required');
  }


  switch (op.type) {
    case 'html':
      return ishtml(op);
    case 'js':
      return isjs(op);

    default:
      return Promise.resolve(op.content);
  }
};

module.exports = inlinesource;
