'use strict';
const path = require('path');
const fs = require('fs');
const inlinesource = require('../index');

(() => {
  const srcPath = path.join(__dirname, './src/demo.html');
  const distPath = path.join(__dirname, './dist/demo.html');
  inlinesource({
    baseUrl: path.dirname(srcPath),
    type: 'html',
    content: fs.readFileSync(srcPath)
  }).then((cnt) => {
    console.log(cnt);
    fs.writeFileSync(distPath, cnt);
  });
})();

(() => {
  const srcPath = path.join(__dirname, './src/js/demo.js');
  const distPath = path.join(__dirname, './dist/demo.js');
  inlinesource({
    baseUrl: path.dirname(srcPath),
    type: 'js',
    content: fs.readFileSync(srcPath)
  }).then((cnt) => {
    console.log(cnt);
    fs.writeFileSync(distPath, cnt);
  });
})();
