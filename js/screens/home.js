// js/screens/home.js  |  Owner: A  |  Wireframe 1  |  SR5, UR6
// This screen does the following:
// - Allows an individual to choose Guided or Standard mode:
// - Guided = larger text and step-by-step hints for each page.
// - Standard = full controls, with normal (but adjustable) text size.
// Home screen also can be swapped to spanish (concept), open my orders or help.
(function (B) {
  'use strict';

  B.screens.home = {
    render: function (container) {
      B.ui.toolbar(container);

      // Reads the current language, and builds one dropdown option per language.
      const t = B.t;
      const lang = B.state.get('lang');
      const options = B.i18n.languages.map(function (l) {
        return '<option value="' + l.code + '" lang="' + l.code + '"' +
          (l.code === lang ? ' selected' : '') + '>' + l.name + '</option>';
      }).join('');

      const section = document.createElement('section');
      section.className = 'home';
      section.setAttribute('lang', lang);

      // Defines page content, following Wireframe 1 as the guide layout.
      
      section.innerHTML =
        //Language dropdown
        '<div class="home-top">' +
          '<label class="home-lang">' + t('language') + ': ' +
            '<select class="home-lang-select">' + options + '</select>' +
          '</label>' +
        '</div>' +
        // Title and subtitles
        '<h1 class="home-title">' + t('title') + '</h1>' +
        '<p class="home-subtitle">' + t('subtitle') + '</p>' +

        //Creates the two big mode buttons (Guided or Standard)
        '<div class="home-modes">' +
          '<button type="button" class="home-mode home-mode-guided" data-mode="guided">' +
            '<span class="home-mode-name">' + t('guided') + '</span>' +
            '<span class="home-mode-desc">' + t('guidedDesc') + '</span>' +
          '</button>' +
          '<button type="button" class="home-mode" data-mode="standard">' +
            '<span class="home-mode-name">' + t('standard') + '</span>' +
            '<span class="home-mode-desc">' + t('standardDesc') + '</span>' +
          '</button>' +
        '</div>' +

        // My Orders and Help: data-go tells the router which screen to open
        '<div class="home-links">' +
          '<button type="button" class="btn btn-secondary" data-go="orders">' + t('myOrders') + '</button>' +
          '<button type="button" class="btn btn-secondary" data-go="help">' + t('help') + '</button>' +
        '</div>';
      container.appendChild(section);


      //This saves the chosen language, and redraws the screen in that language.
      section.querySelector('.home-lang-select').addEventListener('change', function (e) {
        B.state.set('lang', e.target.value, { undo: false });
        B.router.refresh();
        const select = document.querySelector('.home-lang-select');
        if (select) select.focus();
      });

      //This saves the selected mode, and applies the changes based on that mode (hints for example)
      section.querySelectorAll('[data-mode]').forEach(function (button) {
        button.addEventListener('click', function () {
          const mode = button.getAttribute('data-mode');
          B.state.set('mode', mode, { undo: false });

          // Guided mode starts with larger text
          if (mode === 'guided' && B.state.get('textSize') < 1.25) {
            B.state.set('textSize', 1.25, { undo: false });
            B.ui.applyTextSize();
          }
          B.ui.applyMode();
          B.router.go('style'); //routes to the desk style screen
        });
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
