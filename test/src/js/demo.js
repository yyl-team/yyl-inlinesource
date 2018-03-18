(function() {
  var el = document.getElementById('redBox');
  var i = 1;
  setInterval(function() {
    el.innerHTML = i++;
  }, 100);

  var tpl = __inline('../tpl/box.tpl');
  var el2 = document.getElementById('blueBox');
  el2.innerHTML = tpl;
})();
