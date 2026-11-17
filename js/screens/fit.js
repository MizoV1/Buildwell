// js/screens/fit.js  |  Owner: B  |  Wireframes 2 and 4  |  SR4, UR2, UR4
//
// WHAT TO BUILD
//   Step 1: measure (Wireframe 2, right side)
//   [ ] Simulated camera view (a styled box, no real camera) showing the measured width
//   [ ] "We measured 48 in. Is that right?" with a big "Yes, that is right" button
//   [ ] "Not right?" input: number + in/cm choice + "Use my measurement" (convert cm to in)
//   [ ] Show an error message if the number is empty or unrealistic
//
//   Step 2: result (Wireframe 2, left side)
//   [ ] Banner: "Maximum width that fits: 48 in"
//   [ ] True-scale drawing (SVG is easiest): new desk, dashed outline of the old desk (40 in),
//       a person silhouette for scale, and the width limit
//   [ ] "Re-measure my space" goes back to step 1
//
//   Step 2, too wide (Wireframe 4)
//   [ ] Warning banner in orange: "Too wide: the maximum width that fits is 48 in"
//   [ ] Show the part of the desk past the limit
//   [ ] "Make it fit (48 in)"  -> deskWidth = roomWidth
//   [ ] "Keep 52 in anyway"    -> ask first with B.ui.confirm(...), then keepAnyway = true
//   [ ] "Re-measure my space"
//
//   [ ] Voice mock: B.ui.voice(panel, [{ label: 'Yes, that’s right', action: ... }, ...])
//
// READS FROM STATE:   measuredWidth, roomWidth, roomConfirmed, deskWidth
// SAVES TO STATE:     roomWidth, roomConfirmed, deskWidth, keepAnyway (keepAnyway with { undo: false })
//
// TIP: use roomConfirmed (true/false) to decide whether to show step 1 or step 2.
//      Saving it with B.state.set means Undo takes the user back a step automatically.
//
// PATTERNS (see js/screens/home.js for a complete working screen):
//   const room = B.state.get('roomWidth');
//   B.state.set('roomConfirmed', true);
//   B.router.refresh();
//   B.ui.confirm('It will not fit. Keep it anyway?', function () { ... }, { yes: 'Keep it', no: 'Go back' });
//   B.ui.toast('Space confirmed: ' + room + ' in');

(function (B) {
  'use strict';

  B.screens.fit = {
    render: function (container) {
      B.ui.toolbar(container);

      // ---- Replace everything below with your real screen ----
      B.ui.placeholder(container, {
        title: 'Check the fit',
        label: 'Wireframes 2 and 4 · Area B · SR4, UR2, UR4',
        boxes: [
          {
            title: 'Camera scan (simulated)',
            ref: 'Wireframe 2 · Storyboard frame 3',
            items: ['Fake camera view with guide text', '"We measured 48 in. Is that right?"', '"Yes, that is right" button']
          },
          {
            title: 'Enter your own measurement',
            ref: 'Wireframe 2, right side',
            items: ['Number input + in / cm', '"Use my measurement" button', 'Error message for bad input']
          },
          {
            title: 'True-scale drawing',
            ref: 'Wireframe 2, left side · Storyboard frame 5',
            items: ['Banner: maximum width that fits', 'New desk at true scale', 'Person silhouette + dashed old desk', '"Re-measure my space"']
          },
          {
            title: 'Too-wide warning',
            ref: 'Wireframe 4',
            items: ['Orange warning banner (52 in vs 48 in)', 'Make it fit (48 in)', 'Keep 52 in anyway (asks to confirm)', 'Re-measure my space']
          },
          {
            title: 'Voice mock',
            ref: 'Storyboard frame 6',
            items: ['B.ui.voice(...) with "Yes, that’s right" and "Make it a little narrower"']
          }
        ],
        next: { label: 'Continue to customize', go: 'customize' }
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
