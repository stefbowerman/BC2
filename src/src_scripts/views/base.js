import BaseSection from '../sections/base';
import SectionConstructorDictionary from '../sectionConstructorDictionary';

const $document = $(document);

export default class BaseView {
  constructor($el) {
    this.$el = $el;
    this.sections = [];

    $document.on('shopify:section:load',   this.onSectionLoad.bind(this));
    $document.on('shopify:section:unload', this.onSectionUnload.bind(this));
    $(window).scrollTop(0);
  }

  _createSectionInstance($container) {
    // const id = $container.attr('data-section-id');
    const type = $container.attr('data-section-type');

    const constructor = SectionConstructorDictionary[type];

    // Need to make sure we're working with actual sections here..
    if (typeof constructor === 'undefined' || !(constructor.prototype instanceof BaseSection)) {
      return;
    }

    this.sections.push(new constructor($container));
  }

  onSectionLoad(e) {
    this._createSectionInstance($('[data-section-id]', e.target));
  }

  onSectionUnload(e) {
    const remainingSections = [];
    this.sections.forEach((section) => {
      if (section.id === e.detail.sectionId) {
        section.onUnload();
      }
      else {
        remainingSections.push(section);
      }
    });

    this.sections = remainingSections;
  }

  destroy() {
    if (this.sections.length) {
      this.sections.forEach((section) => {
        section.onUnload && section.onUnload();
      });
    }
  }

  transitionIn() {

  }

  transitionOut(callback) {
    callback();
  }
}
