(function() {
  var el = document.getElementById('redBox');
  var i = 1;
  setInterval(function() {
    el.innerHTML = i++;
  }, 100);

  var tpl = '<span class="num">\n  <span class=\'num-cnt\'>123</span>\n</span>\n';
  var el2 = document.getElementById('blueBox');
  el2.innerHTML = tpl;
})();
