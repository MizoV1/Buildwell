// js/screens/fit.js  |  Owner: B  |  Wireframes 2 and 4  |  SR4, UR2, UR4
//
// WHAT TO BUILD
//   Step 1: measure (Wireframe 2, right side)
//   [ ] Simulated camera view (a styled box, no real camera) showing the measured width
//   [ ] "We measured 48 in. Is that right?" with a big "Yes, that is right" button
//   [ ] "Not right?" input: number + in/cm choice + "Use my measurement" (convert cm to in)
//   [ ] Show an error message if the number is empty or unrealistic
//
//   Step 2: result (Wireframe 2, left side)
//   [ ] Banner: "Maximum width that fits: 48 in"
//   [ ] True-scale drawing (SVG is easiest): new desk, dashed outline of the old desk (40 in),
//       a person silhouette for scale, and the width limit
//   [ ] "Re-measure my space" goes back to step 1
//
//   Step 2, too wide (Wireframe 4)
//   [ ] Warning banner in orange: "Too wide: the maximum width that fits is 48 in"
//   [ ] Show the part of the desk past the limit
//   [ ] "Make it fit (48 in)"  -> deskWidth = roomWidth
//   [ ] "Keep 52 in anyway"    -> ask first with B.ui.confirm(...), then keepAnyway = true
//   [ ] "Re-measure my space"
//
//   [ ] Voice mock: B.ui.voice(panel, [{ label: 'Yes, that’s right', action: ... }, ...])
//
// READS FROM STATE:   measuredWidth, roomWidth, roomConfirmed, deskWidth
// SAVES TO STATE:     roomWidth, roomConfirmed, deskWidth, keepAnyway (keepAnyway with { undo: false })
//
// TIP: use roomConfirmed (true/false) to decide whether to show step 1 or step 2.
//      Saving it with B.state.set means Undo takes the user back a step automatically.
//
// PATTERNS (see js/screens/home.js for a complete working screen):
//   const room = B.state.get('roomWidth');
//   B.state.set('roomConfirmed', true);
//   B.router.refresh();
//   B.ui.confirm('It will not fit. Keep it anyway?', function () { ... }, { yes: 'Keep it', no: 'Go back' });
//   B.ui.toast('Space confirmed: ' + room + ' in');


