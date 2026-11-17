// js/state.js  |  Owner: A  |  Shared data for every screen
// Read with Buildwell.state.get('deskWidth'), change with Buildwell.state.set('deskWidth', 46).
// set() records the old value so the Undo button can reverse it.
// Pass { undo: false } for settings that should not be undoable (text size, language).

window.Buildwell = window.Buildwell || {};
Buildwell.screens = Buildwell.screens || {};
Buildwell.ui = Buildwell.ui || {};

// Order stages used by My Orders and the demo panel
Buildwell.orderStages = ['Order confirmed', 'In production', 'Assembly', 'Quality check', 'Shipped', 'Delivered'];

(function (B) {
  'use strict';

  function defaults() {
    return {
      mode: null,            // 'guided' or 'standard'
      lang: 'en',            // 'en' or 'es' (Home screen only)
      textSize: 1,           // 1 = 100% ... 2 = 200% (A+ button)
      furniture: 'desk',
      style: null,           // 'simple' | 'classic' | 'compact'
      measuredWidth: 48,     // what the simulated camera scan "measures" (inches)
      roomWidth: 48,         // the width the user confirmed (inches)
      roomConfirmed: false,  // has the user confirmed or entered the width?
      deskWidth: 44,         // inches
      keepAnyway: false,     // user chose to keep a desk that is too wide
      finish: 'oak',         // 'oak' | 'walnut' | 'maple'
      handles: 'brushed',    // 'brushed' | 'black'
      price: 0,              // calculated by price.js, do not set by hand
      delivery: 0,           // weeks, calculated by price.js
      customer: { name: '', address: '', city: '', postcode: '', phone: '' },
      order: null            // { id, stage, notify } once the order is placed
    };
  }

  let data = defaults();
  let listeners = [];

  function recalc() {
    if (B.price) {
      const p = B.price.calc(data);
      data.price = p.total;
      data.delivery = p.weeks;
    }
  }

  function notify(key) {
    listeners.slice().forEach(function (fn) {
      try { fn(key, data); } catch (err) { console.error(err); }
    });
  }

  B.state = {
    get: function (key) {
      return data[key];
    },

    all: function () {
      return data;
    },

    set: function (key, value, options) {
      if (!(key in data)) {
        console.warn('Buildwell.state: unknown field "' + key + '". Add it to defaults() in state.js.');
      }
      const old = data[key];
      if (old === value) return;
      data[key] = value;
      recalc();
      const undoable = !options || options.undo !== false;
      if (undoable && B.router) B.router.pushUndo(key, old, true);
      notify(key);
    },

    // Run fn every time any value changes. Listeners are cleared on each screen change.
    onChange: function (fn) {
      listeners.push(fn);
    },

    clearListeners: function () {
      listeners = [];
    },

    notify: notify,

    reset: function () {
      data = defaults();
      recalc();
      notify('reset');
    }
  };
})(window.Buildwell);
