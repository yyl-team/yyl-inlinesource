'use strict';
module.exports = {
  // commons
  IS_IMG: /^\.(jpg|jpeg|bmp|gif|webp|png|apng|svga)$/,
  IS_HTTP: /^(http[s]?:)|(\/\/\w)/,

  // for html
  HTML_PATH: /(src|href|data-main|data-original)(\s*=\s*)(['"])([^'"]*)(["'])/ig,
  HTML_SCRIPT_TAG_INLINE: /([\s\t]+)<script [^>]*src\s*=\s*['"]([^'"]+)["'][^>]*inline[^>]*><\/script>/ig,
  HTML_LINK_TAG_INLINE: /([\s\t]+)<link [^>]*href\s*=\s*['"]([^'"]+)["'][^>]*inline[^>]*\/?>/ig,
  HTML_IMG_TAG: /(<img [^>]*src\s*=\s*['"])([^'"]+)(["'][^>]*\/>)/ig,
  HTML_SCRIPT_CONTENT: /(<script[^>]*?>)([\s\S]*?)(<\/script>)/ig,
  HTML_STYLE_CONTENT: /(<style[^>]*?>)([\s\S]*?)(<\/style>)/ig,
  HTML_SCRIPT_TEMPLATE: /type\s*=\s*['"]text\/html["']/,
  HTML_ALIAS: /^(\{\$)(\w+)(\})/g,
  IMG_INLINE: /\?__inline$/,

  // for js
  JS_INLINE: /(__inline\s*\(\s*["'])([^'"]+)(['"]\s*\))/g,

  // for css
  CSS_PATH: /(url\s*\(['"]?)([^'"]*?)(['"]?\s*\))/ig,
  CSS_PATH2: /(src\s*=\s*['"])([^'" ]*?)(['"])/ig,

  PATH_IGNORE: /^(about:|data:|javascript:|#|\{\{)/,
  PATH_IS_ABSLURE: /^\//
};