(function (B) {
  'use strict';

  B.screens.fit = {
    render: function (container) {
      B.ui.toolbar(container);

      // Read saved information.
      const measuredWidth = Number(B.state.get('measuredWidth')) || 48;
      const roomWidth = Number(B.state.get('roomWidth')) || 48;
      const roomConfirmed = B.state.get('roomConfirmed') === true;
      const deskWidth = Number(B.state.get('deskWidth')) || 42;
      const style = B.state.get('style') || 'your desk';

      const section = document.createElement('section');
      section.className = 'fit-screen';

      // Save a confirmed room measurement.
      function confirmMeasurement(width) {
        B.state.set('roomWidth', width);
        B.state.set('roomConfirmed', true);
        B.ui.toast('Space confirmed: ' + width + ' in');
        B.router.refresh();
      }

      // Return to the measurement step.
      function remeasure() {
        B.state.set('roomConfirmed', false);
        B.router.refresh();
      }

      // Build the room measurement screen.
      function renderMeasurement() {
        section.innerHTML =
          '<div class="fit-heading">' +
            '<p class="fit-step">STEP 2 OF 2</p>' +
            '<h1>Let\'s check your space</h1>' +
            '<p>We\'ll help make sure your new desk fits comfortably.</p>' +
          '</div>' +

          '<div class="fit-measure-layout">' +

            '<div class="camera-panel">' +
              '<div class="camera-top">' +
                '<span class="camera-dot"></span>' +
                '<span>ROOM SCAN SIMULATION</span>' +
              '</div>' +

              '<div class="camera-view">' +
                '<div class="camera-wall"></div>' +
                '<div class="camera-floor"></div>' +
                '<div class="camera-measure-line">' +
                  '<span></span>' +
                '</div>' +
                '<div class="camera-measure-label">' +
                  measuredWidth + ' inches' +
                '</div>' +
                '<div class="camera-corner top-left"></div>' +
                '<div class="camera-corner top-right"></div>' +
                '<div class="camera-corner bottom-left"></div>' +
                '<div class="camera-corner bottom-right"></div>' +
              '</div>' +

              '<p class="camera-caption">This is a simulated camera scan. ' +
              'No camera access is required.</p>' +
            '</div>' +

            '<div class="measurement-panel">' +
              '<h2>We measured ' + measuredWidth + ' in.</h2>' +
              '<p class="measurement-question">Is that right?</p>' +

              '<button type="button" class="fit-btn fit-btn-primary confirm-measurement">' +
                'Yes, that is right' +
              '</button>' +

              '<div class="manual-divider">' +
                '<span></span><p>OR ENTER IT YOURSELF</p><span></span>' +
              '</div>' +

              '<label class="fit-label" for="room-measurement">' +
                'What is the width of your available space?' +
              '</label>' +

              '<div class="measurement-input-row">' +
                '<input type="number" id="room-measurement" ' +
                  'class="fit-input" min="1" step="any" placeholder="Enter width">' +
                '<select id="measurement-unit" class="fit-select">' +
                  '<option value="in">Inches</option>' +
                  '<option value="cm">Centimeters</option>' +
                '</select>' +
              '</div>' +

              '<p class="measurement-error" role="alert" aria-live="polite"></p>' +

              '<button type="button" class="fit-btn fit-btn-secondary use-measurement">' +
                'Use my measurement' +
              '</button>' +
            '</div>' +

          '</div>' +

          '<div class="fit-help">' +
            '<span class="fit-help-icon">i</span>' +
            '<p><strong>Not sure?</strong> Measure the open width of the area ' +
            'where you want your desk. You can always change this measurement later.</p>' +
          '</div>' +

          '<div class="fit-voice-panel"></div>';

        section.querySelector('.confirm-measurement')
          .addEventListener('click', function () {
            confirmMeasurement(measuredWidth);
          });

        section.querySelector('.use-measurement')
          .addEventListener('click', function () {
            const input = section.querySelector('#room-measurement');
            const unit = section.querySelector('#measurement-unit').value;
            const error = section.querySelector('.measurement-error');

            const enteredValue = Number(input.value);

            if (
              input.value.trim() === '' ||
              !Number.isFinite(enteredValue) ||
              enteredValue <= 0
            ) {
              error.textContent = 'Please enter a valid measurement.';
              input.focus();
              return;
            }

            // Convert centimeters to inches when necessary.
            const inches = unit === 'cm'
              ? enteredValue / 2.54
              : enteredValue;

            // Reject measurements outside a realistic room-width range.
            if (inches < 12 || inches > 300) {
              error.textContent =
                'Please enter a room width between 12 and 300 inches.';
              input.focus();
              return;
            }

            error.textContent = '';
            confirmMeasurement(Math.round(inches * 100) / 100);
          });

        // Voice command mockup.
        const voicePanel = section.querySelector('.fit-voice-panel');

        if (B.ui.voice) {
          B.ui.voice(voicePanel, [
            {
              label: 'Yes, that’s right',
              action: function () {
                confirmMeasurement(measuredWidth);
              }
            },
            {
              label: 'Let me enter my measurement',
              action: function () {
                section.querySelector('#room-measurement').focus();
              }
            }
          ]);
        }
      }

      // Draw a proportional desk comparison.
      function createScaleDrawing(room, desk) {
        const scale = 5;
        const startX = 175;
        const roomEnd = startX + room * scale;
        const deskEnd = startX + desk * scale;
        const canvasWidth = Math.max(650, deskEnd + 55, roomEnd + 55);
        const tooWide = desk > room;
        const deskName = style.replace('-', ' ');

        return (
          '<div class="scale-drawing">' +
            '<svg viewBox="0 0 ' + canvasWidth + ' 245" ' +
              'role="img" aria-label="Scale comparison of your room, desk, old desk, and a person">' +

              // Person silhouette.
              '<circle cx="78" cy="49" r="13" fill="#4d5549"/>' +
              '<path d="M78 64 L78 133 M78 80 L55 108 M78 80 L101 108 ' +
                'M78 133 L60 190 M78 133 L96 190" ' +
                'stroke="#4d5549" stroke-width="10" stroke-linecap="round" fill="none"/>' +
              '<text x="78" y="215" text-anchor="middle" font-size="12" fill="#555">' +
                'Person' +
              '</text>' +

              // Old desk: 40 inches wide.
              '<rect x="' + startX + '" y="75" width="' + (40 * scale) + '" height="26" ' +
                'fill="none" stroke="#8b9187" stroke-width="2" stroke-dasharray="7 5"/>' +
              '<text x="' + (startX + 100) + '" y="68" text-anchor="middle" ' +
                'font-size="12" fill="#747b70">Old desk · 40 in</text>' +

              // Room width limit.
              '<line x1="' + roomEnd + '" y1="42" x2="' + roomEnd + '" y2="202" ' +
                'stroke="#657b5d" stroke-width="3" stroke-dasharray="6 4"/>' +
              '<text x="' + roomEnd + '" y="28" text-anchor="middle" ' +
                'font-size="13" font-weight="bold" fill="#506448">' +
                'Room limit: ' + room + ' in</text>' +

              // New desk tabletop.
              '<rect x="' + startX + '" y="128" width="' + (desk * scale) + '" height="16" ' +
                'rx="3" fill="#a87546"/>' +

              // Highlight the part that extends past the room limit.
              (tooWide
                ? '<rect x="' + roomEnd + '" y="128" width="' +
                  ((desk - room) * scale) + '" height="16" fill="#e58b36"/>'
                : '') +

              // Desk legs.
              '<rect x="' + (startX + 12) + '" y="144" width="9" height="45" fill="#795334"/>' +
              '<rect x="' + (deskEnd - 21) + '" y="144" width="9" height="45" fill="#795334"/>' +

              // Width label.
              '<text x="' + ((startX + deskEnd) / 2) + '" y="116" ' +
                'text-anchor="middle" font-size="13" font-weight="bold" fill="#49372b">' +
                desk + ' in' +
              '</text>' +

              '<text x="' + startX + '" y="235" font-size="11" fill="#777">' +
                'New desk: ' + deskName +
              '</text>' +

            '</svg>' +
          '</div>'
        );
      }

      // Build the fit result screen.
      function renderResult() {
        const tooWide = deskWidth > roomWidth;

        section.innerHTML =
          '<div class="fit-heading">' +
            '<p class="fit-step">ROOM FIT RESULTS</p>' +
            '<h1>See how your desk fits</h1>' +
            '<p>Here is a size comparison of your desk and available space.</p>' +
          '</div>' +

          '<div class="fit-limit-banner">' +
            '<span class="fit-banner-icon">✓</span>' +
            '<div>' +
              '<strong>Maximum width that fits: ' + roomWidth + ' in</strong>' +
              '<p>Your available space has been confirmed.</p>' +
            '</div>' +
          '</div>' +

          (tooWide
            ? '<div class="fit-warning">' +
                '<span class="fit-warning-icon">!</span>' +
                '<div>' +
                  '<strong>Too wide: the maximum width that fits is ' +
                    roomWidth + ' in</strong>' +
                  '<p>Your selected desk is ' + deskWidth + ' in wide, ' +
                    (deskWidth - roomWidth) + ' in wider than your available space.</p>' +
                '</div>' +
              '</div>'
            : '<div class="fit-success">' +
                '<strong>Your desk fits!</strong>' +
                '<p>Your selected desk is within the available room width.</p>' +
              '</div>') +

          '<div class="scale-panel">' +
            '<div class="scale-panel-heading">' +
              '<h2>Size comparison</h2>' +
              '<p>All widths use the same scale.</p>' +
            '</div>' +
            createScaleDrawing(roomWidth, deskWidth) +
            '<div class="scale-legend">' +
              '<span><i class="legend-new"></i> New desk</span>' +
              '<span><i class="legend-old"></i> Old desk outline</span>' +
              '<span><i class="legend-limit"></i> Room limit</span>' +
            '</div>' +
          '</div>' +

          '<div class="fit-result-actions">' +

            (tooWide
              ? '<button type="button" class="fit-btn fit-btn-primary make-fit">' +
                  'Make it fit (' + roomWidth + ' in)' +
                '</button>' +

                '<button type="button" class="fit-btn fit-btn-secondary keep-anyway">' +
                  'Keep ' + deskWidth + ' in anyway' +
                '</button>'
              : '<button type="button" class="fit-btn fit-btn-primary continue-customize">' +
                  'Continue to customize' +
                '</button>') +

            '<button type="button" class="fit-btn fit-btn-text remeasure">' +
              'Re-measure my space' +
            '</button>' +

          '</div>' +

          '<div class="fit-voice-panel"></div>';

        // Make the desk fit the room.
        const makeFitButton = section.querySelector('.make-fit');

        if (makeFitButton) {
          makeFitButton.addEventListener('click', function () {
            B.state.set('deskWidth', roomWidth);
            B.state.set('keepAnyway', false, { undo: false });
            B.ui.toast('Desk width adjusted to ' + roomWidth + ' in');
            B.router.refresh();
          });
        }

        // Ask for confirmation before keeping an oversized desk.
        const keepButton = section.querySelector('.keep-anyway');

        if (keepButton) {
          keepButton.addEventListener('click', function () {
            B.ui.confirm(
              'This desk is wider than your available space. Are you sure you want to keep it?',
              function () {
                B.state.set('keepAnyway', true, { undo: false });
                B.ui.toast('Desk kept at ' + deskWidth + ' in');
                B.router.go('customize');
              },
              {
                yes: 'Keep it anyway',
                no: 'Go back'
              }
            );
          });
        }

        // Continue when the desk fits.
        const continueButton = section.querySelector('.continue-customize');

        if (continueButton) {
          continueButton.addEventListener('click', function () {
            B.router.go('customize');
          });
        }

        section.querySelector('.remeasure')
          .addEventListener('click', remeasure);

        // Voice command mockup.
        const voicePanel = section.querySelector('.fit-voice-panel');

        if (B.ui.voice) {
          B.ui.voice(voicePanel, [
            {
              label: 'Make it a little narrower',
              action: function () {
                const narrowerWidth = Math.max(12, deskWidth - 2);
                B.state.set('deskWidth', narrowerWidth);
                B.state.set('keepAnyway', false, { undo: false });
                B.ui.toast('Desk narrowed to ' + narrowerWidth + ' in');
                B.router.refresh();
              }
            },
            {
              label: 'Re-measure my space',
              action: remeasure
            }
          ]);
        }
      }

      container.appendChild(section);

      // Show measurement or result depending on confirmation.
      if (!roomConfirmed) {
        renderMeasurement();
      } else {
        renderResult();
      }
    },

    onEnter: function () {}
  };
})(window.Buildwell);
