// js/router.js  |  Owner: A  |  Moving between screens, Back and Undo (UR2)
// Buildwell.router.go('fit')  -> open a screen
// Buildwell.router.back()     -> previous screen
// Buildwell.router.undo()     -> reverse the last change on this screen
// Any button with data-go="screenName" also opens that screen (see main.js).

(function (B) {
  'use strict';

  const history = [];
  let current = null;
  let undoStack = [];   // changes made on the current screen visit

  function app() {
    return document.getElementById('app');
  }

  function render() {
    const screen = B.screens[current];
    const el = app();
    B.state.clearListeners();
    el.innerHTML = '';
    document.body.dataset.screen = current;
    if (!screen) {
      el.innerHTML = '<p>Screen "' + current + '" is not built yet.</p>';
      return;
    }
    screen.render(el);
  }

  function enter() {
    const screen = B.screens[current];
    if (screen && screen.onEnter) screen.onEnter();
    // Move keyboard / screen reader focus to the new screen's heading
    const heading = app().querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }

  B.router = {
    start: function (name) {
      history.length = 0;
      undoStack = [];
      current = name;
      render();
      enter();
    },

    go: function (name) {
      if (current && current !== name) history.push(current);
      current = name;
      undoStack = [];
      render();
      enter();
    },

    back: function () {
      if (!history.length) return;
      current = history.pop();
      undoStack = [];
      render();
      enter();
    },

    undo: function () {
      const step = undoStack.pop();
      if (!step) {
        B.ui.toast('Nothing to undo');
        return;
      }
      B.state.set(step.key, step.old, { undo: false });
      render();
      B.ui.toast('Undone');
    },

    // Record a change for Undo. state.set() calls this automatically;
    // call it yourself only when you changed a value with { undo: false }
    // (for example, once at the end of a drag).
    pushUndo: function (key, oldValue, silent) {
      undoStack.push({ key: key, old: oldValue });
      if (!silent) B.state.notify('undo');
    },

    // Redraw the current screen (after changing state)
    refresh: function () {
      render();
    },

    canUndo: function () { return undoStack.length > 0; },
    canBack: function () { return history.length > 0; },
    current: function () { return current; }
  };
})(window.Buildwell);
