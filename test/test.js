'use strict';
const path = require('path');
const fs = require('fs');
const util = require('yyl-util');
const expect = require('chai').expect;
const inlinesource = require('../index');
const REG = require('../lib/reg');

util.cleanScreen();

const FRAG_PATH = path.join(__dirname, '__frag');
const fn = {
  frag: {
    build() {
      return new Promise((next) => {
        if (fs.existsSync(FRAG_PATH)) {
          util.removeFiles(FRAG_PATH);
        } else {
          util.mkdirSync(FRAG_PATH);
        }

        setTimeout(() => {
          next();
        }, 100);
      });
    },
    destroy() {
      return new Promise((next) => {
        if (fs.existsSync(FRAG_PATH)) {
          util.removeFiles(FRAG_PATH, true);
        }

        setTimeout(() => {
          next();
        }, 100);
      });
    }
  }
};

describe('yyl-inlinesource test', () => {
  it('yyl-inlinesource({type: html}) test', function(done) {
    this.timeout(0);
    const srcPath = path.join(FRAG_PATH, '/html/demo.html');
    const distPath = path.join(FRAG_PATH, 'r.html');
    new util.Promise((next) => { // clear frag
      fn.frag.destroy().then(() => {
        fn.frag.build().then(() => {
          next();
        });
      });
    }).then((next) => { // copy files
      const sourcePath = path.join(__dirname, 'src');
      util.copyFiles(sourcePath, FRAG_PATH, () => {
        next();
      });
    }).then((next) => { // run tasks
      inlinesource({
        baseUrl: path.dirname(srcPath),
        publishPath: path.dirname(distPath),
        type: 'html',
        content: fs.readFileSync(srcPath),
        alias: {
          srcCss: '../css'
        }
      }).then((cnt) => {
        fs.writeFileSync(distPath, cnt);
        next();
      }).catch((er) => {
        throw new Error(er);
      });
    }).then((next) => { // check
      const targetCnt = fs.readFileSync(distPath).toString();

      expect(targetCnt.match(REG.HTML_LINK_TAG_INLINE)).to.equal(null);
      expect(targetCnt.match(REG.HTML_SCRIPT_TAG_INLINE)).to.equal(null);

      targetCnt
        // 检查所有路径都是正确的
        .replace(REG.HTML_PATH_REG, (str, $1, $2, $3, $4) => {
          const iPath = path.join(path.dirname(distPath), $4);
          // console.log([iPath, fs.existsSync(iPath)]);
          expect(fs.existsSync(iPath)).to.deep.equal(true);
          return str;
        })
        // 检查 js 不会出现 __inline 方法
        .replace(REG.HTML_SCRIPT_CONTENT, (str, $1, $2) => {
          const iCnt = $2;
          expect(iCnt.match(REG.JS_INLINE)).to.equal(null);
          return str;
        })
        // 检查 style 中 路径都是正确的
        .replace(REG.HTML_STYLE_CONTENT, (str, $1, $2) => {
          const iCnt = $2;
          const replaceHandle = (str, $1, $2) => {
            const iPath = $2;
            if (iPath.match(REG.CSS_IGNORE_REG)) {
              return str;
            }

            if (iPath.match(REG.IS_HTTP) || iPath.match(REG.CSS_IS_ABSLURE)) {
              return str;
            }

            const fullPath = path.join(path.dirname(distPath), iPath);
            // console.log([fullPath, fs.existsSync(fullPath)]);
            expect(fs.existsSync(fullPath)).to.equal(true);
            return str;
          };
          iCnt
            .replace(REG.CSS_PATH_REG, replaceHandle)
            .replace(REG.CSS_PATH_REG2, replaceHandle);
          return str;
        });
      next();
    }).then((next) => { // clear frag
      fn.frag.destroy().then(() => {
        next();
      });
    }).then(() => { // finished
      done();
    }).start();
  });

  it('yyl-inlinesource({type: js}) test', function(done) {
    this.timeout(0);
    const srcPath = path.join(FRAG_PATH, '/js/demo.js');
    const distPath = path.join(FRAG_PATH, 'r.js');
    new util.Promise((next) => { // clear frag
      fn.frag.destroy().then(() => {
        fn.frag.build().then(() => {
          next();
        });
      });
    }).then((next) => { // copy files
      const sourcePath = path.join(__dirname, 'src');
      util.copyFiles(sourcePath, FRAG_PATH, () => {
        next();
      });
    }).then((next) => { // run tasks
      inlinesource({
        baseUrl: path.dirname(srcPath),
        publishPath: path.dirname(distPath),
        type: 'js',
        content: fs.readFileSync(srcPath)
      }).then((cnt) => {
        fs.writeFileSync(distPath, cnt);
        next();
      }).catch((er) => {
        throw new Error(er);
      });
    }).then((next) => { // check
      const targetCnt = fs.readFileSync(distPath).toString();
      expect(targetCnt).not.equal('');
      // 检查 js 不会出现 __inline 方法
      expect(targetCnt.match(REG.JS_INLINE)).to.equal(null);
      next();
    }).then((next) => { // clear frag
      fn.frag.destroy().then(() => {
        next();
      });
    }).then(() => { // finished
      done();
    }).start();
  });
  it('yyl-inlinesource({type: css}) test', function(done) {
    this.timeout(0);
    const srcPath = path.join(FRAG_PATH, '/css/demo.css');
    const distPath = path.join(FRAG_PATH, 'r.css');
    new util.Promise((next) => { // clear frag
      fn.frag.destroy().then(() => {
        fn.frag.build().then(() => {
          next();
        });
      });
    }).then((next) => { // copy files
      const sourcePath = path.join(__dirname, 'src');
      util.copyFiles(sourcePath, FRAG_PATH, () => {
        next();
      });
    }).then((next) => { // run tasks
      inlinesource({
        baseUrl: path.dirname(srcPath),
        publishPath: path.dirname(distPath),
        type: 'css',
        content: fs.readFileSync(srcPath)
      }).then((cnt) => {
        fs.writeFileSync(distPath, cnt);
        next();
      }).catch((er) => {
        throw new Error(er);
      });
    }).then((next) => { // check
      const iCnt = fs.readFileSync(distPath).toString();
      expect(iCnt).not.equal('');
      const replaceHandle = (str, $1, $2) => {
        const iPath = $2;
        if (iPath.match(REG.CSS_IGNORE_REG)) {
          return str;
        }

        if (iPath.match(REG.IS_HTTP) || iPath.match(REG.CSS_IS_ABSLURE)) {
          return str;
        }

        const fullPath = path.join(path.dirname(distPath), iPath);
        // console.log(fullPath, fs.existsSync(fullPath));
        expect(fs.existsSync(fullPath)).to.equal(true);
        return str;
      };
      iCnt
        .replace(REG.CSS_PATH_REG, replaceHandle)
        .replace(REG.CSS_PATH_REG2, replaceHandle);
      next();
    }).then((next) => { // clear frag
      fn.frag.destroy().then(() => {
        next();
      });
    }).then(() => { // finished
      done();
    }).start();
  });
});
