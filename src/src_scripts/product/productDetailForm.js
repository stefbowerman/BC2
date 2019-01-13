import ProductVariants from './productVariants';
import ProductImageTouchZoomController from './productImageTouchZoomController';
import ProductImageDesktopZoomController from './productImageDesktopZoomController';
import * as Breakpoints from '../breakpoints';
import Utils from '../utils';
import Currency from '../currency';

const selectors = {
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  originalSelectorId: '[data-product-select]',
  priceWrapper: '[data-price-wrapper]',
  productZoomButton: '[data-zoom-button]',

  gallery: '[data-gallery]',
  galleryItem: '[data-gallery-item]',
  galleryImage: '[data-gallery-image]',

  productJson: '[data-product-json]',
  productPrice: '[data-product-price]',
  singleOptionSelector: '[data-single-option-selector]',
  variantOptionValueList: '[data-variant-option-value-list][data-option-position]',
  variantOptionValue: '[data-variant-option-value]'
};

const classes = {
  hide: 'hide',
  variantOptionValueActive: 'is-active',
  variantOptionValueDisabled: 'is-disabled',
  variantOptionValueNotHovered: 'is-not-hovered',
  zoomReady: 'is-zoomable',
  zoomedIn: 'is-zoomed',
  galleryReady: 'is-ready',
  galleryImageLoaded: 'is-loaded'
};

const $window = $(window);

export default class ProductDetailForm {

  /**
   * ProductDetailForm constructor
   *
   * @param { Object } config
   * @param { jQuery } config.$el - Main element, see snippets/product-detail-form.liquid
   * @param { jQuery } config.$container - Container to listen to scope events / element to listen to events on.  Defaults to config.$el
   * @param { Boolean } config.enableHistoryState - If set to "true", turns on URL updating when switching variants
   * @param { Function } config.onReady -  Called after the product form is initialized.
   */  
  constructor(config) {
    this.settings = {};
    this.name = 'productDetailForm';
    this.namespace = `.${this.name}`;

    this.events = {
      RESIZE: 'resize' + this.namespace,
      CLICK:  'click'  + this.namespace,
      READY:  'ready'  + this.namespace,
      MOUSEENTER: 'mouseenter' + this.namespace,
      MOUSELEAVE: 'mouseleave' + this.namespace
    };

    let ready = false;
    const defaults = {
      enableHistoryState: true
    };

    this.initialize = function() {
      if(ready) {
        return;
      }

      this.stickyMaxWidth = Breakpoints.getBreakpointMinWidth('sm') - 1;
      this.zoomMinWidth = Breakpoints.getBreakpointMinWidth('sm');
      this.settings = $.extend({}, defaults, config);

      if (!this.settings.$el || this.settings.$el == undefined) {
        console.warn('['+this.name+'] - $el required to initialize');
        return;
      }

      this.$el = this.settings.$el;
      this.$container = this.settings.$container;

      if (!this.$container || this.$container == undefined) {
        this.$container = this.$el;
      }

      // Dom elements we'll need
      // this.$singleOptionSelectors      = $(selectors.singleOptionSelector, this.$container);
      // this.$productGallerySlideshow    = $(selectors.productGallerySlideshow, this.$container);
      // this.$productGalleryCurrentIndex = $(selectors.productGalleryCurrentIndex, this.$container);
      // this.$addToCartBtn               = $(selectors.addToCart, this.$container);
      // this.$addToCartBtnText           = $(selectors.addToCartText, this.$container);
      // this.$priceWrapper               = $(selectors.priceWrapper, this.$container);
      // this.$productPrice               = $(selectors.productPrice, this.$container);
      // this.$comparePrice               = $(selectors.comparePrice, this.$container);
      // this.$comparePriceText           = $(selectors.comparePriceText, this.$container);
      this.$gallery              = $(selectors.gallery, this.$container);
      this.$galleryItems         = $(selectors.galleryItem, this.$container);
      this.$galleryImages        = $(selectors.galleryImage, this.$container);      

      this.productSingleObject  = JSON.parse($(selectors.productJson, this.$container).html());

      var variantOptions = {
        $container: this.$container,
        enableHistoryState: this.settings.enableHistoryState,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new ProductVariants(variantOptions);
      this.productImageTouchZoomController = new ProductImageTouchZoomController(this.$container);
      this.productImageDesktopZoomController = new ProductImageDesktopZoomController(this.$container);

      // this.productImageTouchZoomController.enable();

      // console.log(this);

      this.$galleryImages.first().imagesLoaded(() => {
        this.$gallery.addClass(classes.galleryReady);
      });

      this.$galleryImages.unveil(200, function() {
        var $img = $(this);
        $img.on('load', function() {
          $img.addClass(classes.galleryImageLoaded).removeAttr('data-src');
        });
      });      

      // See productVariants
      this.$container.on('variantChange' + this.namespace, this.onVariantChange.bind(this));
      this.$container.on(this.events.CLICK, selectors.variantOptionValue, this.onVariantOptionValueClick.bind(this));
      this.$container.on(this.events.MOUSEENTER, selectors.variantOptionValue, this.onVariantOptionValueMouseenter.bind(this));
      this.$container.on(this.events.MOUSELEAVE, selectors.variantOptionValue, this.onVariantOptionValueMouseleave.bind(this));
      $window.on('resize', $.throttle(50, this.onResize.bind(this)));

      this.onResize();

      var e = $.Event(this.events.READY);
      this.$el.trigger(e);

      ready = true;
    };    
  }

  onVariantChange(evt) {
    var variant = evt.variant;

    this.updateProductPrices(variant);
    this.updateAddToCartState(variant);
    this.updateVariantOptionValues(variant);
  }

  /**
   * Updates the DOM state of the add to cart button
   *
   * @param {Object} variant - Shopify variant object
   */
  updateAddToCartState(variant) {

    var $addToCartBtn     = $(selectors.addToCart, this.$container);
    var $addToCartBtnText = $(selectors.addToCartText, this.$container);
    var $priceWrapper     = $(selectors.priceWrapper, this.$container);

    if (variant) {
      $priceWrapper.removeClass(classes.hide);
    } else {
      $addToCartBtn.prop('disabled', true);
      $addToCartBtnText.html(theme.strings.unavailable);
      $priceWrapper.addClass(classes.hide);
      return;
    }

    if (variant.available) {
      $addToCartBtn.prop('disabled', false);
      $addToCartBtnText.html(theme.strings.addToCart);
    } else {
      $addToCartBtn.prop('disabled', true);
      $addToCartBtnText.html(theme.strings.soldOut);
    }
  } 

  /**
   * Updates the DOM with specified prices
   *
   * @param {Object} variant - Shopify variant object
   */
  updateProductPrices(variant) {
    var $productPrice = $(selectors.productPrice, this.$container);
    var $comparePrice = $(selectors.comparePrice, this.$container);
    var $compareEls   = $comparePrice.add( $(selectors.comparePriceText, this.$container) );

    if(variant) {
      $productPrice.html(Currency.stripZeroCents(Currency.formatMoney(variant.price, theme.moneyFormat)));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(Currency.stripZeroCents(Currency.formatMoney(variant.compare_at_price, theme.moneyFormat)));
        $compareEls.removeClass(classes.hide);
      } else {
        $comparePrice.html('');
        $compareEls.addClass(classes.hide);
      }
    }
  }

