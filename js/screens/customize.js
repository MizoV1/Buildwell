// js/screens/customize.js  |  Owner: C  |  Wireframe 3  |  SR2, SR3, UR3
//
// WHAT TO BUILD
//   [ ] Desk preview (SVG is easiest) drawn in the chosen finish colour: var(--wood-oak) etc.
//   [ ] Drag handle (circle) on the right edge that changes the width while dragging
//       (pointerdown / pointermove / pointerup). Keep width between about 30 and 72 in.
//   [ ] Label: "Drag the circle to change width: 44 in"
//   [ ] Narrower / Wider buttons (for example 2 in per tap)
//   [ ] A note if the desk is wider than the user's space (roomWidth)
//   [ ] Finish choices: Oak, Walnut, Maple (buttons with aria-pressed="true" for the chosen one)
//   [ ] Handle choices: Brushed metal, Black
//   [ ] Close-up view, and comparing two finishes side by side (Maria does this in the scenario)
//   [ ] Voice mock: B.ui.voice(panel, [{ label: 'Make it a little narrower', action: ... }])
//   [ ] Fill in the agreed prices in js/price.js
//
//   The price bar at the bottom already works and updates itself (B.ui.priceBar).
//
// READS FROM STATE:   deskWidth, roomWidth, finish, handles
// SAVES TO STATE:     deskWidth, finish, handles
//
// TIP for dragging: save with { undo: false } while dragging, then once at the end call
//   B.router.pushUndo('deskWidth', widthBeforeDrag);
// so one Undo click reverses the whole drag.
//
// PATTERNS (see js/screens/home.js for a complete working screen):
//   const width = B.state.get('deskWidth');
//   B.state.set('deskWidth', width - 2);
//   B.router.refresh();
//   B.ui.toast('Width: ' + (width - 2) + ' in');

// js/screens/customize.js  |  Owner: C  |  Wireframe 3  |  SR2, SR3, UR3

