// js/screens/style.js  |  Owner: B  |  Storyboard frame 2  |  SR1
//
// WHAT THIS SCREEN DOES
//   Shows the furniture categories (only Desks is available) and three desk style cards.
//   Picking a card saves the style, its starting width and its wood finish, then
//   Continue moves on to the fit check.
//
// READS FROM STATE:   style
// SAVES TO STATE:     style, deskWidth, finish, keepAnyway (keepAnyway with { undo: false })

(function (B) {
  'use strict';

  // ===== Desk styles ==========================================================
  // Each style sets a starting width and wood finish. The Executive (52 in) is wider
  // than Maria's 48 in space, so choosing it shows the too-wide warning on the fit check.
  const DESKS = [
    { id: 'classic-oak',   name: 'Classic Oak',   description: 'A simple, timeless wooden desk.',     width: 42, finish: 'oak' },
    { id: 'modern-walnut', name: 'Modern Walnut', description: 'A clean, modern look for your office.', width: 46, finish: 'walnut' },
    { id: 'executive',     name: 'Executive',     description: 'A larger desk with extra workspace.',   width: 52, finish: 'maple' }
  ];

  // ===== Desk drawing (matches the desk on the Customize screen) ==============
  // Same parts and proportions as Customize: a top, a body with a drawer pull,
  // and two legs. Same width scale too (30 to 72 in → 140 to 300 units), so a
  // 52 in desk looks the same width here as it does on Customize.
  function deskPicture(width, finish) {
    const w = Math.round(140 + ((width - 30) / (72 - 30)) * 160);   // drawn width
    const x = (360 - w) / 2;                                         // centred in the card
    const wood = ' style="fill: var(--wood-' + finish + ')"';
    return (
      '<svg class="style-pic" viewBox="0 0 360 210" aria-hidden="true">' +
        '<rect x="' + x + '" y="55" width="' + w + '" height="22" rx="4"' + wood + '/>' +                              // top
        '<rect x="' + (x + 8) + '" y="77" width="' + Math.max(40, w - 16) + '" height="50" rx="3"' + wood + '/>' +       // body
        '<rect class="desk-pull-brushed" x="' + (x + Math.round(w * 0.45)) + '" y="97" width="22" height="6" rx="2"/>' + // drawer pull
        '<rect x="' + (x + 14) + '" y="127" width="14" height="50" rx="2"' + wood + '/>' +                             // left leg
        '<rect x="' + (x + w - 28) + '" y="127" width="14" height="50" rx="2"' + wood + '/>' +                         // right leg
      '</svg>'
    );
  }

  B.screens.style = {
    render: function (container) {
      // Toolbar: Back, Undo and A+ (shared, always first)
      B.ui.toolbar(container);

      // ===== 1. Read the previously selected style, if there is one ===========
      const savedStyle = B.state.get('style');

      const section = document.createElement('section');
      section.className = 'style';

      // ===== 2. Page content ==================================================
      section.innerHTML =
        // --- Heading ---
        '<div class="style-heading">' +
          '<h1>Choose your desk style</h1>' +
          '<p>Start by choosing a desk that fits your needs and your space.</p>' +
        '</div>' +
        '<p class="guided-hint">Tap the picture of the desk you like best, then tap Continue. ' +
          'You can change its size, wood and handles later.</p>' +

        // --- Category row (only Desks is available) ---
        '<div class="style-categories">' +
          '<span class="style-category-label">Categories</span>' +
          '<div class="style-category-list">' +
            // Shared chip buttons: Desks is selected, the others are greyed out
            '<button type="button" class="btn btn-chip" aria-pressed="true">Desks</button>' +
            '<button type="button" class="btn btn-chip" disabled>Chairs · Coming soon</button>' +
            '<button type="button" class="btn btn-chip" disabled>Tables · Coming soon</button>' +
            '<button type="button" class="btn btn-chip" disabled>Shelves · Coming soon</button>' +
          '</div>' +
        '</div>' +

        // --- Style cards ---
        '<div class="style-options-heading">' +
          '<h2>Available desk styles</h2>' +
          '<p>Select a style to see its starting dimensions.</p>' +
        '</div>' +

        '<div class="style-cards">' +
          DESKS.map(function (desk) {
            const selected = savedStyle === desk.id;
            return (
              '<button type="button" class="style-card ' + (selected ? 'selected' : '') + '"' +
                ' data-style="' + desk.id + '" aria-pressed="' + selected + '">' +
                '<span class="style-check" aria-hidden="true">✓</span>' +
                deskPicture(desk.width, desk.finish) +
                '<span class="style-card-info">' +
                  '<span class="style-card-name">' + desk.name + '</span>' +
                  '<span class="style-card-description">' + desk.description + '</span>' +
                  '<span class="style-card-width">' + desk.width + ' inches wide</span>' +
                '</span>' +
              '</button>'
            );
          }).join('') +
        '</div>' +

        // --- Help box (always visible; uses its own class so it doesn't change
        //     the shared .guided-hint used on every other screen) ---
        '<div class="style-help">' +
          '<span class="style-help-icon" aria-hidden="true">i</span>' +
          '<p><strong>Need help?</strong> Choose the desk that looks best to you. ' +
          'You can customize its size and materials later. We\'ll also help ' +
          'you check whether it fits in your room.</p>' +
        '</div>' +

        // --- Selected message and Continue ---
        '<div class="style-footer">' +
          '<p class="style-selection-message">Please select a desk to continue.</p>' +
          '<button type="button" class="btn btn-primary style-continue" disabled>Continue</button>' +
        '</div>';

      container.appendChild(section);

      const cards = section.querySelectorAll('[data-style]');
      const continueButton = section.querySelector('.style-continue');
      const message = section.querySelector('.style-selection-message');

      // Restore an existing selection when returning to this screen
      let selectedStyle = savedStyle || null;

      // ===== 3. Show which card is selected and enable Continue ===============
      function updateSelection() {
        cards.forEach(function (card) {
          const isSelected = card.getAttribute('data-style') === selectedStyle;
          card.classList.toggle('selected', isSelected);
          card.setAttribute('aria-pressed', String(isSelected));
        });

        continueButton.disabled = !selectedStyle;

        const chosen = DESKS.find(function (desk) { return desk.id === selectedStyle; });
        message.textContent = chosen
          ? chosen.name + ' selected · ' + chosen.width + ' inches wide'
          : 'Please select a desk to continue.';
      }

      // ===== 4. Clicking a card: save the style, width and finish =============
      cards.forEach(function (card) {
        card.addEventListener('click', function () {
          selectedStyle = card.getAttribute('data-style');
          const chosen = DESKS.find(function (desk) { return desk.id === selectedStyle; });

          B.state.set('style', chosen.id);
          B.state.set('deskWidth', chosen.width);
          B.state.set('finish', chosen.finish);                  // so Customize shows the same wood
          B.state.set('keepAnyway', false, { undo: false });    // a new desk starts fresh

          updateSelection();
          B.ui.toast(chosen.name + ' selected');
        });
      });

      // ===== 5. Continue to the fit check =====================================
      continueButton.addEventListener('click', function () {
        if (selectedStyle) B.router.go('fit');
      });

      updateSelection();
    },

    onEnter: function () {}
  };
})(window.Buildwell);