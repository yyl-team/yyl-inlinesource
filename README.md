# yyl-inlinesouce
## 简介
* 为 html 文件提供 script, link inline 代码内联语法糖
* 为 html 文件中 style 标签 中的图片地址, img 标签 src 属性 提供 xx.png?__inline 图片 base64 转化语法糖
* 为 js 文件 提供 `__inline('./xx.tpl')` 模板文件内置 的语法糖
* 为 js 文件 提供 `__inline('./xx.png')` 图片 base64 转化语法糖

## 使用说明
### script, link 标签内联写法

这是 link 标签 和 script 标签的 内联写法
```
<link rel="stylesheet" href="./css/demo.css" type="text/css" charset="utf-8" inline/>
<script src="./js/demo.js" inline></script>
```

### img 标签 base 64 置换写法
这是 img标签 base64 的写法
```
<img src="./img/logo.png?__inline" />
```

构建完成后会变成base64格式
```
<img src="data:png;base64,......" />
```

### js 文件tpl 内联写法
假设有 box.tpl 文件:
```
<span class="num">
  <span class='num-cnt'>123</span>
</span>
```

我们若在 js 这样调用
```
var tpl = __inline('../tpl/box.tpl');
```

则在构建完成后会变为:
```
var tpl = '<span class="num">\n  <span class=\'num-cnt\'>123</span>\n</span>\n';
```
### js 文件img base64 写法

我们若在 js 这样调用
```
var avatar = __inline('../img/logo.png');
```

则在构建完成后会变为:
```
var avatar = 'data:png;base64,......';
```

## node 调用方式
```
const inlinesource = require('yyl-inlinesource');
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
```

```
const inlinesource = require('yyl-inlinesource');
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
```

## 参数说明
```
/**
 * @param  {Object}  op         参数
 * @param  {String}  op.baseUrl 文件路径
 * @param  {Buffer}  op.content 文件内容 
 * @param  {String}  op.type    文件类型, js|html
 * @return {Promise} Promise    返回一个 Promise 对象
 */
inlinesource(op)
```

## 历史版本
[这里](./history.md)
