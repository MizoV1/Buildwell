// js/i18n.js  |  Owner: A  |  Home screen text in English and Spanish (UR6)
// Only the Home screen is translated. Every other screen stays in English.
// Use Buildwell.t('title') to get a label in the current language.

(function (B) {
  'use strict';

  B.i18n = {
    // Each language is listed in its own name so speakers can find it.
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ],

    strings: {
      en: {
        language: 'Language',
        title: 'How would you like to design?',
        subtitle: 'Made-to-order furniture that fits your space',
        guided: 'Guided',
        guidedDesc: 'Large text and step-by-step help',
        standard: 'Standard',
        standardDesc: 'Full controls',
        myOrders: 'My Orders',
        help: 'Help and Accessibility'
      },
      es: {
        language: 'Idioma',
        title: '¿Cómo le gustaría diseñar?',
        subtitle: 'Muebles hechos a medida que caben en su espacio',
        guided: 'Guiado',
        guidedDesc: 'Texto grande y ayuda paso a paso',
        standard: 'Estándar',
        standardDesc: 'Todos los controles',
        myOrders: 'Mis pedidos',
        help: 'Ayuda y accesibilidad'
      }
    }
  };

  B.t = function (key) {
    const lang = B.state.get('lang');
    const s = B.i18n.strings;
    return (s[lang] && s[lang][key]) || s.en[key] || key;
  };
})(window.Buildwell);
