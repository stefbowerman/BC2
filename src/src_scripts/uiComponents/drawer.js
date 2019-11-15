import Utils from '../utils';

const $document = $(document);
const $body     = $(document.body);

const selectors = {
  close: '[data-drawer-close]'
};

const classes = {
  drawer: 'drawer',
  visible: 'is-visible',
  backdrop: 'drawer-backdrop',
  backdropCursor: 'drawer-backdrop-cursor',
  backdropVisible: 'is-visible',
  backdropCursorVisible: 'is-visible',
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
    this.$backdrop              = null;
    this.$backdropCursor        = null;
    this.stateIsOpen            = false;
    this.transitionEndEvent     = Utils.whichTransitionEnd();
    this.supportsCssTransitions = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;

    if (this.$el == undefined || !this.$el.hasClass(classes.drawer)) {
      console.warn('['+this.name+'] - Element with class `'+classes.drawer+'` required to initialize.');
      return;
    }     

    const defaults = {
      closeSelector: selectors.close,
      backdrop: true
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

  addBackdrop(callback) {
    var _this = this;
    var cb    = callback || $.noop;

    if (this.stateIsOpen) {
      this.$backdrop = $(document.createElement('div'));
      this.$backdropCursor = $(document.createElement('div'));

      this.$backdropCursor.addClass(classes.backdropCursor)
                          .appendTo(this.$backdrop);

      this.$backdrop.addClass(classes.backdrop)
                    .appendTo($body);

      this.$backdrop.one(this.transitionEndEvent, cb);
      this.$backdrop.one('click', this.hide.bind(this));
      this.$backdrop.on('mouseenter', () => { this.$backdropCursor.addClass(classes.backdropCursorVisible); });
      this.$backdrop.on('mouseleave', () => { this.$backdropCursor.removeClass(classes.backdropCursorVisible); });
      this.$backdrop.on('mousemove', (e) => {
        window.requestAnimationFrame(function() {
          this.$backdropCursor.css({
            'transform': 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)'
          });
        }.bind(this));
      });      

      // debug this...
      setTimeout(function() {
        $body.addClass(classes.bodyDrawerOpen);          
        _this.$backdrop.addClass(classes.backdropVisible);
      }, 20);
    }
    else {
      cb();
    }
  }

  removeBackdrop(callback) {
    var _this = this;
    var cb    = callback || $.noop;

    if (_this.$backdrop) {
      _this.$backdrop.one(this.transitionEndEvent, function(){
        _this.$backdrop.off('mousemove mouseenter mouseleave');
        _this.$backdrop && _this.$backdrop.remove();
        _this.$backdrop = null;
        _this.$backdropCursor = null;
        cb();
      });

      setTimeout(function() {
        _this.$backdrop.removeClass(classes.backdropVisible);
        $body.removeClass(classes.bodyDrawerOpen);
      }, 10);
    }
    else {
      cb();
    }
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

    if (!this.stateIsOpen) return;

    this.$el.removeClass(classes.visible);

    if (this.settings.backdrop) {
      this.removeBackdrop();
    }    

    if (this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onHidden.bind(this));
    }
    else {
      this.onHidden();
    }
  }

  show() {
    const e = $.Event(this.events.SHOW);
    this.$el.trigger(e);

    if (this.stateIsOpen) return;

    this.stateIsOpen = true;

    this.$el.addClass(classes.visible);

    if (this.settings.backdrop) {
      this.addBackdrop();
    }    

    if (this.supportsCssTransitions) {
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