// js/screens/help.js  |  Owner: A  |  Information hierarchy: Help  |  UR6
//
// WHAT TO BUILD
//   [ ] Accessibility settings: text size buttons (100%, 125%, 150%, 200%) and Guided / Standard
//       (use B.ui.applyTextSize() and B.ui.applyMode() after saving, like home.js does)
//   [ ] Measuring your space: short steps for using a tape measure
//   [ ] Materials: plain-language notes on oak, walnut and maple
//   [ ] Contact support (demo phone and email)
//   [ ] Line saying nothing has a time limit and Undo / Back are on every screen
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

      // 2. Page Contents
      section.innerHTML = 
      //Title
      '<h1>Help and accessibility</h1>' +

      // Introdction under the title
      '<p class = "help-intro"> Change how Buildwell looks, or find answers to common questions.</p>' +

      // Defined into two-columns layout
      // As the screen gets narrower it drops to single column (larger text sizes for example)
      '<div class = "two-col">' +

        // Card 1: text size and Guided / Standard buttons
        '<div class = "card help-settings">' +
          '<h2>Accessiblity settings</h2>' +
        '</div>' +

        // Card 2: Tape measuring steps
        '<div class = "card help-measuring">' +
          '<h2>Measuring your space</h2>' +
        '</div>' +

        // Card 3: Oak, Walnut, and Maple in plain words
        '<div class ="card help-materials">' +
          '<h2> Contact support</h2>' +
        '</div>' +

        // Card 4: Demo phone and email
        '<div class="card help-contact">' +
          '<h2>Contact support</h2>' +
        '</div>' +
      
      '</div>';
    
    // 3. Adding the finished section to the page, below toolbar.
    container.appendChild(section);
    },    

    onEnter: function () {}
  };
})(window.Buildwell);
