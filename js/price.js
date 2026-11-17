// js/price.js  |  Owner: A (C fills in the prices)  |  Price and delivery lookup (SR3)
// PLACEHOLDER NUMBERS: change the table below once the group agrees on prices.
// No screen should hard-code a price; always use Buildwell.price.calc(state).

(function (B) {
  'use strict';

  const TABLE = {
    base: 420,           // desk up to baseWidth inches
    baseWidth: 40,
    perInch: 6,          // added for each inch over baseWidth
    finish: { oak: 0, maple: 40, walnut: 80 },
    handles: { black: 0, brushed: 25 },
    baseWeeks: 5,
    finishWeeks: { walnut: 1 }   // extra weeks for some finishes
  };

  B.price = {
    table: TABLE,

    // Returns { total, weeks } for the current choices
    calc: function (s) {
      const over = Math.max(0, s.deskWidth - TABLE.baseWidth);
      const total = TABLE.base
        + over * TABLE.perInch
        + (TABLE.finish[s.finish] || 0)
        + (TABLE.handles[s.handles] || 0);
      const weeks = TABLE.baseWeeks + (TABLE.finishWeeks[s.finish] || 0);
      return { total: Math.round(total), weeks: weeks };
    },

    format: function (amount) {
      return '$' + amount.toLocaleString('en-US');
    }
  };
})(window.Buildwell);
