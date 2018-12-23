/**
 * Drawer
 * ------------------------------------------------------------------------------
 *
 * Requires:
 *  - Modernizr
 *
 * @namespace - models.Drawer
*/

slate.models = slate.models || {};

slate.models.Drawer = (function($, Modernizr) {

  var $document = $(document);
  var $body     = $(document.body);

  var selectors = {
    close: '[data-drawer-close]'
  };

  var classes = {
    drawer: 'drawer',
    visible: 'is-visible',
    backdrop: 'drawer-backdrop',
    backdropVisible: 'is-visible',
    bodyDrawerOpen: 'drawer-open'    
  };

 /**
  * Drawer constructor
  *
  * @param {HTMLElement | $} el - The drawer element
  * @param {Object} options
  */
  function Drawer(el, options) {

    this.name = 'drawer';
    this.namespace = '.'+this.name;

    this.$el = $(el);
    this.$backdrop              = null;
    this.stateIsOpen            = false;
    this.transitionEndEvent     = slate.utils.whichTransitionEnd();
    this.supportsCssTransitions = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;

    if(this.$el == undefined || !this.$el.hasClass(classes.drawer)) {
      console.warn('['+this.name+'] - Element with class `'+classes.drawer+'` required to initialize.');
      return;
    }     

    var defaults = {
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

  Drawer.prototype = $.extend({}, Drawer.prototype, {

    addBackdrop: function(callback) {
      var _this = this;
      var cb    = callback || $.noop;

      if(this.stateIsOpen) {
        this.$backdrop = $(document.createElement('div'));

        this.$backdrop.addClass(classes.backdrop)
                      .appendTo($body);

        this.$backdrop.one(this.transitionEndEvent, cb);
        this.$backdrop.one('click', this.hide.bind(this));

        // debug this...
        setTimeout(function() {
          $body.addClass(classes.bodyDrawerOpen);          
          _this.$backdrop.addClass(classes.backdropVisible);
        }, 10);
      }
      else {
        cb();
      }
    },

    removeBackdrop: function(callback) {
      var _this = this;
      var cb    = callback || $.noop;

      if(this.$backdrop) {
        this.$backdrop.one(this.transitionEndEvent, function(){
          _this.$backdrop && _this.$backdrop.remove();
          _this.$backdrop = null;
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
    },
    
    /**
     * Called after the closing animation has run
     */    
    onHidden: function() {
      this.stateIsOpen = false;
      var e = $.Event(this.events.HIDDEN);
      this.$el.trigger(e);
    },

    /**
     * Called after the opening animation has run
     */
    onShown: function() {
      var e = $.Event(this.events.SHOWN);
      this.$el.trigger(e);
    },

    hide: function() {
      var e = $.Event(this.events.HIDE);
      this.$el.trigger(e);

      if(!this.stateIsOpen) return;

      this.$el.removeClass(classes.visible);

      if(this.settings.backdrop) {
        this.removeBackdrop();
      }        

      if(this.supportsCssTransitions) {
        this.$el.one(this.transitionEndEvent, this.onHidden.bind(this));
      }
      else {
        this.onHidden();
      }
    },

    show: function() {
      var e = $.Event(this.events.SHOW);
      this.$el.trigger(e);

      if(this.stateIsOpen) return;

      this.stateIsOpen = true;

      this.$el.addClass(classes.visible);

      if(this.settings.backdrop) {
        this.addBackdrop();
      }

      if(this.supportsCssTransitions) {
        this.$el.one(this.transitionEndEvent, this.onShown.bind(this));
      }
      else {
        this.onShown();
      }        
    },

    toggle: function() {
      return this.stateIsOpen ? this.hide() : this.show();
    },

    onCloseClick: function(e) {
      e.preventDefault();
      this.hide();
    }
  });

  // DRAWER DATA-API
  // ===============

  $document.on('click.drawer', '[data-toggle="drawer"]', function (e) {

    var $this   = $(this);
    var $target = $($this.attr('data-target'));
    var options = $.extend($target.data(), $this.data());
    var data    = $this.data('drawer');

    if ($this.is('a')) e.preventDefault();

    if(!data) {
      $this.data('drawer', (data = new Drawer($target, options)));
      data.show();
    }
    else {
      data.toggle();
    }

  });  

  return Drawer;
  
}(jQuery, Modernizr));
