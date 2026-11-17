// js/screens/home.js  |  Owner: A  |  Wireframe 1  |  SR5, UR6
// Choose Guided or Standard mode, language (Home only), My Orders, Help.

(function (B) {
  'use strict';

  B.screens.home = {
    render: function (container) {
      B.ui.toolbar(container);

      const t = B.t;
      const lang = B.state.get('lang');
      const options = B.i18n.languages.map(function (l) {
        return '<option value="' + l.code + '" lang="' + l.code + '"' +
          (l.code === lang ? ' selected' : '') + '>' + l.name + '</option>';
      }).join('');

      const section = document.createElement('section');
      section.className = 'home';
      section.setAttribute('lang', lang);
      section.innerHTML =
        '<div class="home-top">' +
          '<label class="home-lang">' + t('language') + ': ' +
            '<select class="home-lang-select">' + options + '</select>' +
          '</label>' +
        '</div>' +
        '<h1 class="home-title">' + t('title') + '</h1>' +
        '<p class="home-subtitle">' + t('subtitle') + '</p>' +
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
        '<div class="home-links">' +
          '<button type="button" class="btn btn-secondary" data-go="orders">' + t('myOrders') + '</button>' +
          '<button type="button" class="btn btn-secondary" data-go="help">' + t('help') + '</button>' +
        '</div>';
      container.appendChild(section);

      section.querySelector('.home-lang-select').addEventListener('change', function (e) {
        B.state.set('lang', e.target.value, { undo: false });
        B.router.refresh();
        const select = document.querySelector('.home-lang-select');
        if (select) select.focus();
      });

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
          B.router.go('style');
        });
      });
    },

    onEnter: function () {}
  };
})(window.Buildwell);
