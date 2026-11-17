// js/components/toolbar.js  |  Owner: A  |  Back, Undo and A+ on every screen (UR2, UR6)
// Call Buildwell.ui.toolbar(container) at the start of every screen's render().

(function (B) {
  'use strict';

  // Step labels shown in Guided mode
  const STEPS = {
    style: [1, 'Choose a style'],
    fit: [2, 'Check the fit'],
    customize: [3, 'Customize'],
    review: [4, 'Review'],
    checkout: [5, 'Delivery and payment']
  };
  const TEXT_SIZES = [1, 1.25, 1.5, 2];   // 100% to 200%

  B.ui.applyTextSize = function () {
    const size = B.state.get('textSize');
    document.documentElement.style.fontSize = (size * 100) + '%';
    // At 150% and above, bars stop sticking to the screen so they don't cover content
    document.documentElement.classList.toggle('text-large', size >= 1.5);
  };

  B.ui.applyMode = function () {
    document.body.classList.toggle('guided', B.state.get('mode') === 'guided');
  };

  B.ui.toolbar = function (container) {
    const screen = B.router.current();
    const step = STEPS[screen];
    const bar = document.createElement('header');
    bar.className = 'toolbar';
    bar.innerHTML =
      '<div class="toolbar-left">' +
        '<button type="button" class="btn btn-secondary toolbar-back"><span aria-hidden="true">←</span> Back</button>' +
        '<span class="toolbar-brand">Buildwell</span>' +
      '</div>' +
      (step ? '<p class="toolbar-step guided-only">Step ' + step[0] + ' of 5: ' + step[1] + '</p>' : '') +
      '<div class="toolbar-right">' +
        '<button type="button" class="btn btn-secondary toolbar-undo"><span aria-hidden="true">↶</span> Undo</button>' +
        '<button type="button" class="btn btn-secondary toolbar-text">A+ Larger text <span class="toolbar-text-size"></span></button>' +
      '</div>';

    const back = bar.querySelector('.toolbar-back');
    const undo = bar.querySelector('.toolbar-undo');
    const text = bar.querySelector('.toolbar-text');

    back.hidden = screen === 'home' || !B.router.canBack();
    back.addEventListener('click', function () { B.router.back(); });
    undo.addEventListener('click', function () { B.router.undo(); });
    text.addEventListener('click', function () {
      const i = TEXT_SIZES.indexOf(B.state.get('textSize'));
      const next = TEXT_SIZES[(i + 1) % TEXT_SIZES.length];
      B.state.set('textSize', next, { undo: false });
      B.ui.applyTextSize();
      B.ui.toast('Text size ' + Math.round(next * 100) + '%');
    });

    function update() {
      undo.disabled = !B.router.canUndo();
      bar.querySelector('.toolbar-text-size').textContent =
        '(' + Math.round(B.state.get('textSize') * 100) + '%)';
    }
    update();
    B.state.onChange(update);

    container.prepend(bar);
    return bar;
  };
})(window.Buildwell);
