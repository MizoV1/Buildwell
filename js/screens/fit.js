// js/screens/fit.js  |  Owner: B  |  Wireframes 2 and 4  |  SR4, UR2, UR4
//
// WHAT THIS SCREEN DOES
//   Step 1 (Wireframe 2): a simulated camera scan "measures" the space. The user confirms
//                          it, or types their own measurement in inches or centimetres.
//   Step 2 (Wireframe 2): a to-scale front view of the new desk and old desk between the
//                          walls of the space, with measuring arrows for the space's width
//                          and the desk's height.
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

  // Drawing scale: widths AND heights use the same units per inch, so everything is to scale
  const SCALE = 4;
  const DESK_HEIGHT = 30;      // a standard desk height
  const OLD_DESK_WIDTH = 40;   // the user's current desk, drawn as a dashed outline
  const OLD_DESK_HEIGHT = 29;

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
      // A front view where widths and heights use the same SCALE, so the desks and
      // the space are true to size. Two measuring arrows show the width of the space
      // (horizontal) and the height of the desk (vertical). The new desk is drawn the
      // same way as on Customize, in the chosen wood and handle colour.
      function createScaleDrawing(room, desk) {
        const S = SCALE;
        const floorY = 300;                              // the floor everything stands on
        const widest = Math.max(room, desk) * S;
        const canvasWidth = Math.max(640, widest + 240);
        const startX = Math.round((canvasWidth - widest) / 2) + 20;   // left wall (inner edge), centred
        const roomEnd = startX + room * S;               // right wall (inner edge)
        const wallTop = 70;

        // New desk: 30 in tall, same proportions as the Customize desk
        const deskW = desk * S;
        const deskEnd = startX + deskW;
        const deskTop = floorY - DESK_HEIGHT * S;        // 120 units tall in total
        const topH = 22, bodyH = 49;                     // top + body + legs = 120
        const legTop = deskTop + topH + bodyH;
        const legH = floorY - legTop;

        const tooWide = desk > room;
        const warn = tooWide ? ' is-warning' : '';
        const arrowWidth = tooWide ? 'url(#fit-arrow-warn)' : 'url(#fit-arrow)';
        const heightX = startX - 40;                     // the vertical arrow sits left of the space
        const wood = ' style="fill: var(--wood-' + finish + ')"';

        return (
          '<div class="fit-scale-drawing">' +
            '<svg viewBox="0 0 ' + canvasWidth + ' 360" role="img" ' +
              'aria-label="Drawn to scale: a ' + desk + ' inch wide, ' + DESK_HEIGHT + ' inch tall desk ' +
              'in a ' + room + ' inch wide space, with your ' + OLD_DESK_WIDTH + ' inch old desk outlined">' +

              // Arrowheads used by the measuring lines (teal, or orange when too wide)
              '<defs>' +
                '<marker id="fit-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
                  '<path class="fit-svg-arrowhead" d="M0 0 L10 5 L0 10 z"/></marker>' +
                '<marker id="fit-arrow-warn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
                  '<path class="fit-svg-arrowhead is-warning" d="M0 0 L10 5 L0 10 z"/></marker>' +
                '<marker id="fit-arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
                  '<path class="fit-svg-arrowhead is-muted" d="M0 0 L10 5 L0 10 z"/></marker>' +
              '</defs>' +

              // Floor line
              '<line class="fit-svg-floor" x1="0" y1="' + floorY + '" x2="' + canvasWidth + '" y2="' + floorY + '"/>' +

              // Walls on each side of the space
              '<rect class="fit-svg-wall" x="' + (startX - 8) + '" y="' + wallTop + '" width="8" height="' + (floorY - wallTop) + '"/>' +
              '<rect class="fit-svg-wall" x="' + roomEnd + '" y="' + wallTop + '" width="8" height="' + (floorY - wallTop) + '"/>' +

              // Horizontal arrow: the width of the space, wall to wall
              '<line class="fit-svg-dim' + warn + '" x1="' + (startX + 2) + '" y1="48" x2="' + (roomEnd - 2) + '" y2="48" ' +
                'marker-start="' + arrowWidth + '" marker-end="' + arrowWidth + '"/>' +
              '<line class="fit-svg-tick' + warn + '" x1="' + startX + '" y1="38" x2="' + startX + '" y2="' + wallTop + '"/>' +
              '<line class="fit-svg-tick' + warn + '" x1="' + roomEnd + '" y1="38" x2="' + roomEnd + '" y2="' + wallTop + '"/>' +
              '<text class="fit-svg-dim-text' + warn + '" x="' + ((startX + roomEnd) / 2) + '" y="32" text-anchor="middle">Your space: ' + room + ' in wide</text>' +

              // Vertical arrow: the height of the desk, floor to desktop
              '<line class="fit-svg-dim is-muted" x1="' + heightX + '" y1="' + (deskTop + 2) + '" x2="' + heightX + '" y2="' + (floorY - 2) + '" ' +
                'marker-start="url(#fit-arrow-muted)" marker-end="url(#fit-arrow-muted)"/>' +
              '<line class="fit-svg-tick is-muted" x1="' + (heightX - 8) + '" y1="' + deskTop + '" x2="' + startX + '" y2="' + deskTop + '"/>' +
              '<text class="fit-svg-dim-text is-muted" x="' + (heightX - 10) + '" y="' + (deskTop + (floorY - deskTop) / 2 - 4) + '" text-anchor="end">Desk</text>' +
              '<text class="fit-svg-dim-text is-muted" x="' + (heightX - 10) + '" y="' + (deskTop + (floorY - deskTop) / 2 + 14) + '" text-anchor="end">' + DESK_HEIGHT + ' in tall</text>' +

              // New desk: top, body, drawer pull, two legs
              '<rect x="' + startX + '" y="' + deskTop + '" width="' + deskW + '" height="' + topH + '" rx="4"' + wood + '/>' +
              '<rect x="' + (startX + 8) + '" y="' + (deskTop + topH) + '" width="' + Math.max(40, deskW - 16) + '" height="' + bodyH + '" rx="3"' + wood + '/>' +
              '<rect class="desk-pull-' + handles + '" x="' + (startX + Math.round(deskW * 0.45)) + '" y="' + (deskTop + topH + 20) + '" width="22" height="6" rx="2"/>' +
              '<rect x="' + (startX + 14) + '" y="' + legTop + '" width="14" height="' + legH + '" rx="2"' + wood + '/>' +
              '<rect x="' + (deskEnd - 28) + '" y="' + legTop + '" width="14" height="' + legH + '" rx="2"' + wood + '/>' +

              // The part of the desk past the right wall (only when too wide)
              (tooWide
                ? '<rect class="fit-svg-over" x="' + roomEnd + '" y="' + deskTop + '" width="' + (deskEnd - roomEnd) + '" height="' + (floorY - deskTop) + '"/>'
                : '') +

              // Old desk: dashed outline, 40 x 29 in, standing on the same floor
              '<rect class="fit-svg-old" x="' + startX + '" y="' + (floorY - OLD_DESK_HEIGHT * S) + '" width="' + (OLD_DESK_WIDTH * S) + '" height="' + (OLD_DESK_HEIGHT * S) + '"/>' +

              // Labels under the floor
              '<text class="fit-svg-strong" x="' + startX + '" y="' + (floorY + 24) + '">New desk: ' + deskName + ', ' + desk + ' in wide</text>' +
              '<text class="fit-svg-muted" x="' + startX + '" y="' + (floorY + 44) + '">Dashed outline: your old desk, ' + OLD_DESK_WIDTH + ' in wide</text>' +

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
            '<p class="fit-scale-note">Drawn to scale: widths and heights use the same scale.</p>' +
            createScaleDrawing(roomWidth, deskWidth) +
            '<div class="fit-legend">' +
              '<span><i class="fit-legend-new" style="background: var(--wood-' + finish + ')"></i> New desk</span>' +
              '<span><i class="fit-legend-old"></i> Old desk outline</span>' +
              '<span><i class="fit-legend-limit"></i> Walls of your space</span>' +
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