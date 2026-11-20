
// js/screens/style.js | Owner: B | Storyboard frame 2 | SR1

(function (B) {
  'use strict';

  B.screens.style = {
    render: function (container) {
      B.ui.toolbar(container);

      // Read the previously selected style, if one exists.
      const savedStyle = B.state.get('style');

      const desks = [
        {
          id: 'classic-oak',
          name: 'Classic Oak',
          description: 'A simple, timeless wooden desk.',
          width: 42,
          appearance: 'oak'
        },
        {
          id: 'modern-walnut',
          name: 'Modern Walnut',
          description: 'A clean, modern look for your office.',
          width: 46,
          appearance: 'walnut'
        },
        {
          id: 'executive',
          name: 'Executive',
          description: 'A larger desk with extra workspace.',
          width: 52,
          appearance: 'executive'
        }
      ];

      const section = document.createElement('section');
      section.className = 'style-screen';

      section.innerHTML =
        '<div class="style-heading">' +
          '<p class="style-step">STEP 1 OF 2</p>' +
          '<h1>Choose your desk style</h1>' +
          '<p>Start by choosing a desk that fits your needs and your space.</p>' +
        '</div>' +

        '<div class="style-categories">' +
          '<span class="style-category-label">Categories</span>' +
          '<div class="style-category-list">' +
            '<button type="button" class="category-btn active">Desks</button>' +
            '<button type="button" class="category-btn" disabled>Chairs · Coming soon</button>' +
            '<button type="button" class="category-btn" disabled>Tables · Coming soon</button>' +
            '<button type="button" class="category-btn" disabled>Shelves · Coming soon</button>' +
          '</div>' +
        '</div>' +

        '<div class="style-options-heading">' +
          '<h2>Available desk styles</h2>' +
          '<p>Select a style to see its starting dimensions.</p>' +
        '</div>' +

        '<div class="style-cards">' +

          desks.map(function (desk) {
            const selected = savedStyle === desk.id;

            return (
              '<button type="button" class="style-card ' +
                (selected ? 'selected' : '') +
                '" data-style="' + desk.id + '" aria-pressed="' +
                selected + '">' +

                '<span class="style-check" aria-hidden="true">✓</span>' +

                '<span class="desk-picture ' + desk.appearance + '">' +
                  '<span class="desk-top"></span>' +
                  '<span class="desk-leg left"></span>' +
                  '<span class="desk-leg right"></span>' +
                  '<span class="desk-support"></span>' +
                '</span>' +

                '<span class="style-card-info">' +
                  '<span class="style-card-name">' + desk.name + '</span>' +
                  '<span class="style-card-description">' +
                    desk.description +
                  '</span>' +
                  '<span class="style-card-width">' +
                    desk.width + ' inches wide' +
                  '</span>' +
                '</span>' +

              '</button>'
            );
          }).join('') +

        '</div>' +

        '<div class="guided-hint">' +
          '<span class="guided-hint-icon">i</span>' +
          '<p><strong>Need help?</strong> Choose the desk that looks best to you. ' +
          "You can customize its size and materials later. We'll also help " +
          'you check whether it fits in your room.</p>' +
        '</div>' +

        '<div class="style-footer">' +
          '<p class="style-selection-message">Please select a desk to continue.</p>' +
          '<button type="button" class="btn btn-primary style-continue" disabled>' +
            'Continue' +
          '</button>' +
        '</div>';

      container.appendChild(section);

      const cards = section.querySelectorAll('[data-style]');
      const continueButton = section.querySelector('.style-continue');
      const message = section.querySelector('.style-selection-message');

      // Restore an existing selection when returning to this screen.
      let selectedStyle = savedStyle || null;

      function updateSelection() {
        cards.forEach(function (card) {
          const isSelected =
            card.getAttribute('data-style') === selectedStyle;

          card.classList.toggle('selected', isSelected);
          card.setAttribute('aria-pressed', String(isSelected));
        });

        continueButton.disabled = !selectedStyle;

        if (selectedStyle) {
          const chosenDesk = desks.find(function (desk) {
            return desk.id === selectedStyle;
          });

          message.textContent =
            chosenDesk.name + ' selected · ' +
            chosenDesk.width + ' inches wide';
        } else {
          message.textContent = 'Please select a desk to continue.';
        }
      }

      // Handle clicking a desk card.
      cards.forEach(function (card) {
        card.addEventListener('click', function () {
          selectedStyle = card.getAttribute('data-style');

          const chosenDesk = desks.find(function (desk) {
            return desk.id === selectedStyle;
          });

          // Save the selected style and its starting width.
          B.state.set('style', chosenDesk.id);
          B.state.set('deskWidth', chosenDesk.width);

          // Reset the "keep anyway" choice for a new desk.
          B.state.set('keepAnyway', false, { undo: false });

          updateSelection();

          B.ui.toast(chosenDesk.name + ' selected');
        });
      });

      // Continue to the room-fit screen.
      continueButton.addEventListener('click', function () {
        if (!selectedStyle) {
          return;
        }

        B.router.go('fit');
      });

      updateSelection();
    },

    onEnter: function () {}
  };
})(window.Buildwell);
