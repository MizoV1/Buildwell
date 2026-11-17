// js/components/toast.js  |  Owner: A  |  Feedback messages and confirm dialogs (UR3)
// Buildwell.ui.toast('Width: 46 in')               -> short message at the bottom
// Buildwell.ui.confirm('Keep it anyway?', onYes)   -> Yes / Cancel dialog
// The toast only hides itself after a few seconds; nothing here limits the user's time (UR6).

(function (B) {
  'use strict';

  let timer = null;

  B.ui.toast = function (message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { el.classList.remove('show'); }, 2500);
  };

  // labels: { yes: 'Keep it', no: 'Go back' } (optional)
  B.ui.confirm = function (message, onYes, labels) {
    labels = labels || {};
    const previous = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-message">' +
        '<p id="modal-message" class="modal-message"></p>' +
        '<div class="modal-actions">' +
          '<button type="button" class="btn btn-secondary" data-act="no"></button>' +
          '<button type="button" class="btn btn-primary" data-act="yes"></button>' +
        '</div>' +
      '</div>';
    overlay.querySelector('.modal-message').textContent = message;
    overlay.querySelector('[data-act="no"]').textContent = labels.no || 'Cancel';
    overlay.querySelector('[data-act="yes"]').textContent = labels.yes || 'Yes';

    function close() {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      if (previous && document.body.contains(previous)) previous.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    overlay.addEventListener('click', function (e) {
      const act = e.target.getAttribute('data-act');
      if (act === 'no' || e.target === overlay) close();
      if (act === 'yes') { close(); onYes(); }
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
    overlay.querySelector('[data-act="no"]').focus();
  };
})(window.Buildwell);
