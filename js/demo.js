// js/demo.js  |  Owner: A  |  Hidden demo panel for recording and testing
// Press D (or open index.html?demo) to show it.
// Jump to any screen, change what the scan returns, create an order, advance its stage, reset.

(function (B) {
  'use strict';

  const SCREENS = ['home', 'style', 'fit', 'customize', 'review', 'checkout', 'orders', 'help'];
  let panel = null;

  function build() {
    panel = document.createElement('aside');
    panel.className = 'demo-panel';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Demo panel');
    panel.innerHTML =
      '<p class="demo-title">Demo panel <span class="demo-note">(press D to hide)</span></p>' +
      '<label class="demo-row">Jump to ' +
        '<select class="demo-jump"><option value="">Choose a screen</option>' +
          SCREENS.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('') +
        '</select></label>' +
      '<p class="demo-row">Scan returns: ' +
        '<button type="button" data-scan="48">48 in</button> ' +
        '<button type="button" data-scan="40">40 in</button></p>' +
      '<p class="demo-row">' +
        '<button type="button" class="demo-order">Create sample order</button> ' +
        '<button type="button" class="demo-advance">Advance order stage</button></p>' +
      '<p class="demo-row"><button type="button" class="demo-reset">Reset everything</button></p>';
    document.body.appendChild(panel);

    panel.querySelector('.demo-jump').addEventListener('change', function (e) {
      if (e.target.value) B.router.go(e.target.value);
      e.target.value = '';
    });

    panel.querySelectorAll('[data-scan]').forEach(function (b) {
      b.addEventListener('click', function () {
        B.state.set('measuredWidth', Number(b.getAttribute('data-scan')), { undo: false });
        B.state.set('roomConfirmed', false, { undo: false });
        if (B.router.current() === 'fit') B.router.refresh();
        B.ui.toast('Scan will return ' + b.getAttribute('data-scan') + ' in');
      });
    });

    panel.querySelector('.demo-order').addEventListener('click', function () {
      if (!B.state.get('style')) B.state.set('style', 'simple', { undo: false });
      B.state.set('order', { id: 'BW-1042', stage: 0, notify: true }, { undo: false });
      B.router.go('orders');
    });

    panel.querySelector('.demo-advance').addEventListener('click', function () {
      const order = B.state.get('order');
      if (!order) { B.ui.toast('No order yet'); return; }
      const stage = Math.min(B.orderStages.length - 1, order.stage + 1);
      B.state.set('order', Object.assign({}, order, { stage: stage }), { undo: false });
      if (B.router.current() === 'orders') B.router.refresh();
      B.ui.toast('Stage: ' + B.orderStages[stage]);
    });

    panel.querySelector('.demo-reset').addEventListener('click', function () {
      B.state.reset();
      B.ui.applyTextSize();
      B.ui.applyMode();
      B.router.start('home');
      B.ui.toast('Reset');
    });
  }

  function toggle() {
    panel.hidden = !panel.hidden;
  }

  B.demo = {
    init: function () {
      build();
      if (/[?&]demo\b/.test(window.location.search)) panel.hidden = false;
      document.addEventListener('keydown', function (e) {
        const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
        if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'd' || e.key === 'D')) toggle();
      });
    }
  };
})(window.Buildwell);
