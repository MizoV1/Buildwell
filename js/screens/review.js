// js/screens/review.js  |  Owner: D  |  Wireframe 5  |  SR3, SR8, UR2
//
// WHAT TO BUILD
//   [ ] "Your desk" summary: style, width, finish, handles, and whether it fits the space
//   [ ] A "Change" link on each line that goes back to the right screen (data-go="customize" etc.)
//   [ ] If the desk is wider than roomWidth, show it clearly as a warning
//   [ ] Price and delivery (B.price.format(B.state.get('price')), B.state.get('delivery'))
//   [ ] Cancel-window note: "You can cancel any time before production starts."
//   [ ] "Confirm and go to payment" (to checkout) and "Back to edit" (to customize)
//   [ ] Voice mock: B.ui.voice(panel, [{ label: 'Confirm my order', action: ... }])
//   [ ] Nice extra: after a "Change", return to Review instead of clicking through again
//
// READS FROM STATE:   style, deskWidth, roomWidth, finish, handles, keepAnyway, price, delivery
// SAVES TO STATE:     nothing
//
// TIP: to test on its own, press D → Jump to → review. The starting values are realistic.
//
// PATTERNS (see js/screens/home.js for a complete working screen):
//   const s = B.state.all();          // every value at once: s.deskWidth, s.finish, ...
//   '<button class="btn btn-link" data-go="customize">Change</button>'

(function (B) {
  'use strict';

  B.screens.review = {
    render: function (container) {
      B.ui.toolbar(container);

      // ---- Replace everything below with your real screen ----
      B.ui.placeholder(container, {
        title: 'Check everything, then confirm',
        label: 'Wireframe 5 · Area D · SR3, SR8, UR2',
        boxes: [
          {
            title: 'Your desk summary',
            ref: 'Wireframe 5, left side',
            items: ['Style, width, finish, handles', '"Change" link on each line', 'Fits your space: yes / no']
          },
          {
            title: 'Price, delivery, cancel window',
            ref: 'Wireframe 5, left side',
            items: ['Price and delivery estimate', '"You can cancel any time before production starts."']
          },
          {
            title: 'Actions',
            ref: 'Wireframe 5, right side',
            items: ['Confirm and go to payment', 'Back to edit', 'Voice mock: "Confirm my order"']
          }
        ],
        next: { label: 'Confirm and go to payment', go: 'checkout' }
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
