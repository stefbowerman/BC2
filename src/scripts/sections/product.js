/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 * Uses slate.productDetailForm to handle core product form functionality.
 *
 * - Attaches the `Product` constructor to window.theme.Product.
 *
 * Requires:
 *  - jQuery
 *  - jQuery.fn.zoom - http://www.jacklmoore.com/zoom/
 *  - Slate
 *
 * See:
 * - product.liquid
 * - product-detail-form.liquid
 *
 * @namespace product
 */

theme.Product = (function($, slate) {

  var selectors = {
    stickyBar: '[data-product-sticky-bar]',
    stickyBarFormSlot: '[data-product-sticky-bar-form-slot]',    
    addToCartForm: '[data-add-to-cart-form]',
    addToCartFormWrapper: '[data-add-to-cart-form-wrapper]',
  };

  var classes = {
    stickyBarVisible: 'is-visible',
  };
  
  var $window   = $(window);
  var $document = $(document);

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    this.settings = {};
    this.name = 'product';
    this.namespace = '.'+this.name;

    this.events = {
      RESIZE: 'resize'  + this.namespace,
      CLICK: 'click'   + this.namespace,
      SCROLL: 'scroll' + this.namespace
    };    

    this.stickyFormEnabled = this.$container.data('sticky-form-enabled') || false;
    this.formIsSticky = false;
    this.stickyFormMinBreakpoint = slate.breakpoints.getBreakpointMinWidth('md');
    this.isBelowStickyFormMinBreakpoint = false;

    this.$addToCartFormWrapper = $(selectors.addToCartFormWrapper, this.$container);
    this.$addToCartForm = $(selectors.addToCartForm, this.$container);

    var productDetailForm = new slate.ProductDetailForm({
      $el: this.$container,
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false
    });

    productDetailForm.initialize();

    if(this.stickyFormEnabled) {

      this.$stickyBar = $(selectors.stickyBar, this.$container);
      this.$stickyBarFormSlot = $(selectors.stickyBarFormSlot, this.$container);

      $window.on(this.events.SCROLL, $.throttle(50, this.onScroll.bind(this)));
      $window.on(this.events.RESIZE, $.throttle(100, this.onResize.bind(this)));    

      // hit these one time on init to make sure everything is good
      this.onScroll();
      this.onResize();      
    }

  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Sticks the product form into and displays the header product bar
     *
     */
    stickAddToCartForm: function() {
      if(!this.stickyFormEnabled) return;

      if(this.formIsSticky == false) {
        this.$addToCartFormWrapper.css('height', this.$addToCartForm.outerHeight());
        this.$addToCartForm.fadeOut(50, function(){
          this.$addToCartForm.detach().appendTo(this.$stickyBarFormSlot);
          this.$stickyBar.addClass(classes.stickyBarVisible);
          this.$addToCartForm.fadeIn(150);
        }.bind(this));
        this.formIsSticky = true;
      }
    },

    /**
     * Removes the product form from the header product bar and hides the bar.
     *
     */
    unstickAddToCartForm: function() {
      if(!this.stickyFormEnabled) return;
      
      if(this.formIsSticky == true) {
        // Un stick it
        this.$stickyBar.removeClass(classes.stickyBarVisible);
        this.$addToCartForm.fadeOut(50, function(){
          this.$addToCartForm.detach().appendTo(this.$addToCartFormWrapper);
          this.$addToCartFormWrapper.css('height', '');
          this.$addToCartForm.fadeIn(150);
        }.bind(this));
        this.formIsSticky = false;
      }
    },

    /**
     * Checks the window size and scroll position to determine if the product form should be stuck or unstuck from the header
     *
     */
    stickyAddToCartFormCheck: function() {
      if(this.isAboveStickyFormMinBreakpoint) {
        $window.scrollTop() > this.$addToCartFormWrapper.offset()['top'] ? this.stickAddToCartForm() : this.unstickAddToCartForm();
      }
      else {
        this.unstickAddToCartForm();
      }
    },

    onScroll: function(e) {
      this.stickyAddToCartFormCheck();
    },

    onResize: function() {
      this.isAboveStickyFormMinBreakpoint = ( $window.width() >= this.stickyFormMinBreakpoint );
      this.stickyAddToCartFormCheck();
    },    
  });

  return Product;
})(jQuery, slate);
