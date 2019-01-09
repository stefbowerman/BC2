import Utils from '../utils';

const $document = $(document);
const $body     = $(document.body);

const selectors = {
  close: '[data-drawer-close]'
};

const classes = {
  drawer: 'drawer',
  visible: 'is-visible',
  bodyDrawerOpen: 'drawer-open'    
};

export default class Drawer {
  
 /**
  * Drawer constructor
  *
  * @param {HTMLElement | $} el - The drawer element
  * @param {Object} options
  */  
  constructor(el, options) {
    this.name = 'drawer';
    this.namespace = `.${this.name}`;

    this.$el = $(el);
    this.stateIsOpen            = false;
    this.transitionEndEvent     = Utils.whichTransitionEnd();
    this.supportsCssTransitions = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;

    if(this.$el == undefined || !this.$el.hasClass(classes.drawer)) {
      console.warn('['+this.name+'] - Element with class `'+classes.drawer+'` required to initialize.');
      return;
    }     

    const defaults = {
      closeSelector: selectors.close,
    };

    this.settings = $.extend({}, defaults, options);

    this.events = {
      HIDE:   'hide'   + this.namespace,
      HIDDEN: 'hidden' + this.namespace,
      SHOW:   'show'   + this.namespace,
      SHOWN:  'shown'  + this.namespace
    };    

    this.$el.on('click', this.settings.closeSelector, this.onCloseClick.bind(this));    
  }
  
  /**
   * Called after the closing animation has run
   */    
  onHidden() {
    this.stateIsOpen = false;
    const e = $.Event(this.events.HIDDEN);
    this.$el.trigger(e);
  }

  /**
   * Called after the opening animation has run
   */
  onShown() {
    var e = $.Event(this.events.SHOWN);
    this.$el.trigger(e);
  }

  hide() {
    const e = $.Event(this.events.HIDE);
    this.$el.trigger(e);

    if(!this.stateIsOpen) return;

    this.$el.removeClass(classes.visible);     

    if(this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onHidden.bind(this));
    }
    else {
      this.onHidden();
    }
  }

  show() {
    const e = $.Event(this.events.SHOW);
    this.$el.trigger(e);

    if(this.stateIsOpen) return;

    this.stateIsOpen = true;

    this.$el.addClass(classes.visible);

    if(this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onShown.bind(this));
    }
    else {
      this.onShown();
    }        
  }

  toggle() {
    return this.stateIsOpen ? this.hide() : this.show();
  }

  onCloseClick(e) {
    e.preventDefault();
    this.hide();
  }  

}