// js/components/price-bar.js  |  Owner: A (shared)  |  Live price and delivery bar (SR3, UR3)
// Buildwell.ui.priceBar(container, { label: 'Review order', go: 'review' })
// Updates itself whenever the state changes.

(function (B) {
  'use strict';

  B.ui.priceBar = function (container, next) {
    const bar = document.createElement('div');
    bar.className = 'price-bar';
    bar.innerHTML =
      '<p class="price-bar-item">Price: <strong class="price-bar-price"></strong></p>' +
      '<p class="price-bar-item">Delivery: <strong class="price-bar-weeks"></strong></p>';

    if (next) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-primary';
      button.textContent = next.label;
      button.setAttribute('data-go', next.go);
      bar.appendChild(button);
    }

    function update() {
      bar.querySelector('.price-bar-price').textContent = B.price.format(B.state.get('price'));
      bar.querySelector('.price-bar-weeks').textContent = 'about ' + B.state.get('delivery') + ' weeks';
    }
    update();
    B.state.onChange(update);

    container.appendChild(bar);
    return bar;
  };
})(window.Buildwell);
