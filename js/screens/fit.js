// js/screens/fit.js  |  Owner: B  |  Wireframes 2 and 4  |  SR4, UR2, UR4
//
// WHAT THIS SCREEN DOES
//   Step 1 (Wireframe 2): a simulated camera scan "measures" the space. The user confirms
//                          it, or types their own measurement in inches or centimetres.
//   Step 2 (Wireframe 2): a size comparison of the new desk, the old desk and a person,
//                          with the room's width limit.
//   Step 2, too wide (Wireframe 4): an orange warning with Make it fit, Keep anyway
//                          (asks to confirm first) and Re-measure.
//
// READS FROM STATE:   measuredWidth, roomWidth, roomConfirmed, deskWidth, style, finish, handles
// SAVES TO STATE:     roomWidth, roomConfirmed, deskWidth, keepAnyway (keepAnyway with { undo: false })
//
// HOW THE TWO STEPS WORK
//   roomConfirmed (true / false) decides which step is shown. It is saved with B.state.set,
//   so pressing Undo after confirming takes the user straight back to Step 1.

(function (B) {
  'use strict';

  // ===== Shared settings ======================================================

  // Friendly names for the style chosen on the previous screen
  const STYLE_NAMES = { 'classic-oak': 'Classic Oak', 'modern-walnut': 'Modern Walnut', executive: 'Executive' };

  // Drawing scale: every width in the size comparison uses the same units per inch
  const SCALE = 5;
  const OLD_DESK_WIDTH = 40;   // the user's current desk, drawn as a dashed outline

  B.screens.fit = {
    render: function (container) {
      // Toolbar: Back, Undo and A+ (shared, always first)
      B.ui.toolbar(container);

      // ===== 1. Read saved information ========================================
      const measuredWidth = Number(B.state.get('measuredWidth')) || 48;
      const roomWidth = Number(B.state.get('roomWidth')) || 48;
      const roomConfirmed = B.state.get('roomConfirmed') === true;
      const deskWidth = Number(B.state.get('deskWidth')) || 44;
      const deskName = STYLE_NAMES[B.state.get('style')] || 'Your desk';
      const finish = B.state.get('finish') || 'oak';          // desk colour, same as Customize
      const handles = B.state.get('handles') || 'brushed';    // drawer pull colour, same as Customize

      // The section that holds the whole screen
      const section = document.createElement('section');
      section.className = 'fit';

      // ===== 2. Actions used by both steps ====================================

      // Save a confirmed room width and move to Step 2
      function confirmMeasurement(width) {
        B.state.set('roomWidth', width);
        B.state.set('roomConfirmed', true);
        B.ui.toast('Space confirmed: ' + width + ' in');
        B.router.refresh();
      }

      // Go back to Step 1 to measure again
      function remeasure() {
        B.state.set('roomConfirmed', false);
        B.router.refresh();
      }

      // ===== 3. STEP 1: measure the space (Wireframe 2) =======================
      function renderMeasurement() {
        section.innerHTML =
          // --- Heading and Guided hint ---
          '<h1>Let\'s check your space</h1>' +
          '<p class="fit-intro">We\'ll help make sure your new desk fits comfortably.</p>' +
          '<p class="guided-hint">Check the measurement below with a tape measure. ' +
            'If it\'s right, tap Yes. If not, type your own number.</p>' +

          '<div class="two-col">' +

            // --- Left: simulated camera scan (no real camera is used) ---
            '<div class="card fit-camera-panel">' +
              '<p class="fit-camera-top"><span class="fit-camera-dot"></span>Room scan (simulated)</p>' +
              '<div class="fit-camera-view" aria-hidden="true">' +
                '<div class="fit-camera-floor"></div>' +
                '<div class="fit-camera-line"></div>' +
                '<div class="fit-camera-label">' + measuredWidth + ' inches</div>' +
                '<div class="fit-camera-corner fit-corner-tl"></div>' +
                '<div class="fit-camera-corner fit-corner-tr"></div>' +
                '<div class="fit-camera-corner fit-corner-bl"></div>' +
                '<div class="fit-camera-corner fit-corner-br"></div>' +
              '</div>' +
              '<p class="fit-camera-caption">This is a simulated camera scan. No camera access is required.</p>' +
            '</div>' +

            // --- Right: confirm, or enter your own measurement ---
            '<div class="card fit-measure-panel">' +
              '<h2>We measured ' + measuredWidth + ' in.</h2>' +
              '<p class="fit-measure-question">Is that right?</p>' +
              '<button type="button" class="btn btn-primary btn-block fit-confirm">Yes, that is right</button>' +

              '<div class="fit-divider"><span></span><p>Or enter it yourself</p><span></span></div>' +

              '<label for="fit-room-measurement">What is the width of your available space?</label>' +
              '<div class="fit-input-row">' +
                '<input type="number" id="fit-room-measurement" min="1" step="any" placeholder="Enter width">' +
                '<select id="fit-measurement-unit" aria-label="Unit">' +
                  '<option value="in">Inches</option>' +
                  '<option value="cm">Centimetres</option>' +
                '</select>' +
              '</div>' +
              '<p class="field-error fit-error" role="alert"></p>' +
              '<button type="button" class="btn btn-secondary btn-block fit-use-measurement">Use my measurement</button>' +
            '</div>' +

          '</div>' +

          // --- Help tip under the two panels ---
          '<div class="fit-help">' +
            '<span class="fit-help-icon" aria-hidden="true">i</span>' +
            '<p><strong>Not sure?</strong> Measure the open width of the area where you want your desk. ' +
            'You can always change this measurement later.</p>' +
          '</div>' +

          // --- Voice mock goes here ---
          '<div class="fit-voice-panel"></div>';

        // --- "Yes, that is right" ---
        section.querySelector('.fit-confirm').addEventListener('click', function () {
          confirmMeasurement(measuredWidth);
        });

        // --- "Use my measurement": check the number, convert cm to inches, save ---
        section.querySelector('.fit-use-measurement').addEventListener('click', function () {
          const input = section.querySelector('#fit-room-measurement');
          const unit = section.querySelector('#fit-measurement-unit').value;
          const error = section.querySelector('.fit-error');
          const enteredValue = Number(input.value);

          function showError(message) {
            error.textContent = message;
            input.setAttribute('aria-invalid', 'true');
            input.focus();
          }

          // Empty, not a number, or zero / negative
          if (input.value.trim() === '' || !Number.isFinite(enteredValue) || enteredValue <= 0) {
            showError('Please enter a valid measurement.');
            return;
          }

          // Convert centimetres to inches, then round to the nearest half inch
          const inches = unit === 'cm' ? enteredValue / 2.54 : enteredValue;
          const rounded = Math.round(inches * 2) / 2;

          // Reject widths outside a realistic room range
          if (rounded < 12 || rounded > 300) {
            showError('Please enter a room width between 12 and 300 inches.');
            return;
          }

          error.textContent = '';
          input.removeAttribute('aria-invalid');
          confirmMeasurement(rounded);
        });

        // --- Voice mock (simulated) ---
        B.ui.voice(section.querySelector('.fit-voice-panel'), [
          { label: 'Yes, that’s right', action: function () { confirmMeasurement(measuredWidth); } },
          { label: 'Let me enter my measurement', action: function () { section.querySelector('#fit-room-measurement').focus(); } }
        ]);
      }

      // ===== 4. Size comparison drawing (used in Step 2) ======================
      // Every width uses the same SCALE. The new desk is drawn the same way as on
      // the Customize screen: a top, a body with a drawer pull, and two legs,
      // in the chosen wood finish and handle colour.
      function createScaleDrawing(room, desk) {
        const startX = 175;
        const roomEnd = startX + room * SCALE;
        const deskW = desk * SCALE;
        const deskEnd = startX + deskW;
        const canvasWidth = Math.max(650, deskEnd + 55, roomEnd + 55);
        const tooWide = desk > room;
        const wood = ' style="fill: var(--wood-' + finish + ')"';

        return (
          '<div class="fit-scale-drawing">' +
            '<svg viewBox="0 0 ' + canvasWidth + ' 250" role="img" ' +
              'aria-label="Size comparison: a ' + desk + ' inch desk, a ' + room + ' inch space, ' +
              'your ' + OLD_DESK_WIDTH + ' inch old desk, and a person">' +

              // Person silhouette (for a sense of size; not drawn to the same scale)
              '<circle class="fit-svg-person" cx="78" cy="69" r="13"/>' +
              '<path class="fit-svg-person-body" d="M78 84 L78 153 M78 100 L55 128 M78 100 L101 128 M78 153 L60 210 M78 153 L96 210"/>' +
              '<text class="fit-svg-muted" x="78" y="235" text-anchor="middle">Person (not to scale)</text>' +

              // Old desk: dashed outline, 40 inches wide
              '<rect class="fit-svg-old" x="' + startX + '" y="50" width="' + (OLD_DESK_WIDTH * SCALE) + '" height="26"/>' +
              '<text class="fit-svg-muted" x="' + (startX + OLD_DESK_WIDTH * SCALE / 2) + '" y="43" text-anchor="middle">Old desk · ' + OLD_DESK_WIDTH + ' in</text>' +

              // Room width limit: dashed line (orange when the desk is too wide)
              '<line class="fit-svg-limit' + (tooWide ? ' is-warning' : '') + '" x1="' + roomEnd + '" y1="34" x2="' + roomEnd + '" y2="226"/>' +
              '<text class="fit-svg-strong" x="' + roomEnd + '" y="24" text-anchor="middle">Room limit: ' + room + ' in</text>' +

              // New desk, drawn like the Customize desk: top, body, drawer pull, two legs
              '<rect x="' + startX + '" y="100" width="' + deskW + '" height="22" rx="4"' + wood + '/>' +                          // top
              '<rect x="' + (startX + 8) + '" y="122" width="' + Math.max(40, deskW - 16) + '" height="50" rx="3"' + wood + '/>' + // body
              '<rect class="desk-pull-' + handles + '" x="' + (startX + Math.round(deskW * 0.45)) + '" y="142" width="22" height="6" rx="2"/>' + // drawer pull
              '<rect x="' + (startX + 14) + '" y="172" width="14" height="50" rx="2"' + wood + '/>' +                              // left leg
              '<rect x="' + (deskEnd - 28) + '" y="172" width="14" height="50" rx="2"' + wood + '/>' +                             // right leg

              // The part of the desk past the limit (only when too wide)
              (tooWide
                ? '<rect class="fit-svg-over" x="' + roomEnd + '" y="100" width="' + (deskEnd - roomEnd) + '" height="122"/>'
                : '') +

              // Labels: desk width (above the desk) and style name
              '<text class="fit-svg-strong" x="' + ((startX + deskEnd) / 2) + '" y="93" text-anchor="middle">' + desk + ' in</text>' +
              '<text class="fit-svg-muted" x="' + startX + '" y="245">New desk: ' + deskName + '</text>' +

            '</svg>' +
          '</div>'
        );
      }

      // ===== 5. STEP 2: the result (Wireframe 2, or Wireframe 4 if too wide) ==
      function renderResult() {
        const tooWide = deskWidth > roomWidth;

        section.innerHTML =
          // --- Heading and Guided hint ---
          '<h1>See how your desk fits</h1>' +
          '<p class="fit-intro">Here is a size comparison of your desk and your available space.</p>' +
          '<p class="guided-hint">' +
            (tooWide
              ? 'The orange part of the desk will not fit. Tap "Make it fit" to shrink it to your space.'
              : 'Your desk fits. Tap "Continue to customize" to choose the finish and handles.') +
          '</p>' +

          // --- ONE banner: orange if too wide (Wireframe 4), green if it fits ---
          (tooWide
            ? '<div class="banner banner-warning fit-banner">' +
                '<span class="fit-banner-icon fit-icon-warning" aria-hidden="true">!</span>' +
                '<div>' +
                  '<strong>Too wide: the maximum width that fits is ' + roomWidth + ' in</strong>' +
                  '<p>Your selected desk is ' + deskWidth + ' in wide, ' + (deskWidth - roomWidth) + ' in wider than your available space.</p>' +
                '</div>' +
              '</div>'
            : '<div class="banner banner-ok fit-banner">' +
                '<span class="fit-banner-icon" aria-hidden="true">✓</span>' +
                '<div>' +
                  '<strong>Your desk fits. Maximum width that fits: ' + roomWidth + ' in</strong>' +
                  '<p>Your ' + deskWidth + ' in desk is within your available space.</p>' +
                '</div>' +
              '</div>') +

          // --- Size comparison drawing ---
          '<div class="card fit-scale-panel">' +
            '<h2>Size comparison</h2>' +
            '<p class="fit-scale-note">All widths use the same scale.</p>' +
            createScaleDrawing(roomWidth, deskWidth) +
            '<div class="fit-legend">' +
              '<span><i class="fit-legend-new" style="background: var(--wood-' + finish + ')"></i> New desk</span>' +
              '<span><i class="fit-legend-old"></i> Old desk outline</span>' +
              '<span><i class="fit-legend-limit"></i> Room limit</span>' +
            '</div>' +
          '</div>' +

          // --- Buttons: Make it fit / Keep anyway (too wide) or Continue (fits) ---
          '<div class="fit-result-actions">' +
            (tooWide
              ? '<button type="button" class="btn btn-primary btn-block fit-make">Make it fit (' + roomWidth + ' in)</button>' +
                '<button type="button" class="btn btn-secondary btn-block fit-keep">Keep ' + deskWidth + ' in anyway</button>'
              : '<button type="button" class="btn btn-primary btn-block" data-go="customize">Continue to customize</button>') +
            '<button type="button" class="btn btn-link fit-remeasure">Re-measure my space</button>' +
          '</div>' +

          // --- Voice mock goes here ---
          '<div class="fit-voice-panel"></div>';

        // --- "Make it fit": shrink the desk to the room width ---
        const makeFit = section.querySelector('.fit-make');
        if (makeFit) {
          makeFit.addEventListener('click', function () {
            B.state.set('deskWidth', roomWidth);
            B.state.set('keepAnyway', false, { undo: false });
            B.ui.toast('Desk width adjusted to ' + roomWidth + ' in');
            B.router.refresh();
          });
        }

        // --- "Keep anyway": ask first, then remember the choice and move on ---
        const keep = section.querySelector('.fit-keep');
        if (keep) {
          keep.addEventListener('click', function () {
            B.ui.confirm(
              'This desk is ' + deskWidth + ' in, but your space is ' + roomWidth + ' in. It will not fit. Keep it anyway?',
              function () {
                B.state.set('keepAnyway', true, { undo: false });
                B.ui.toast('Desk kept at ' + deskWidth + ' in');
                B.router.go('customize');
              },
              { yes: 'Keep it anyway', no: 'Go back' }
            );
          });
        }

        // --- "Re-measure my space" ---
        section.querySelector('.fit-remeasure').addEventListener('click', remeasure);

        // --- Voice mock (simulated) ---
        B.ui.voice(section.querySelector('.fit-voice-panel'), [
          {
            label: 'Make it a little narrower',
            action: function () {
              const narrower = Math.max(12, deskWidth - 2);
              B.state.set('deskWidth', narrower);
              B.state.set('keepAnyway', false, { undo: false });
              B.ui.toast('Desk narrowed to ' + narrower + ' in');
              B.router.refresh();
            }
          },
          { label: 'Re-measure my space', action: remeasure }
        ]);
      }

      // ===== 6. Put the screen on the page, then show the right step ==========
      container.appendChild(section);
      if (roomConfirmed) renderResult();
      else renderMeasurement();
    },

    onEnter: function () {}
  };
})(window.Buildwell);