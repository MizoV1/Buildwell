// js/main.js  |  Owner: A  |  Starts the app (loads last)

(function (B) {
  'use strict';

  // Any button or link with data-go="screenName" opens that screen
  document.addEventListener('click', function (e) {
    const target = e.target.closest('[data-go]');
    if (!target || target.disabled) return;
    e.preventDefault();
    B.router.go(target.getAttribute('data-go'));
  });

  function start() {
    B.state.reset();          // also calculates the first price
    B.ui.applyTextSize();
    B.ui.applyMode();
    B.demo.init();
    B.router.start('home');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window.Buildwell);
