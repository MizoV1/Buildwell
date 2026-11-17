// js/screens/style.js  |  Owner: B  |  Storyboard frame 2  |  SR1
//
// WHAT TO BUILD
//   [ ] Category row: Desks (selected) plus a few others shown as "coming soon"
//   [ ] Picture cards for 2-3 desk styles (simple drawings or images, no jargon)
//   [ ] Each style sets a starting desk width. Make one wider than 48 in (e.g. 52 in)
//       so the fit check shows the too-wide warning in Maria's 48 in space.
//   [ ] Show which style is selected; "Continue" only works once one is chosen
//   [ ] Guided hint (class="guided-hint") explaining what to do
//
// READS FROM STATE:   style
// SAVES TO STATE:     style, deskWidth   (also set keepAnyway to false with { undo: false })
//
// PATTERNS (see js/screens/home.js for a complete working screen):
//   const style = B.state.get('style');                  // read a value
//   B.state.set('style', 'classic');                     // save it (Undo can reverse it)
//   B.state.set('deskWidth', 52);
//   B.router.refresh();                                  // redraw this screen
//   B.ui.toast('Classic selected');                      // feedback message (UR3)
//   '<button class="btn btn-primary" data-go="fit">Continue</button>'   // go to next screen

(function (B) {
  'use strict';

  B.screens.style = {
    render: function (container) {
      B.ui.toolbar(container);

      // ---- Replace everything below with your real screen ----
      B.ui.placeholder(container, {
        title: 'Choose a desk style',
        label: 'Storyboard frame 2 · Area B · SR1',
        boxes: [
          {
            title: 'Category row',
            ref: 'Storyboard frame 2',
            items: ['Desks (selected)', 'Chairs, Shelves, Tables shown as "coming soon"']
          },
          {
            title: 'Style picture cards',
            ref: 'Storyboard frame 2: picture-based menu, no jargon',
            items: ['2-3 styles, each with a picture, name and width', 'Tapping one selects it and saves style + deskWidth', 'One style wider than 48 in to trigger the warning']
          },
          {
            title: 'Continue',
            items: ['Shows the selected style', 'Continue to fit check (only after choosing)']
          }
        ],
        next: { label: 'Continue to fit check', go: 'fit' }
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
