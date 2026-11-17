// js/screens/help.js  |  Owner: A  |  Information hierarchy: Help  |  UR6
//
// WHAT TO BUILD
//   [ ] Accessibility settings: text size buttons (100%, 125%, 150%, 200%) and Guided / Standard
//       (use B.ui.applyTextSize() and B.ui.applyMode() after saving, like home.js does)
//   [ ] Measuring your space: short steps for using a tape measure
//   [ ] Materials: plain-language notes on oak, walnut and maple
//   [ ] Contact support (demo phone and email)
//   [ ] Line saying nothing has a time limit and Undo / Back are on every screen
//
// READS FROM STATE:   textSize, mode
// SAVES TO STATE:     textSize, mode (both with { undo: false })

(function (B) {
  'use strict';

  B.screens.help = {
    render: function (container) {
      B.ui.toolbar(container);

      // ---- Replace everything below with your real screen ----
      B.ui.placeholder(container, {
        title: 'Help and accessibility',
        label: 'Information hierarchy: Help · Area A · UR6',
        boxes: [
          { title: 'Accessibility settings', items: ['Text size: 100%, 125%, 150%, 200%', 'Guided / Standard mode', 'No time limits; Undo and Back everywhere'] },
          { title: 'Measuring your space', items: ['Short tape-measure steps'] },
          { title: 'Materials', items: ['Oak, walnut, maple in plain language'] },
          { title: 'Contact support', items: ['Demo phone and email'] }
        ]
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
