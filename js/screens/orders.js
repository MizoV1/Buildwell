// js/screens/orders.js  |  Owner: D  |  Wireframe 6  |  SR7, SR8
//
// WHAT TO BUILD
//   [ ] If there's no order yet: "You don't have any orders yet" + a button to start designing
//   [ ] Timeline of the stages in B.orderStages (Order confirmed ... Delivered):
//       done stages ticked, the current stage highlighted with "You are here"
//   [ ] Order summary: order number, desk details, estimated delivery
//   [ ] "Notify me at each stage: On / Off" toggle
//   [ ] "Cancel or change order": only works at stage 0. Ask first with B.ui.confirm(...).
//       After that it shows as disabled: "Cancel or change (closed: production has started)"
//   [ ] Help button (data-go="help")
//   [ ] Nice extra: a pretend notification when the stage moves on (e.g. "Your desk has shipped")
//
// READS FROM STATE:   order, deskWidth, finish, handles, delivery
// SAVES TO STATE:     order (notify on/off, or null when cancelled), with { undo: false }
//
// TIP: press D → "Create sample order", then "Advance order stage" to test every stage.
//
// PATTERNS (see js/screens/home.js for a complete working screen):
//   const order = B.state.get('order');          // { id, stage, notify } or null
//   const stages = B.orderStages;                // ['Order confirmed', 'In production', ...]
//   B.state.set('order', Object.assign({}, order, { notify: !order.notify }), { undo: false });

(function (B) {
  'use strict';

  B.screens.orders = {
    render: function (container) {
      B.ui.toolbar(container);

      // ---- Replace everything below with your real screen ----
      B.ui.placeholder(container, {
        title: 'My Orders',
        label: 'Wireframe 6 · Area D · SR7, SR8',
        boxes: [
          {
            title: 'Status timeline',
            ref: 'Wireframe 6, left side',
            items: ['Order confirmed → In production → Assembly → Quality check → Shipped → Delivered', 'Done stages ticked, current stage "You are here"']
          },
          {
            title: 'My desk order',
            ref: 'Wireframe 6, right side',
            items: ['Order number and desk details', 'Estimated delivery', 'Notify me at each stage: On / Off']
          },
          {
            title: 'Cancel window',
            ref: 'Wireframe 6, right side',
            items: ['Cancel or change (asks to confirm) before production', 'Disabled once production has started', 'Help button']
          }
        ]
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
