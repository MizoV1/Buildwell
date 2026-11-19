// js/screens/help.js  |  Owner: A  |  Information hierarchy: Help  |  UR6
//
// WHAT TO BUILD
//   [x] Accessibility settings: text size buttons (100%, 125%, 150%, 200%) and Guided / Standard
//       (use B.ui.applyTextSize() and B.ui.applyMode() after saving, like home.js does)
//   [x] Measuring your space: short steps for using a tape measure
//   [x] Materials: plain-language notes on oak, walnut and maple
//   [x] Contact support (demo phone and email)
//   [x] Line saying nothing has a time limit and Undo / Back are on every screen
//
// READS FROM STATE:   textSize, mode
// SAVES TO STATE:     textSize, mode (both with { undo: false })

(function (B) {
  'use strict';

  B.screens.help = {
    render: function (container) {
      //Toolbar: Has Back, Undo, and A+ for text size
      B.ui.toolbar(container);

      // 1. Defining a section for holding the screen.
      // Defined the class as "help" so help.css can style it as .help
      const section = document.createElement('section');
      section.className = 'help';

      // Current settings, right buttons show as selected
      const textSize = B.state.get('textSize');
      const mode = B.state.get('mode');

      // Builds a text sized button, like sizeButton(1.5) = 150% button
      function sizeButton(size) {
        return '<button type="button" class="btn btn-chip" data-size ="' + size +'"' +
        ' aria-pressed="' + (textSize === size) + '">' + (size * 100) + '%</button>';
      }

      // 2. Page Contents
      section.innerHTML = 
      //Title
      '<h1>Help and Accessibility</h1>' +

      // Introduction under the title
      '<p class = "help-intro"> Change how Buildwell looks, or find answers to common questions.</p>' +

      // Defined into two-columns layout
      // As the screen gets narrower it drops to single column (larger text sizes for example)
      '<div class = "two-col">' +

        // Card 1: text size and Guided / Standard buttons
        '<div class="card help-settings">' +
          '<h2>Accessibility Settings</h2>' +

          '<p class="help-label">Text size</p>' +
          '<div class="help-options">' +
            sizeButton(1) + sizeButton(1.25) + sizeButton(1.5) + sizeButton(2) +
          '</div>' +

          '<p class="help-label">Mode</p>' +
          '<div class="help-options">' +
            '<button type="button" class="btn btn-chip" data-mode="guided"' +
              ' aria-pressed="' + (mode === 'guided') + '">Guided</button>' +
            '<button type="button" class="btn btn-chip" data-mode="standard"' +
              ' aria-pressed="' + (mode !== 'guided') + '">Standard</button>' +
          '</div>' +

          '<p class="help-note">Nothing in Buildwell has a time limit. Undo and Back are on every screen.</p>' +
        '</div>' +

        // Card 2: Tape measuring steps
        '<div class = "card help-measuring">' +
          '<h2>Measuring Your Space</h2>' +
          '<ol class = "help-steps">' +
            '<li>Clear the wall where the desk will go.</li>' +
            '<li>Measure from one side to the other at desk height.</li>' +
            '<li>Leave a little room for any sockets or skirting boards</li>' +
            '<li>Enter the number on the fit check screen, in inches or cm.</li>' +
          '</ol>' +
        '</div>' +

        // Card 3: Oak, Walnut, and Maple in plain words
        '<div class ="card help-materials">' +
          '<h2>Materials</h2>' +
          '<dl class="help-woods">' +
            '<dt>Oak</dt>' +
            '<dd>Light brown and very hard-wearing.</dd>' +
            '<dt>Walnut</dt>' +
            '<dd>Dark brown with a rich look. Adds about a week to delivery.</dd>' +
            '<dt>Maple</dt>' +
            '<dd>Pale and smooth.</dd>' +
          '</dl>' +
        '</div>' +

        // Card 4: Demo phone and email
        '<div class="card help-contact">' +
          '<h2>Contact Support</h2>' +
          '<p>Phone: 1-800-234-5678 (demo)</p>' +
          '<p>Email: support@buildwell.example (demo)</p>' +
        '</div>' +
      
      '</div>';
    
    // 3. Adding the finished section to the page, below toolbar.
    container.appendChild(section);

    //4. Text size buttons: save size, apply everywhere, redraw, then confirm
    section.querySelectorAll('[data-size]').forEach(function (button) {
      button.addEventListener('click', function () {
        const size = Number(button.dataset.size);
        B.state.set('textSize', size, { undo: false}); //classifies as a settings, so it is NOT undoable
        B.ui.applyTextSize(); //resizes the whole app
        B.router.refresh(); //redraw so the new button gets highlighted
        const again = document.querySelector('.help [data-size="' + size + '"]');
        if (again) again.focus();
        B.ui.toast('Text size ' + (size * 100) + '%');
      });
    });

    // 5. Guided/Standard buttons: same pattern
      section.querySelectorAll('[data-mode]').forEach(function (button) {
        button.addEventListener('click', function () {
          const newMode = button.dataset.mode;
          B.state.set('mode', newMode, { undo: false });
          B.ui.applyMode();                                  // shows or hides Guided hints everywhere
          B.router.refresh();
          const again = document.querySelector('.help [data-mode="' + newMode + '"]');
          if (again) again.focus();
          B.ui.toast(newMode === 'guided' ? 'Guided mode on' : 'Standard mode on');
        });
      });
    
    // 6. IF the toolbar's A+ button changes the size while here,
    //    redraw so the highlighted button stays correct
    B.state.onChange(function (key) {
      if (key === 'textSize') B.router.refresh();
    });
  },    

    onEnter: function () {}
  };
})(window.Buildwell);