  /**
   * Updates the DOM state of the elements matching the variantOption Value selector based on the currently selected variant
   *
   * @param {Object} variant - Shopify variant object
   */
  updateVariantOptionValues(variant) {
    if(variant) {
      // Loop through all the options and update the option value
      for (var i = 1; i <= 3; i++) {
        var variantOptionValue = variant['option' + i];

        if(!variantOptionValue) break; // Break if the product doesn't have an option at this index

        // Since we are finding the variantOptionValueUI based on the *actual* value, we need to scope to the correct list
        // As some products can have the same values for different variant options (waist + inseam both use "32", "34", etc..)
        var $variantOptionValueList = $(selectors.variantOptionValueList, this.$container).filter('[data-option-position="'+i+'"]');
        var $variantOptionValueUI = $('[data-variant-option-value="'+variantOptionValue+'"]', $variantOptionValueList);

        $variantOptionValueUI.addClass( classes.variantOptionValueActive );
        $variantOptionValueUI.siblings().removeClass( classes.variantOptionValueActive );
      }
    }
  }

  /**
   * Handle variant option value click event.
   * Update the associated select tag and update the UI for this value
   *
   * @param {event} evt
   */
  onVariantOptionValueClick(e) {
    e.preventDefault();

    const $option = $(e.currentTarget);

    if ($option.hasClass(classes.variantOptionValueActive) || $option.hasClass(classes.variantOptionValueDisabled) || $option.attr('disabled') != undefined) {
      return;
    }

    const value     = $option.data('variant-option-value');
    const position  = $option.parents(selectors.variantOptionValueList).data('option-position');
    const $selector = $(selectors.singleOptionSelector, this.$container).filter('[data-index="option'+position+'"]');

    $selector.val(value);
    $selector.trigger('change');

    $option.addClass(classes.variantOptionValueActive);
    $option.siblings().removeClass( classes.variantOptionValueActive );      
  }

  onVariantOptionValueMouseenter(e) {
    const $option = $(e.currentTarget);
    const $list = $option.parents(selectors.variantOptionValueList);

    if($option.hasClass(classes.variantOptionValueDisabled) || $option.attr('disabled') != undefined) return;

    $list.find(selectors.variantOptionValue).not($option).addClass(classes.variantOptionValueNotHovered);
  }

  onVariantOptionValueMouseleave(e) {
    console.log('leave');
    const $option = $(e.currentTarget);
    const $list = $option.parents(selectors.variantOptionValueList);
    $list.find(selectors.variantOptionValue).removeClass(classes.variantOptionValueNotHovered);
  }

  onResize(e) {
    if(window.innerWidth >= this.zoomMinWidth) {
      this.productImageTouchZoomController.disable();
      this.productImageDesktopZoomController.enable();
    }
    else {
      if(Modernizr && Modernizr.touchevents) {
        this.productImageTouchZoomController.enable();
      }
    }

    if(window.innerWidth < this.stickyMaxWidth) {
      $('.product-detail-form').css('margin-bottom', $('.product-essential').outerHeight());
    }
    else {
      $('.product-detail-form').css('margin-bottom', '');
    }
  }
}