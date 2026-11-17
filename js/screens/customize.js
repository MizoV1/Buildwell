// js/screens/customize.js  |  Owner: C  |  Wireframe 3  |  SR2, SR3, UR3
//
// WHAT TO BUILD
//   [ ] Desk preview (SVG is easiest) drawn in the chosen finish colour: var(--wood-oak) etc.
//   [ ] Drag handle (circle) on the right edge that changes the width while dragging
//       (pointerdown / pointermove / pointerup). Keep width between about 30 and 72 in.
//   [ ] Label: "Drag the circle to change width: 44 in"
//   [ ] Narrower / Wider buttons (for example 2 in per tap)
//   [ ] A note if the desk is wider than the user's space (roomWidth)
//   [ ] Finish choices: Oak, Walnut, Maple (buttons with aria-pressed="true" for the chosen one)
//   [ ] Handle choices: Brushed metal, Black
//   [ ] Close-up view, and comparing two finishes side by side (Maria does this in the scenario)
//   [ ] Voice mock: B.ui.voice(panel, [{ label: 'Make it a little narrower', action: ... }])
//   [ ] Fill in the agreed prices in js/price.js
//
//   The price bar at the bottom already works and updates itself (B.ui.priceBar).
//
// READS FROM STATE:   deskWidth, roomWidth, finish, handles
// SAVES TO STATE:     deskWidth, finish, handles
//
// TIP for dragging: save with { undo: false } while dragging, then once at the end call
//   B.router.pushUndo('deskWidth', widthBeforeDrag);
// so one Undo click reverses the whole drag.
//
// PATTERNS (see js/screens/home.js for a complete working screen):
//   const width = B.state.get('deskWidth');
//   B.state.set('deskWidth', width - 2);
//   B.router.refresh();
//   B.ui.toast('Width: ' + (width - 2) + ' in');

(function (B) {
  'use strict';

  B.screens.customize = {
    render: function (container) {
      B.ui.toolbar(container);

      // ---- Replace everything below with your real screen ----
      B.ui.placeholder(container, {
        title: 'Customize your desk',
        label: 'Wireframe 3 · Area C · SR2, SR3, UR3',
        boxes: [
          {
            title: 'Desk preview with drag handle',
            ref: 'Wireframe 3, left side',
            items: ['Desk drawn in the chosen finish', 'Drag the circle to change width', 'Width label + Narrower / Wider buttons', 'Note if wider than the space']
          },
          {
            title: 'Finish',
            ref: 'Wireframe 3, top right',
            items: ['Oak, Walnut, Maple']
          },
          {
            title: 'Handles',
            ref: 'Wireframe 3, right side',
            items: ['Brushed metal, Black']
          },
          {
            title: 'Close-up and compare',
            ref: 'Wireframe 3 · Scenario',
            items: ['Close-up of the chosen finish', 'Compare two finishes side by side']
          },
          {
            title: 'Voice mock',
            ref: 'Storyboard frame 6',
            items: ['B.ui.voice(...) with "Make it a little narrower", "Choose oak"']
          }
        ]
      });

      // Already works: live price + delivery bar with the button to the next screen (keep this)
      B.ui.priceBar(container, { label: 'Review order', go: 'review' });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
