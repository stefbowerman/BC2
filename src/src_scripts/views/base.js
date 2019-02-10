import BaseSection from '../sections/base';
import SectionConstructorDictionary from '../sectionConstructorDictionary'

export default class BaseView {
  
  constructor($el) {
    this.$el = $el;
    this.sections = [];

    $(document).on('shopify:section:load',   this.onSectionLoad.bind(this));
    $(document).on('shopify:section:unload', this.onSectionUnload.bind(this));

    console.log('BaseView - contructing view');
    $(window).scrollTop(0);
  }

  _createSectionInstance($container) {
    const id = $container.attr('data-section-id');
    const type = $container.attr('data-section-type');

    const constructor = SectionConstructorDictionary[type];

    // Need to make sure we're working with actual sections here..
    if (typeof constructor === 'undefined' || !(constructor.prototype instanceof BaseSection)) {
      return;
    }

    console.log('creating new section instance for type - ' + type );

    this.sections.push( new constructor($container) );
  }

  onSectionLoad(e) {
    console.log('[BaseView] - calling section LOAD');

    this._createSectionInstance($('[data-section-id]', e.target));
  }  

  onSectionUnload(e) {
    console.log('[BaseView] - calling section UNLOAD');
    console.log('sections count - ' + this.sections.length);

    var remainingSections = [];
    this.sections.forEach((section) => {
      if(section.id == e.detail.sectionId) {
        console.log('removing section for type - ' + section.type);
        section.onUnload();
      }
      else {
        remainingSections.push(section);
      }
    });

    this.sections = remainingSections;
    console.log('updated sections count - ' + this.sections.length);
  }

  destroy() {
    console.log('[BaseView] - calling DESTROY');
    if(this.sections.length) {
      this.sections.forEach((section) => {
        section.onUnload && section.onUnload();
      });
    }
  }

  transitionIn() {
    console.log('transition in!');
  }

  transitionOut(callback) {
    callback();
  }
}