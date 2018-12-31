import Utils from './utils';
import BaseSection from './sections/base';

export default class SectionManager {
  
  constructor() {
    this.constructors = {};
    this.instances = [];

  $(document)
    .on({
      'shopify:section:load': this._onSectionLoad.bind(this),
      'shopify:section:unload': this._onSectionUnload.bind(this),
      'shopify:section:select': this._onSelect.bind(this),
      'shopify:section:deselect': this._onDeselect.bind(this),
      'shopify:section:reorder': this._onReorder.bind(this),
      'shopify:block:select': this._onBlockSelect.bind(this),
      'shopify:block:deselect': this._onBlockDeselect.bind(this)
    })
  }

  _createInstance(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    // Need to make sure we're working with actual sections here..
    if (typeof constructor === 'undefined' || !(constructor.prototype instanceof BaseSection)) {
      return;
    }

    // Prevents us from create duplicate instances
    for (var i = this.instances.length - 1; i >= 0; i--) {
      if(container == this.instances[i].container) {
        return;
      }
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  }

  _triggerFunctionForSectionEvent(evt, funcName) {
    const instance = Utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if( instance && typeof instance[funcName] == 'function') {
      instance[funcName](evt);
    }
  }

  _onSectionLoad(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  }

  _onSectionUnload(evt) {
    var instance = Utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    this._triggerFunctionForSectionEvent(evt, 'onUnload');

    this.instances = Utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  }

  _onSelect(evt) {
    this._triggerFunctionForSectionEvent(evt, 'onSelect');
  }

  _onDeselect(evt) {
    this._triggerFunctionForSectionEvent(evt, 'onDeselect');
  }

  _onReorder(evt) {
    this._triggerFunctionForSectionEvent(evt, 'onReorder');
  }

  _onBlockSelect(evt) {
    this._triggerFunctionForSectionEvent(evt, 'onBlockSelect');
  }

  _onBlockDeselect(evt) {
    this._triggerFunctionForSectionEvent(evt, 'onBlockDeselect');
  }

  register(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each((i, container) => {
      this._createInstance(container, constructor);
    });
  }

  createInstancesForWrapper($wrapper) {
    if(!$wrapper || $wrapper.length == 0) return;

    console.log('creating instances for wrapper');
    $wrapper.find('[data-section-type]').each((i, container) => {
      console.group();
      console.log(i);
      console.log(container);
      console.groupEnd();
      this._createInstance(container);
    });
  }

  destroyInstancesForWrapper($wrapper) {
    
    if(!$wrapper || $wrapper.length == 0) return;

    let instances = this.instances;


    console.group('pre-destroy');
    this.instances.map((i) => { console.log(i.container);});
    console.groupEnd()

    $wrapper.find('[data-section-type]').each((i, container) => {
      console.group('checking...');
      console.log(i);
      console.log(container);
      console.groupEnd();      
      let found = false;
      for (var i = 0; i < instances.length; i++) {
        if(container == this.instances[i].container) {
          found == true;
          // this.instances[i].onUnload ?
          instances.splice(i, 1);
          break;
        }
      }
    });

    this.instances = instances;

    console.log('number of instances after removal = ' + this.instances.length);    
  }
}