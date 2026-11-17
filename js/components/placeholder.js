// js/components/placeholder.js  |  Owner: A  |  Temporary boxes showing what a screen still needs
// Used only while a screen is being built. Delete the placeholder call once your real screen is in.
//
// Buildwell.ui.placeholder(container, {
//   title: 'Check the fit',
//   label: 'Wireframes 2 and 4 · Area B · SR4, UR2, UR4',
//   boxes: [ { title: 'Camera scan', ref: 'Wireframe 2, left', items: ['...', '...'] } ],
//   next: { label: 'Continue to Customize', go: 'customize' }
// });

(function (B) {
  'use strict';

  B.ui.placeholder = function (container, info) {
    const boxes = info.boxes.map(function (box) {
      return '<div class="placeholder-box">' +
        '<h2 class="placeholder-box-title">' + box.title + '</h2>' +
        (box.ref ? '<p class="placeholder-ref">' + box.ref + '</p>' : '') +
        '<ul>' + box.items.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>' +
        '</div>';
    }).join('');

    const section = document.createElement('section');
    section.className = 'placeholder';
    section.innerHTML =
      '<h1>' + info.title + '</h1>' +
      '<p class="placeholder-label">' + info.label + '</p>' +
      '<p class="placeholder-note">Placeholder: build the real screen here. Each box below is one part of the wireframe.</p>' +
      '<div class="placeholder-grid">' + boxes + '</div>' +
      (info.next
        ? '<div class="placeholder-next"><button type="button" class="btn btn-secondary" data-go="' + info.next.go + '">' +
            info.next.label + ' (temporary) <span aria-hidden="true">→</span></button></div>'
        : '');
    container.appendChild(section);
    return section;
  };
})(window.Buildwell);
