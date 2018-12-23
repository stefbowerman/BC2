/**
 * Model - QuickView
 * -----------------------------------------------------------------------------
 * QuickViews are versions of the product detail form that we pull down via AJAX and append to a product card.
 *
 * Requires:
 *  - jQuery
 *  - jQuery.imagesLoaded
 *  - Modernizr (for Modernizr.csstransitions)
 *
 * @namespace models.quickView
 */

 slate.models = slate.models || {};

 slate.models.QuickView = (function($, Modernizr, undefined) {

  var selectors = {
    quickView: '[data-quick-view]',
    quickViewContentsBody: '[data-quick-view-contents-body]',
    quickViewClose: '[data-quick-view-close]',
    productCardContents: '[data-product-card-contents]',
    productDetailForm: '[data-product-detail-form]'
  };

  var classes = {
    quickViewIsOpen: 'is-open',
    productCardHasOpenQuickView: 'has-open-quick-view'
  };  

  /**
   * QuickView constructor
   *
   * @param { Object } settings
   * @param { HTMLElement | jQuery } settings.$productCard
   * @param { String } settings.url - URL pointing to the quick view of the product
   * @param { Function } settings.onProductDetailFormReady - Called after the product form is initialized.  `this` references the QuickView instance
   * @param { Number } settings.transitionDuration - ms
   * @param { String } settings.transitionTimingFunction - string matching a jQuery easing equation.  see slate.animations.
   */
  function QuickView(options) {

    this.name = 'quickView';
    this.namespace = '.'+this.name;

    var self = this;
    var defaults = {
      onProductDetailFormReady: $.noop,
      transitionDuration: 800,
      transitionTimingFunction: 'ease-in-out'
    };

    this.settings = $.extend({}, defaults, options);

    if(typeof this.settings.$productCard == undefined) {
      console.warn('['+this.name+'] - $productCard element required to initialize');
      return;
    }

    if(typeof this.settings.url != "string" || this.settings.url.length == 0 || this.settings.url.indexOf('quick-view') == -1) {
      console.warn('['+this.name+'] - valid URL required to initialize');
      return;
    }

    // Elements we'll need for everything to work
    this.$productCard           = this.settings.$productCard;
    this.$productCardContents   = this.$productCard.find(selectors.productCardContents);
    this.$productDetailForm     = null;
    this.$quickView             = null;
    this.$quickViewContentsBody = null;
    this.$close                 = null;

    this.stateIsOpen               = false;
    this.supportsCssTransitions    = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;
    this.productDetailFormInstance = null;

    this.events = {
      OPEN:   'open'   + this.namespace,
      OPENED: 'opened' + this.namespace,
      CLOSE:  'close'  + this.namespace,
      CLOSED: 'closed' + this.namespace,
      LOADED: 'loaded' + this.namespace
    };

    this.$productCard.on('click', selectors.quickViewClose, this.onCloseClick.bind(this));

    this.$productCard.height( this.$productCardContents.outerHeight(true) );

    // Initial ajax request to get the quick view content
    $.get(this.settings.url, this._onAjaxSuccess.bind(this));

    return this;
  }

  QuickView.prototype = {

    /**
     * Initial AJAX Call callback
     * Gets the returned HTML, adds it to the DOM, sets the instance's dom element variables, initializes the product detail form
     *
     */
    _onAjaxSuccess: function(ajaxResponse) {
      this.$productCard.append( $(ajaxResponse) );

      this.$productDetailForm     = this.$productCard.find(selectors.productDetailForm);
      this.$quickView             = this.$productCard.find(selectors.quickView);
      this.$quickViewContentsBody = this.$productCard.find(selectors.quickViewContentsBody);
      this.$close                 = this.$quickView.find(selectors.quickViewClose);

      this.$productDetailForm.on('ready.productDetailForm', this.onProductDetailFormReady.bind(this));

      var config = {
        $el: this.$productDetailForm,
        zoomEnabled: true,
        enableHistoryState: false
      };

      this.productDetailFormInstance = new slate.ProductDetailForm(config);
      this.productDetailFormInstance.initialize();

      // Fire off the loaded event once all the images in the quick view are loaded
      this.$quickView.imagesLoaded()
        .always( function() {
          var e = $.Event(this.events.LOADED);
          this.$productCard.trigger(e);          
        }.bind(this));

    },

    /**
     * Called after the product detail form is done initializing
     */
    onProductDetailFormReady: function() {
      this.settings.onProductDetailFormReady.call(this);
    },

    open: function() {

      this.onOpen();

      if(this.isOpen()) {
        return;
      }

      this.stateIsOpen = true;
      this.doOpenAnimation();
    },

    close: function() {

      this.onClose();

      if(this.isClosed()) {
        return;
      }

      this.stateIsOpen = false;
      this.doCloseAnimation();
    },

    isOpen: function() {
      return this.stateIsOpen;
    },

    isClosed: function() {
      return !this.isOpen();
    },

    /**
     * Called after this.open is called but before any opening animation has run
     */
    onOpen: function() {
      this.$productCard.addClass(classes.productCardHasOpenQuickView);
      var e = $.Event(this.events.OPEN);
      this.$productCard.trigger(e);
    },

    /**
     * Called after this.close is called but before any closing animation has run
     */
    onClose: function() {
      this.$productCard.removeClass(classes.productCardHasOpenQuickView);
      var e = $.Event(this.events.CLOSE);
      this.$productCard.trigger(e);
    },

    /**
     * Called after the opening animation has run
     */
    onOpened: function() {
      var e = $.Event(this.events.OPENED);
      this.$productCard.trigger(e);

    },

    /**
     * Called after the closing animation has run
     */
    onClosed: function() {
      var e = $.Event(this.events.CLOSED);
      this.$productCard.trigger(e);
      this.$quickView.removeClass(classes.quickViewIsOpen);
    },

    doOpenAnimation: function() {

      this.$quickView.addClass(classes.quickViewIsOpen);

      var productCardContentsHeight = this.$productCardContents.outerHeight(true);
      var qvHeight = this.$quickViewContentsBody.outerHeight(true);
      
      this.$productCard.height(productCardContentsHeight);
      this.$quickView.height(0);

      this.setTransitions();
      
      this.$productCard.height(productCardContentsHeight + qvHeight);
      this.$quickView.height(qvHeight);

      if(this.supportsCssTransitions) {
        this.$quickView.one(slate.utils.whichTransitionEnd(), this.onOpened.bind(this));
      }
      else {
        this.onOpened();
      }
    },

    doCloseAnimation: function() {
      this.stateIsOpen = false;
      
      var productCardContentsHeight = this.$productCardContents.outerHeight(true);

      this.$productCard.height(productCardContentsHeight);
      this.$quickView.height(0);

      if(this.supportsCssTransitions) {
        this.$quickView.one(slate.utils.whichTransitionEnd(), this.onClosed.bind(this));
      }
      else {
        this.onClosed();
      }
    },

    onResize: function() {
      var qvHeight = this.$quickViewContentsBody.outerHeight(true);
      var pccHeight = this.$productCardContents.outerHeight(true);

      if(this.isClosed()) {
        this.$productCard.height(pccHeight);
      }
      else {
        this.$productCard.height(pccHeight + qvHeight);
        this.$quickView.height(qvHeight);
      }
    },

    setTransitions: function() {
      var trans = 'height ' + this.settings.transitionDuration + 'ms ' + this.settings.transitionTimingFunction;
      this.$quickView.css( 'transition', trans);
      this.$productCard.css( 'transition', trans);
    },

    scrollToProductCard: function() {
      $('html, body').animate( { scrollTop : (this.$productCard.offset().top - 100) } );
    },
    scrollToQuickView: function() {
      $('html, body').animate( { scrollTop : this.$quickView.offset().top } );
    },
    onCloseClick: function(e) {
      e.preventDefault();
      this.close();
    }
  };

  return QuickView;

})(jQuery, Modernizr);
