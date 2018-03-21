'use strict';
const path = require('path');
const fs = require('fs');
const inlinesource = require('../index');

(() => {
  const srcPath = path.join(__dirname, 'src/html/demo.html');
  const distPath = path.join(__dirname, 'src/r.html');

  inlinesource({
    baseUrl: path.dirname(srcPath),
    publishPath: path.dirname(distPath),
    type: 'html',
    content: fs.readFileSync(srcPath)
  }).then((cnt) => {
    // console.log('html =====================');
    // console.log(cnt);
    // console.log('html =====================');
    fs.writeFileSync(distPath, cnt);
  });
})();

(() => {
  const srcPath = path.join(__dirname, 'src/js/demo.js');
  const distPath = path.join(__dirname, 'src/r.js');

  inlinesource({
    baseUrl: path.dirname(srcPath),
    publishPath: path.dirname(distPath),
    type: 'js',
    content: fs.readFileSync(srcPath)
  }).then((cnt) => {
    // console.log('js =====================');
    // console.log(cnt);
    // console.log('js =====================');
    fs.writeFileSync(distPath, cnt);
  });
})();

(() => {
  const srcPath = path.join(__dirname, 'src/css/demo.css');
  const distPath = path.join(__dirname, 'src/r.css');

  inlinesource({
    baseUrl: path.dirname(srcPath),
    publishPath: path.dirname(distPath),
    type: 'css',
    content: fs.readFileSync(srcPath)
  }).then((cnt) => {
    // console.log('css =====================');
    // console.log(cnt);
    // console.log('css =====================');
    fs.writeFileSync(distPath, cnt);
  });
})();

(() => {
  const srcPath = path.join(__dirname, 'dist/html/demo.html');
  const distPath = path.join(__dirname, 'dist/r.html');

  inlinesource({
    baseUrl: path.join(__dirname, './dist/html'),
    publishPath: '/html',
    type: 'html',
    content: fs.readFileSync(srcPath)
  }).then((cnt) => {
    // console.log('html =====================');
    // console.log(cnt);
    // console.log('html =====================');
    fs.writeFileSync(distPath, cnt);
  });
})();

(() => {
  const srcPath = path.join(__dirname, 'dist/js/demo.js');
  const distPath = path.join(__dirname, 'dist/r.js');

  inlinesource({
    baseUrl: path.join(__dirname, './dist/js'),
    publishPath: '/js',
    type: 'js',
    content: fs.readFileSync(srcPath)
  }).then((cnt) => {
    // console.log('js =====================');
    // console.log(cnt);
    // console.log('js =====================');
    fs.writeFileSync(distPath, cnt);
  });
})();

(() => {
  const srcPath = path.join(__dirname, 'dist/css/demo.css');
  const distPath = path.join(__dirname, 'dist/r.css');

  inlinesource({
    baseUrl: path.join(__dirname, './dist/css'),
    publishPath: '/css',
    type: 'css',
    content: fs.readFileSync(srcPath)
  }).then((cnt) => {
    // console.log('css =====================');
    // console.log(cnt);
    // console.log('css =====================');
    fs.writeFileSync(distPath, cnt);
  });
})();
