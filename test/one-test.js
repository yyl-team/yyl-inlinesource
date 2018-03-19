'use strict';
const path = require('path');
const fs = require('fs');
const inlinesource = require('../index');

const srcPath = path.join(__dirname, 'src/html/demo.html');
const distPath = path.join(__dirname, 'src/r.html');

inlinesource({
  baseUrl: path.dirname(srcPath),
  publishPath: path.dirname(distPath),
  type: 'html',
  content: fs.readFileSync(srcPath)
}).then((cnt) => {
  console.log(cnt);
  fs.writeFileSync(distPath, cnt);
});
