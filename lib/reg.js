'use strict';
module.exports = {
  // commons
  IS_IMG: /^\.(jpg|jpeg|bmp|gif|webp|png|apng|svga)$/,
  IS_HTTP: /^(http[s]?:)|(\/\/\w)/,

  // for html
  HTML_PATH_REG: /(src|href|data-main|data-original)(\s*=\s*)(['"])([^'"]*)(["'])/ig,
  HTML_SCRIPT_TAG_INLINE: /([\s\t]+)<script [^>]*src\s*=\s*['"]([^'"]+)["'][^>]*inline[^>]*><\/script>/ig,
  HTML_LINK_TAG_INLINE: /([\s\t]+)<link [^>]*href\s*=\s*['"]([^'"]+)["'][^>]*inline[^>]*\/>/ig,
  HTML_IMG_TAG: /(<img [^>]*src\s*=\s*['"])([^'"]+)(["'][^>]*\/>)/ig,
  HTML_SCRIPT_CONTENT: /(<script[^>]*?>)([\s\S]*?)(<\/script>)/ig,
  HTML_STYLE_CONTENT: /(<style[^>]*?>)([\s\S]*?)(<\/style>)/ig,
  IMG_INLINE: /\?__inline$/,

  // for js
  JS_INLINE: /(__inline\s*\(\s*["'])([^'"]+)(['"]\s*\))/g,

  // for css
  CSS_PATH_REG: /(url\s*\(['"]?)([^'"]*?)(['"]?\s*\))/ig,
  CSS_PATH_REG2: /(src\s*=\s*['"])([^'" ]*?)(['"])/ig,
  CSS_IGNORE_REG: /^(about:|data:|javascript:|#|\{\{)/,
  CSS_IS_ABSLURE: /^\//
};
