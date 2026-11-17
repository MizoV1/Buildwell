// js/components/voice-mock.js  |  Owner: A (shared)  |  Simulated "Say it" voice panel (SR5, out of scope)
// Real voice input is out of scope. Each preset phrase runs the same action as a button.
//
// Buildwell.ui.voice(container, [
//   { label: 'Make it a little narrower', action: function () { ... } }
// ]);

(function (B) {
  'use strict';

  B.ui.voice = function (container, phrases) {
    const wrap = document.createElement('div');
    wrap.className = 'voice';
    wrap.innerHTML =
      '<button type="button" class="btn btn-secondary voice-toggle" aria-expanded="false">' +
        '<span aria-hidden="true">🎤</span> Say it (voice)' +
      '</button>' +
      '<div class="voice-panel" hidden>' +
        '<p class="voice-label">Voice preview (simulated)</p>' +
        '<p class="voice-listening">Listening… tap what you would say:</p>' +
        '<div class="voice-phrases"></div>' +
      '</div>';

    const toggle = wrap.querySelector('.voice-toggle');
    const panel = wrap.querySelector('.voice-panel');
    const list = wrap.querySelector('.voice-phrases');

    toggle.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
    });

    (phrases || []).forEach(function (phrase) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-secondary';
      button.textContent = '“' + phrase.label + '”';
      button.addEventListener('click', function () {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        B.ui.toast('Heard: “' + phrase.label + '”');
        phrase.action();
      });
      list.appendChild(button);
    });

    container.appendChild(wrap);
    return wrap;
  };
})(window.Buildwell);