(function (B) {
  'use strict';

  const MIN_WIDTH = 30;
  const MAX_WIDTH = 72;

  const FINISHES = [
    { id: 'oak', label: 'Oak', varName: '--wood-oak', note: 'Warm classic grain with natural golden tones.' },
    { id: 'walnut', label: 'Walnut', varName: '--wood-walnut', note: 'Rich dark brown grain with a refined look (+1 wk).' },
    { id: 'maple', label: 'Maple', varName: '--wood-maple', note: 'Light, smooth cream-to-tan grain for bright spaces.' }
  ];

  const HANDLES = [
    { id: 'brushed', label: 'Brushed metal' },
    { id: 'black', label: 'Black' }
  ];

  function clampWidth(val) {
    const num = Number(val);
    if (Number.isNaN(num)) return 44;
    return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Math.round(num)));
  }

  function finishColor(finishId) {
    const found = FINISHES.find(function (f) { return f.id === finishId; }) || FINISHES[0];
    const computed = getComputedStyle(document.documentElement).getPropertyValue(found.varName).trim();
    return computed || '#b6895b';
  }

  B.screens.customize = {
    render: function (container) {
      B.ui.toolbar(container);

      const deskWidth = clampWidth(B.state.get('deskWidth') ?? 44);
      const roomWidthRaw = B.state.get('roomWidth');
      const roomWidth = roomWidthRaw != null ? Number(roomWidthRaw) : 48;
      const finish = B.state.get('finish') || 'oak';
      const handles = B.state.get('handles') || 'brushed';

      const tooWide = !Number.isNaN(roomWidth) && roomWidth > 0 && deskWidth > roomWidth;
      const activeFinishObj = FINISHES.find(function (f) { return f.id === finish; }) || FINISHES[0];

      // Map 30..72 in to SVG width 140..300 inside a 360-wide viewBox
      const svgDeskWidth = Math.round(140 + ((deskWidth - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH)) * 160);
      const svgDeskX = 30;
      const svgDeskY = 75;
      const svgDeskHeight = 72;
      const handleX = svgDeskX + svgDeskWidth;
      const handleY = svgDeskY + svgDeskHeight / 2;
      const pullColor = handles === 'black' ? '#222222' : '#cbd5e1';

      const finishButtonsHtml = FINISHES.map(function (f) {
        const pressed = f.id === finish;
        return (
          '<button type="button" class="btn btn-chip customize-choice-btn" ' +
          'data-finish="' + f.id + '" aria-pressed="' + (pressed ? 'true' : 'false') + '">' +
          f.label +
          '</button>'
        );
      }).join('');

      const handleButtonsHtml = HANDLES.map(function (h) {
        const pressed = h.id === handles;
        return (
          '<button type="button" class="btn btn-chip customize-choice-btn" ' +
          'data-handles="' + h.id + '" aria-pressed="' + (pressed ? 'true' : 'false') + '">' +
          h.label +
          '</button>'
        );
      }).join('');

      const compareOptionsHtml = FINISHES.map(function (f) {
        return '<option value="' + f.id + '"' + (f.id === (finish === 'oak' ? 'walnut' : 'oak') ? ' selected' : '') + '>' + f.label + '</option>';
      }).join('');

      const section = document.createElement('section');
      section.className = 'customize';
      section.innerHTML =
        '<h1 class="customize-title">Customize Your Desk</h1>' +
        '<p class="note guided-hint">Tip: Drag the circle on the right edge of the desk, use Narrower/Wider buttons, or tap a voice command below.</p>' +

        '<div class="customize-grid">' +
          // Left: SVG preview + drag handle + width controls
          '<div class="card customize-preview-card">' +
            '<p class="customize-width-label" id="customize-width-label">Drag the circle to change width: ' + deskWidth + ' in</p>' +
            '<div class="customize-svg-wrap">' +
              '<svg class="customize-svg" viewBox="0 0 360 210" role="img" aria-label="Desk preview at ' + deskWidth + ' inches wide">' +
                '<rect class="customize-desk-top" x="' + svgDeskX + '" y="' + svgDeskY + '" width="' + svgDeskWidth + '" height="22" rx="4" />' +
                '<rect class="customize-desk-body" x="' + (svgDeskX + 8) + '" y="' + (svgDeskY + 22) + '" width="' + Math.max(40, svgDeskWidth - 16) + '" height="' + (svgDeskHeight - 22) + '" rx="3" />' +
                '<rect class="customize-leg customize-leg-left" x="' + (svgDeskX + 14) + '" y="' + (svgDeskY + svgDeskHeight) + '" width="14" height="50" rx="2" fill="' + finishColor(finish) + '" />' +
                '<rect class="customize-leg customize-leg-right" x="' + (svgDeskX + svgDeskWidth - 28) + '" y="' + (svgDeskY + svgDeskHeight) + '" width="14" height="50" rx="2" fill="' + finishColor(finish) + '" />' +
                // Drawer pull reflecting handle choice
                '<rect class="customize-pull" x="' + (svgDeskX + Math.round(svgDeskWidth * 0.45)) + '" y="' + (svgDeskY + 42) + '" width="22" height="6" rx="2" fill="' + pullColor + '" />' +
                // Draggable handle on right edge
                '<circle class="customize-drag-handle" cx="' + handleX + '" cy="' + handleY + '" r="13" tabindex="0" role="slider" ' +
                  'aria-label="Drag to adjust desk width in inches" aria-valuemin="' + MIN_WIDTH + '" aria-valuemax="' + MAX_WIDTH + '" aria-valuenow="' + deskWidth + '" />' +
                '<text x="' + handleX + '" y="' + (handleY + 4) + '" text-anchor="middle" class="customize-handle-glyph">↔</text>' +
              '</svg>' +
            '</div>' +

            '<div class="customize-step-btns">' +
              '<button type="button" class="btn btn-secondary customize-narrower">Narrower (-2 in)</button>' +
              '<button type="button" class="btn btn-secondary customize-wider">Wider (+2 in)</button>' +
            '</div>' +

            (tooWide
              ? '<div class="banner banner-warning customize-fit-note" role="status">' +
                  'Note: Your desk (' + deskWidth + ' in) is wider than your measured space (' + roomWidth + ' in).' +
                '</div>'
              : '<p class="note customize-fit-ok">Fits within your ' + roomWidth + ' in space.</p>') +
          '</div>' +

          // Right: Finish, handles, close-up & comparison
          '<div class="customize-controls">' +
            '<div class="card">' +
              '<h2 class="customize-heading">Wood Finish</h2>' +
              '<div class="customize-btn-row" role="group" aria-label="Wood finish choices">' +
                finishButtonsHtml +
              '</div>' +
              '<p class="note customize-finish-desc">' + activeFinishObj.note + '</p>' +

              '<div class="customize-compare-actions">' +
                '<button type="button" class="btn btn-secondary customize-toggle-closeup" aria-expanded="false">Close-up view</button>' +
                '<button type="button" class="btn btn-secondary customize-toggle-compare" aria-expanded="false">Compare two finishes</button>' +
              '</div>' +

              '<div class="customize-closeup hidden" aria-live="polite">' +
                '<div class="customize-swatch-box customize-swatch-' + finish + '"></div>' +
                '<div>' +
                  '<strong>Close-up: ' + activeFinishObj.label + '</strong>' +
                  '<p class="note">' + activeFinishObj.note + '</p>' +
                '</div>' +
              '</div>' +

              '<div class="customize-compare hidden" aria-live="polite">' +
                '<label class="customize-compare-label">Compare <strong>' + activeFinishObj.label + '</strong> with: ' +
                  '<select class="customize-compare-select">' + compareOptionsHtml + '</select>' +
                '</label>' +
                '<div class="customize-compare-pair">' +
                  '<div class="customize-compare-card">' +
                    '<div class="customize-swatch-box customize-swatch-' + finish + '"></div>' +
                    '<span>' + activeFinishObj.label + ' (Selected)</span>' +
                  '</div>' +
                  '<div class="customize-compare-card customize-compare-other-wrap">' +
                    '<div class="customize-swatch-box customize-compare-other-swatch"></div>' +
                    '<span class="customize-compare-other-label"></span>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div class="card">' +
              '<h2 class="customize-heading">Hardware / Handles</h2>' +
              '<div class="customize-btn-row" role="group" aria-label="Handle choices">' +
                handleButtonsHtml +
              '</div>' +
            '</div>' +

            '<div class="card customize-voice-box"></div>' +
          '</div>' +
        '</div>';

      container.appendChild(section);

      // Apply finish color to desk SVG elements
      const currentColor = finishColor(finish);
      section.querySelector('.customize-desk-top').setAttribute('fill', currentColor);
      section.querySelector('.customize-desk-body').setAttribute('fill', currentColor);

      function updateWidth(newWidth, opts) {
        const clamped = clampWidth(newWidth);
        B.state.set('deskWidth', clamped, opts || {});
        B.router.refresh();
        B.ui.toast('Width: ' + clamped + ' in');
      }

      // Narrower / Wider buttons
      section.querySelector('.customize-narrower').addEventListener('click', function () {
        updateWidth(deskWidth - 2);
      });
      section.querySelector('.customize-wider').addEventListener('click', function () {
        updateWidth(deskWidth + 2);
      });

      // Drag handle interactions (pointerdown / pointermove / pointerup)
      const svg = section.querySelector('.customize-svg');
      const handleEl = section.querySelector('.customize-drag-handle');
      let dragging = false;
      let widthBeforeDrag = deskWidth;
      let latestWidth = deskWidth;

      function clientXToWidth(clientX) {
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = 0;
        const ctm = svg.getScreenCTM();
        if (!ctm) return deskWidth;
        const svgX = pt.matrixTransform(ctm.inverse()).x;
        const ratio = (svgX - (svgDeskX + 140)) / 160;
        return clampWidth(MIN_WIDTH + ratio * (MAX_WIDTH - MIN_WIDTH));
      }

      handleEl.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        dragging = true;
        widthBeforeDrag = deskWidth;
        latestWidth = deskWidth;
        handleEl.setPointerCapture(e.pointerId);
      });

      handleEl.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        latestWidth = clientXToWidth(e.clientX);
        B.state.set('deskWidth', latestWidth, { undo: false });
        const updatedSvgW = Math.round(140 + ((latestWidth - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH)) * 160);
        const updatedHandleX = svgDeskX + updatedSvgW;
        section.querySelector('.customize-desk-top').setAttribute('width', updatedSvgW);
        section.querySelector('.customize-desk-body').setAttribute('width', Math.max(40, updatedSvgW - 16));
        section.querySelector('.customize-leg-right').setAttribute('x', svgDeskX + updatedSvgW - 28);
        section.querySelector('.customize-pull').setAttribute('x', svgDeskX + Math.round(updatedSvgW * 0.45));
        handleEl.setAttribute('cx', updatedHandleX);
        section.querySelector('.customize-handle-glyph').setAttribute('x', updatedHandleX);
        section.querySelector('#customize-width-label').textContent = 'Drag the circle to change width: ' + latestWidth + ' in';
      });

      function finishDrag() {
        if (!dragging) return;
        dragging = false;
        if (latestWidth !== widthBeforeDrag) {
          B.router.pushUndo('deskWidth', widthBeforeDrag);
          B.state.set('deskWidth', latestWidth, { undo: false });
          B.router.refresh();
          B.ui.toast('Width: ' + latestWidth + ' in');
        }
      }

      handleEl.addEventListener('pointerup', finishDrag);
      handleEl.addEventListener('pointercancel', finishDrag);

      // Finish buttons
      section.querySelectorAll('[data-finish]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const chosen = btn.getAttribute('data-finish');
          B.state.set('finish', chosen);
          B.router.refresh();
          B.ui.toast('Finish: ' + chosen);
        });
      });

      // Handle buttons
      section.querySelectorAll('[data-handles]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const chosen = btn.getAttribute('data-handles');
          B.state.set('handles', chosen);
          B.router.refresh();
          B.ui.toast('Handles: ' + (chosen === 'brushed' ? 'Brushed metal' : 'Black'));
        });
      });

      // Close-up toggle
      const closeupBtn = section.querySelector('.customize-toggle-closeup');
      const closeupBox = section.querySelector('.customize-closeup');
      closeupBtn.addEventListener('click', function () {
        const isHidden = closeupBox.classList.contains('hidden');
        closeupBox.classList.toggle('hidden', !isHidden);
        closeupBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      });

      // Side-by-side comparison toggle & selector
      const compareBtn = section.querySelector('.customize-toggle-compare');
      const compareBox = section.querySelector('.customize-compare');
      const compareSelect = section.querySelector('.customize-compare-select');
      const otherSwatch = section.querySelector('.customize-compare-other-swatch');
      const otherLabel = section.querySelector('.customize-compare-other-label');

      function syncComparison() {
        const otherId = compareSelect.value;
        const otherObj = FINISHES.find(function (f) { return f.id === otherId; }) || FINISHES[1];
        otherSwatch.className = 'customize-swatch-box customize-compare-other-swatch customize-swatch-' + otherObj.id;
        otherLabel.textContent = otherObj.label;
      }
      syncComparison();

      compareSelect.addEventListener('change', syncComparison);
      compareBtn.addEventListener('click', function () {
        const isHidden = compareBox.classList.contains('hidden');
        compareBox.classList.toggle('hidden', !isHidden);
        compareBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      });

      // Voice mock
      const voicePanel = section.querySelector('.customize-voice-box');
      if (B.ui && typeof B.ui.voice === 'function') {
        B.ui.voice(voicePanel, [
          {
            label: 'Make it a little narrower',
            action: function () { updateWidth(deskWidth - 2); }
          },
          {
            label: 'Make it wider',
            action: function () { updateWidth(deskWidth + 2); }
          },
          {
            label: 'Choose oak',
            action: function () {
              B.state.set('finish', 'oak');
              B.router.refresh();
              B.ui.toast('Finish: oak');
            }
          }
        ]);
      }

      // Live price + delivery bar at bottom
      B.ui.priceBar(container, { label: 'Review order', go: 'review' });
    },

    onEnter: function () {}
  };
})(window.Buildwell);