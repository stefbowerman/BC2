import Utils from '../utils';

const $document = $(document);
const $body     = $(document.body);

const selectors = {
  close: '[data-toast-close]',
  content: '.toast__content'
};

const classes = {
  toast: 'toast',
  visible: 'is-visible'
};

export default class Toast {
  
 /**
  * Toast constructor
  *
  * @param {HTMLElement | $} el - The toast element
  * @param {Object} options
  */  
  constructor(el, options) {
    this.name = 'toast';
    this.namespace = `.${this.name}`;

    this.$el = $(el);
    this.$content               = this.$el.find(selectors.content);
    this.stateIsOpen            = false;
    this.transitionEndEvent     = Utils.whichTransitionEnd();
    this.supportsCssTransitions = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;
    this.interactionTimeout     = false;
    this.timeoutDuration        = 2000;

    if(this.$el == undefined || !this.$el.hasClass(classes.toast)) {
      console.warn('['+this.name+'] - Element with class `'+classes.toast+'` required to initialize.');
      return;
    }     

    this.events = {
      HIDE:   'hide'   + this.namespace,
      HIDDEN: 'hidden' + this.namespace,
      SHOW:   'show'   + this.namespace,
      SHOWN:  'shown'  + this.namespace
    };    

    this.$el.on('mouseenter', this.onMouseenter.bind(this));
    this.$el.on('mouseleave', this.onMouseleave.bind(this));
    this.$el.on('click', selectors.close, this.onCloseClick.bind(this));
  }

  setInteractionTimeout() {
    this.interactionTimeout = setTimeout(() => {
      this.hide();
    }, this.timeoutDuration);
  }

  clearInteractionTimeout() {
    clearTimeout(this.interactionTimeout);
  }

  setContent(content) {
    this.$content.html(content);
  }
  
  /**
   * Called after the closing animation has run
   */    
  onHidden() {
    this.stateIsOpen = false;
    this.clearInteractionTimeout();
    const e = $.Event(this.events.HIDDEN);
    this.$el.trigger(e);
  }

  /**
   * Called after the opening animation has run
   */
  onShown() {
    this.setInteractionTimeout();
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

  onMouseenter() {
    this.clearInteractionTimeout();
  }

  onMouseleave() {
    this.setInteractionTimeout();
  } 

}