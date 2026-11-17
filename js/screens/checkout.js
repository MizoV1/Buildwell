// js/screens/checkout.js  |  Owner: D  |  Storyboard frame 8  |  SR6
//
// WHAT TO BUILD
//   [ ] Delivery details form: name, address, city, postal code (required), phone (optional)
//       Each input has a visible <label>. Show a clear message next to any missing field.
//   [ ] Mock payment: card fields with a note "Demo only. No real payment is taken."
//   [ ] Total price shown
//   [ ] "Place order": check the form, then save the order and show a confirmation:
//       "Your order has been sent to the factory", order number, delivery estimate,
//       and a "View My Orders" button
//
// READS FROM STATE:   customer, price, delivery, order
// SAVES TO STATE:     customer (as the user types, with { undo: false })
//                     order = { id: 'BW-1042', stage: 0, notify: true }  (with { undo: false })
//
// TIP: if B.state.get('order') already exists, show the confirmation instead of the form.
//
// PATTERNS (see js/screens/home.js for a complete working screen):
//   B.state.set('order', { id: 'BW-1042', stage: 0, notify: true }, { undo: false });
//   B.router.refresh();
//   B.ui.toast('Order placed');

(function (B) {
  'use strict';

  B.screens.checkout = {
    render: function (container) {
      B.ui.toolbar(container);

      // ---- Replace everything below with your real screen ----
      B.ui.placeholder(container, {
        title: 'Delivery and payment',
        label: 'Storyboard frame 8 · Area D · SR6',
        boxes: [
          {
            title: 'Delivery details',
            ref: 'Information hierarchy: Checkout',
            items: ['Name, address, city, postal code, phone (optional)', 'Message next to any missing field']
          },
          {
            title: 'Payment (demo)',
            ref: 'Storyboard frame 8',
            items: ['Card fields', '"Demo only. No real payment is taken."', 'Total price', 'Place order button']
          },
          {
            title: 'Sent to the factory',
            ref: 'Storyboard frame 8',
            items: ['Confirmation message + order number', 'Delivery estimate', 'View My Orders button']
          }
        ],
        next: { label: 'Go to My Orders', go: 'orders' }
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
