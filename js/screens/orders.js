// js/screens/orders.js  |  Owner: D  |  Wireframe 6  |  SR7, SR8
(function (B) {
  'use strict';

  const FINISH_NAMES = {
    oak: 'Oak',
    walnut: 'Walnut',
    maple: 'Maple'
  };

  const HANDLE_NAMES = {
    brushed: 'Brushed metal',
    black: 'Black'
  };

  function formatSummary(s) {
    const width = Number(s.deskWidth || 44);
    const finish = FINISH_NAMES[s.finish] || s.finish || 'Oak';
    const handles = HANDLE_NAMES[s.handles] || s.handles || 'Brushed metal';
    return width + ' in desk · ' + finish + ' · ' + handles;
  }

  B.screens.orders = {
    render: function (container) {
      B.ui.toolbar(container);

      const s = B.state.all();
      const order = B.state.get('order');
      const stages = B.orderStages || [
        'Order confirmed',
        'In production',
        'Assembly',
        'Quality check',
        'Shipped',
        'Delivered'
      ];
      const deliveryWeeks = s.delivery || 5;

      const section = document.createElement('section');
      section.className = 'orders';

      if (!order) {
        section.innerHTML =
          '<h1 class="orders-title">My Orders</h1>' +
          '<div class="card orders-empty">' +
            '<p class="orders-empty-text">You don\'t have any orders yet.</p>' +
            '<div class="orders-empty-actions">' +
              '<button type="button" class="btn btn-primary" data-go="style">Start designing</button>' +
              '<button type="button" class="btn btn-secondary" data-go="help">Help</button>' +
            '</div>' +
          '</div>';
        container.appendChild(section);
        return;
      }

      const currentStageIndex = Math.max(0, Math.min(stages.length - 1, Number(order.stage || 0)));
      const canCancel = currentStageIndex === 0;
      const notifyOn = order.notify !== false;

      const timelineItemsHtml = stages.map(function (stageName, idx) {
        const isDone = idx < currentStageIndex;
        const isCurrent = idx === currentStageIndex;
        const stateClass = isCurrent
          ? 'orders-step-current'
          : (isDone ? 'orders-step-done' : 'orders-step-upcoming');
        const markerSymbol = isDone ? '✓' : (isCurrent ? '●' : '');

        return (
          '<li class="orders-step ' + stateClass + '">' +
            '<span class="orders-marker" aria-hidden="true">' + markerSymbol + '</span>' +
            '<span class="orders-step-label">' + stageName + '</span>' +
            (isCurrent ? '<span class="orders-here">You are here</span>' : '') +
          '</li>'
        );
      }).join('');

      section.innerHTML =
        '<h1 class="orders-title">My Orders</h1>' +
        '<p class="guided-hint">Follow each manufacturing stage on the left. Before production starts, you can cancel or change your order on the right.</p>' +

        '<div class="orders-grid">' +
          '<div class="card orders-timeline-card">' +
            '<h2 class="orders-heading">Status timeline</h2>' +
            '<ol class="orders-timeline">' +
              timelineItemsHtml +
            '</ol>' +
          '</div>' +

          '<div class="card orders-details-card">' +
            '<h2 class="orders-heading">Order ' + order.id + '</h2>' +
            '<p class="orders-summary"><strong>Desk:</strong> ' + formatSummary(s) + '</p>' +
            '<p class="orders-delivery"><strong>Estimated delivery:</strong> about ' + deliveryWeeks + ' weeks</p>' +

            '<div class="orders-controls">' +
              '<button type="button" class="btn btn-secondary orders-notify-btn" aria-pressed="' + (notifyOn ? 'true' : 'false') + '">' +
                'Notify me at each stage: ' + (notifyOn ? 'On' : 'Off') +
              '</button>' +

              (canCancel
                ? '<button type="button" class="btn btn-secondary orders-cancel-btn">Cancel or change order</button>'
                : '<button type="button" class="btn btn-secondary orders-cancel-btn" disabled>Cancel or change (closed: production has started)</button>') +
            '</div>' +

            '<hr>' +

            '<div class="orders-footer-actions">' +
              '<button type="button" class="btn btn-secondary" data-go="help">Help</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      container.appendChild(section);

      const notifyBtn = section.querySelector('.orders-notify-btn');
      notifyBtn.addEventListener('click', function () {
        const nextNotify = !notifyOn;
        B.state.set('order', Object.assign({}, order, { notify: nextNotify }), { undo: false });
        B.router.refresh();
        B.ui.toast('Stage notifications: ' + (nextNotify ? 'On' : 'Off'));
      });

      const cancelBtn = section.querySelector('.orders-cancel-btn');
      if (canCancel && cancelBtn) {
        cancelBtn.addEventListener('click', function () {
          B.ui.confirm(
            'Cancel order ' + order.id + ' before production starts?',
            function () {
              B.state.set('order', null, { undo: false });
              B.router.refresh();
              B.ui.toast('Order cancelled');
            },
            { yes: 'Cancel order', no: 'Keep order' }
          );
        });
      }

      B.state.onChange(function (key, updatedState) {
        if (key === 'order' && updatedState && updatedState.order && updatedState.order.notify !== false) {
          const idx = Math.max(0, Math.min(stages.length - 1, Number(updatedState.order.stage || 0)));
          if (idx > 0) {
            B.ui.toast('Update for ' + updatedState.order.id + ': ' + stages[idx]);
          }
        }
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);