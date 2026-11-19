// js/screens/checkout.js  |  Owner: D  |  Storyboard frame 8  |  SR6
(function (B) {
  'use strict';

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  B.screens.checkout = {
    render: function (container) {
      B.ui.toolbar(container);

      const s = B.state.all();
      const existingOrder = B.state.get('order');
      const customer = Object.assign(
        { name: '', address: '', city: '', postcode: '', phone: '' },
        s.customer || {}
      );
      const priceInfo = B.price ? B.price.calc(s) : { total: s.price || 0, weeks: s.delivery || 5 };
      const formattedPrice = B.price ? B.price.format(priceInfo.total) : '$' + priceInfo.total;
      const deliveryWeeks = priceInfo.weeks;

      const section = document.createElement('section');
      section.className = 'checkout';

      if (existingOrder) {
        section.innerHTML =
          '<h1 class="checkout-title">Order confirmed</h1>' +
          '<div class="card checkout-confirmation">' +
            '<div class="banner banner-ok checkout-banner" role="status">' +
              'Your order has been sent to the factory' +
            '</div>' +
            '<p class="checkout-detail"><strong>Order number:</strong> ' + escapeHtml(existingOrder.id) + '</p>' +
            '<p class="checkout-detail"><strong>Estimated delivery:</strong> about ' + deliveryWeeks + ' weeks</p>' +
            '<p class="checkout-detail"><strong>Total paid (demo):</strong> ' + formattedPrice + '</p>' +
            '<p class="note checkout-cancel-note">You can cancel any time before production starts.</p>' +
            '<div class="checkout-confirm-actions">' +
              '<button type="button" class="btn btn-primary" data-go="orders">View My Orders</button>' +
              '<button type="button" class="btn btn-secondary" data-go="home">Back to Home</button>' +
            '</div>' +
          '</div>';
        container.appendChild(section);
        return;
      }

      section.innerHTML =
        '<h1 class="checkout-title">Delivery and payment</h1>' +
        '<p class="guided-hint">Fill in your delivery details and demo payment details, then select Place order.</p>' +

        '<form class="checkout-form" novalidate>' +
          '<div class="two-col">' +
            '<div class="card checkout-delivery-card">' +
              '<h2>Delivery details</h2>' +

              '<div class="field">' +
                '<label for="checkout-name">Full name</label>' +
                '<input id="checkout-name" name="name" type="text" value="' + escapeHtml(customer.name) + '" required>' +
                '<p class="field-error" id="error-name" hidden></p>' +
              '</div>' +

              '<div class="field">' +
                '<label for="checkout-address">Street address</label>' +
                '<input id="checkout-address" name="address" type="text" value="' + escapeHtml(customer.address) + '" required>' +
                '<p class="field-error" id="error-address" hidden></p>' +
              '</div>' +

              '<div class="field">' +
                '<label for="checkout-city">City</label>' +
                '<input id="checkout-city" name="city" type="text" value="' + escapeHtml(customer.city) + '" required>' +
                '<p class="field-error" id="error-city" hidden></p>' +
              '</div>' +

              '<div class="field">' +
                '<label for="checkout-postcode">Postal code</label>' +
                '<input id="checkout-postcode" name="postcode" type="text" value="' + escapeHtml(customer.postcode) + '" required>' +
                '<p class="field-error" id="error-postcode" hidden></p>' +
              '</div>' +

              '<div class="field">' +
                '<label for="checkout-phone">Phone (optional)</label>' +
                '<input id="checkout-phone" name="phone" type="tel" value="' + escapeHtml(customer.phone) + '">' +
              '</div>' +
            '</div>' +

            '<div class="card checkout-payment-card">' +
              '<h2>Payment (demo)</h2>' +
              '<p class="note checkout-demo-note">Demo only. No real payment is taken.</p>' +

              '<div class="field">' +
                '<label for="checkout-card">Card number</label>' +
                '<input id="checkout-card" name="card" type="text" inputmode="numeric" placeholder="4242 •••• •••• 4242">' +
                '<p class="field-error" id="error-card" hidden></p>' +
              '</div>' +

              '<div class="checkout-card-row">' +
                '<div class="field">' +
                  '<label for="checkout-expiry">Expiry</label>' +
                  '<input id="checkout-expiry" name="expiry" type="text" placeholder="12/28">' +
                  '<p class="field-error" id="error-expiry" hidden></p>' +
                '</div>' +

                '<div class="field">' +
                  '<label for="checkout-cvc">Security code</label>' +
                  '<input id="checkout-cvc" name="cvc" type="text" inputmode="numeric" placeholder="123">' +
                  '<p class="field-error" id="error-cvc" hidden></p>' +
                '</div>' +
              '</div>' +

              '<hr>' +

              '<p class="checkout-total">Total price: <strong>' + formattedPrice + '</strong></p>' +
              '<p class="checkout-est">Estimated delivery: about ' + deliveryWeeks + ' weeks</p>' +

              '<button type="submit" class="btn btn-primary btn-block checkout-submit-btn">Place order</button>' +
            '</div>' +
          '</div>' +
        '</form>';

      container.appendChild(section);

      const form = section.querySelector('.checkout-form');
      const fields = {
        name: section.querySelector('#checkout-name'),
        address: section.querySelector('#checkout-address'),
        city: section.querySelector('#checkout-city'),
        postcode: section.querySelector('#checkout-postcode'),
        phone: section.querySelector('#checkout-phone'),
        card: section.querySelector('#checkout-card'),
        expiry: section.querySelector('#checkout-expiry'),
        cvc: section.querySelector('#checkout-cvc')
      };

      function saveCustomerField() {
        const updatedCustomer = {
          name: fields.name.value,
          address: fields.address.value,
          city: fields.city.value,
          postcode: fields.postcode.value,
          phone: fields.phone.value
        };
        B.state.set('customer', updatedCustomer, { undo: false });
      }

      ['name', 'address', 'city', 'postcode', 'phone'].forEach(function (key) {
        fields[key].addEventListener('input', function () {
          clearFieldError(key);
          saveCustomerField();
        });
      });

      ['card', 'expiry', 'cvc'].forEach(function (key) {
        fields[key].addEventListener('input', function () {
          clearFieldError(key);
        });
      });

      function setFieldError(key, message) {
        const input = fields[key];
        const errEl = section.querySelector('#error-' + key);
        if (input) input.setAttribute('aria-invalid', 'true');
        if (errEl) {
          errEl.textContent = message;
          errEl.hidden = false;
        }
      }

      function clearFieldError(key) {
        const input = fields[key];
        const errEl = section.querySelector('#error-' + key);
        if (input) input.removeAttribute('aria-invalid');
        if (errEl) {
          errEl.textContent = '';
          errEl.hidden = true;
        }
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        saveCustomerField();

        let firstInvalid = null;
        const requiredCustomer = [
          { key: 'name', label: 'Full name' },
          { key: 'address', label: 'Street address' },
          { key: 'city', label: 'City' },
          { key: 'postcode', label: 'Postal code' }
        ];

        requiredCustomer.forEach(function (item) {
          clearFieldError(item.key);
          if (!fields[item.key].value.trim()) {
            setFieldError(item.key, 'Please enter your ' + item.label.toLowerCase() + '.');
            if (!firstInvalid) firstInvalid = fields[item.key];
          }
        });

        const demoPayment = [
          { key: 'card', label: 'card number' },
          { key: 'expiry', label: 'expiry date' },
          { key: 'cvc', label: 'security code' }
        ];

        demoPayment.forEach(function (item) {
          clearFieldError(item.key);
          if (!fields[item.key].value.trim()) {
            setFieldError(item.key, 'Please enter a demo ' + item.label + '.');
            if (!firstInvalid) firstInvalid = fields[item.key];
          }
        });

        if (firstInvalid) {
          firstInvalid.focus();
          B.ui.toast('Please complete the highlighted fields');
          return;
        }

        B.state.set('order', { id: 'BW-1042', stage: 0, notify: true }, { undo: false });
        B.router.refresh();
        B.ui.toast('Order sent to the factory');
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);