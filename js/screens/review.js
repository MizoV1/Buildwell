// js/screens/review.js  |  Owner: D  |  Wireframe 5  |  SR3, SR8, UR2
(function (B) {
  'use strict';

  const STYLE_NAMES = {
    simple: 'Simple Desk',
    classic: 'Classic Desk',
    compact: 'Compact Desk'
  };

  const FINISH_NAMES = {
    oak: 'Oak',
    walnut: 'Walnut',
    maple: 'Maple'
  };

  const HANDLE_NAMES = {
    brushed: 'Brushed metal',
    black: 'Black'
  };

  function formatStyle(styleKey) {
    if (!styleKey) return 'Custom Desk';
    return STYLE_NAMES[styleKey] || styleKey;
  }

  function formatFinish(finishKey) {
    return FINISH_NAMES[finishKey] || finishKey || 'Oak';
  }

  function formatHandles(handleKey) {
    return HANDLE_NAMES[handleKey] || handleKey || 'Brushed metal';
  }

  B.screens.review = {
    render: function (container) {
      B.ui.toolbar(container);

      const s = B.state.all();
      const deskWidth = Number(s.deskWidth || 44);
      const roomWidth = Number(s.roomWidth || 48);
      const fitsSpace = deskWidth <= roomWidth;
      const priceInfo = B.price ? B.price.calc(s) : { total: s.price || 0, weeks: s.delivery || 5 };
      const formattedPrice = B.price ? B.price.format(priceInfo.total) : '$' + priceInfo.total;
      const deliveryWeeks = priceInfo.weeks;

      const section = document.createElement('section');
      section.className = 'review';

      section.innerHTML =
        '<h1 class="review-title">Check everything, then confirm</h1>' +
        '<p class="guided-hint">Review each choice below. Tap Change on any line to adjust it before confirming.</p>' +

        '<div class="review-grid">' +
          '<div class="card review-summary-card">' +
            '<h2 class="review-heading">Your desk</h2>' +
            '<dl class="review-list">' +
              '<div class="review-row">' +
                '<div class="review-row-text">' +
                  '<dt>Style</dt>' +
                  '<dd>' + formatStyle(s.style) + '</dd>' +
                '</div>' +
                '<button type="button" class="btn btn-link" data-go="style">Change</button>' +
              '</div>' +

              '<div class="review-row">' +
                '<div class="review-row-text">' +
                  '<dt>Width</dt>' +
                  '<dd>' + deskWidth + ' in</dd>' +
                '</div>' +
                '<button type="button" class="btn btn-link" data-go="customize">Change</button>' +
              '</div>' +

              '<div class="review-row">' +
                '<div class="review-row-text">' +
                  '<dt>Finish</dt>' +
                  '<dd>' + formatFinish(s.finish) + '</dd>' +
                '</div>' +
                '<button type="button" class="btn btn-link" data-go="customize">Change</button>' +
              '</div>' +

              '<div class="review-row">' +
                '<div class="review-row-text">' +
                  '<dt>Handles</dt>' +
                  '<dd>' + formatHandles(s.handles) + '</dd>' +
                '</div>' +
                '<button type="button" class="btn btn-link" data-go="customize">Change</button>' +
              '</div>' +

              '<div class="review-row review-row-fit">' +
                '<div class="review-row-text">' +
                  '<dt>Fits your space</dt>' +
                  '<dd>' +
                    (fitsSpace
                      ? 'Yes (maximum ' + roomWidth + ' in)'
                      : 'No — ' + deskWidth + ' in exceeds ' + roomWidth + ' in space' + (s.keepAnyway ? ' (kept anyway)' : '')) +
                  '</dd>' +
                '</div>' +
                '<button type="button" class="btn btn-link" data-go="fit">Change</button>' +
              '</div>' +
            '</dl>' +

            (!fitsSpace
              ? '<div class="banner banner-warning review-fit-warning" role="alert">' +
                  'Warning: Your desk (' + deskWidth + ' in) is wider than your measured space (' + roomWidth + ' in).' +
                '</div>'
              : '') +

            '<hr>' +

            '<div class="review-totals">' +
              '<p class="review-price">Price: <strong>' + formattedPrice + '</strong></p>' +
              '<p class="review-delivery">Delivery: about ' + deliveryWeeks + ' weeks</p>' +
            '</div>' +

            '<p class="note review-cancel-note">You can cancel any time before production starts.</p>' +
          '</div>' +

          '<div class="card review-actions-card">' +
            '<h2 class="review-heading">Next step</h2>' +
            '<p class="review-action-copy">Check your desk details, then continue to delivery and payment.</p>' +
            '<div class="review-buttons">' +
              '<button type="button" class="btn btn-primary btn-block review-confirm-btn" data-go="checkout">Confirm and go to payment</button>' +
              '<button type="button" class="btn btn-secondary btn-block review-back-btn" data-go="customize">Back to edit</button>' +
            '</div>' +
            '<div class="review-voice-wrap"></div>' +
          '</div>' +
        '</div>';

      container.appendChild(section);

      const voiceWrap = section.querySelector('.review-voice-wrap');
      if (B.ui && typeof B.ui.voice === 'function') {
        B.ui.voice(voiceWrap, [
          {
            label: 'Confirm my order',
            action: function () {
              B.router.go('checkout');
            }
          },
          {
            label: 'Go back to edit',
            action: function () {
              B.router.go('customize');
            }
          }
        ]);
      }
    },

    onEnter: function () {}
  };
})(window.Buildwell);