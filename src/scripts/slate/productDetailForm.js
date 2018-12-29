/**
 * Product Detail Form Script
 * ------------------------------------------------------------------------------
 *
 * Handles all functionality related to contents of snippets/product-detail-form.liquid
 * Core functionality includes:
 *  - Variant selecting + callbacks
 *  - Variant galleries + slideshow initializing
 *
 * Requires:
 *  - jQuery
 *  - Modernizr (for Modernizr.touchevents)
 *  - Slate (for slate.Currency)
 */

// Requires slate for slate.Currency

slate.ProductDetailForm = (function($, Modernizr, slate) {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productZoomButton: '[data-zoom-button]',
    productGallery: '[data-product-gallery]',
    productGallerySlideshow: '[data-product-gallery-slideshow]',
    productGallerySlideLink: '[data-product-gallery-slide-link]',
    productGalleryThumbnails: '[data-product-gallery-thumbnails]',
    productGalleryThumbnailsSlide: '[data-product-gallery-thumbnails-slide]',    
    initialSlide: '[data-initial-slide]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    singleOptionSelector: '[data-single-option-selector]',
    variantOptionValueList: '[data-variant-option-value-list][data-option-position]',
    variantOptionValue: '[data-variant-option-value]',
    quantitySelect: '[data-product-quantity-select]'
  };


  var classes = {
    hide: 'hide',
    variantOptionValueActive: 'is-active',
    zoomReady: 'is-zoomable',
    zoomedIn: 'is-zoomed'
  };

  var $window   = $(window);

  /**
   * ProductDetailForm constructor
   *
   * @param { Object } config
   * @param { jQuery } config.$el - Main element, see snippets/product-detail-form.liquid
   * @param { jQuery } config.$container - Container to listen to scope events / element to listen to events on.  Defaults to config.$el
   * @param { Boolean } config.enableHistoryState - If set to "true", turns on URL updating when switching variants
   * @param { Function } config.onReady -  Called after the product form is initialized.
   */
  function ProductDetailForm(config) {

    this.settings = {};
    this.name = 'productDetailForm';
    this.namespace = '.'+this.name;

    this.events = {
      RESIZE: 'resize' + this.namespace,
      CLICK:  'click'  + this.namespace,
      READY:  'ready'  + this.namespace
    };
    
    var ready = false;
    var options = options || {};
    var defaults = {
      enableHistoryState: true
    };

    this.initialize = function() {
      if(ready) {
        return;
      }

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

      this.productSingleObject  = JSON.parse($(selectors.productJson, this.$container).html());

      slate.utils.chosenSelects(this.$container);

      var variantOptions = {
        $container: this.$container,
        enableHistoryState: this.settings.enableHistoryState,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new slate.Variants(variantOptions);

      // See slate.Variants
      this.$container.on('variantChange' + this.namespace, this.onVariantChange.bind(this));

      this.initGalleries();

      this.$container.on(this.events.CLICK, selectors.variantOptionValue, this.onVariantOptionValueClick.bind(this));

      var e = $.Event(this.events.READY);
      this.$el.trigger(e);

      ready = true;
    };

    return this;
  }

  ProductDetailForm.prototype = $.extend({}, ProductDetailForm.prototype, {

    initGalleries: function() {
      var self = this;
      var $galleries = $(selectors.productGallery, this.$container);

      // Lifecycle methods for handling slideshow changes + hoverzoom initialization
      function initHoverZoom($zoomTarget) {
        var opts = {
          url: $zoomTarget.find(selectors.productGallerySlideLink).attr('href'),
          on: 'click',
          touch: false,
          escToClose: true,
          magnify: 0.8,
          duration: 300,
          callback: function() {
            $zoomTarget.addClass(classes.zoomReady);
          },
          onZoomIn: function() {
            $zoomTarget.addClass(classes.zoomedIn);
          },
          onZoomOut: function() {
            $zoomTarget.removeClass(classes.zoomedIn);
          }
        };

        $zoomTarget.zoom(opts);

        $zoomTarget.find(selectors.productZoomButton).on('click', function(e){
          $zoomTarget.trigger('click');
          return false;
        });

      }

      function destroyHoverZoom($zoomTarget) {
        $zoomTarget.trigger('zoom.destroy');
        $zoomTarget.find(selectors.productZoomButton).off('click');
      }

      function onSlideshowSlickBeforeChange(e, slick) {
        var $zoomTarget = $(slick.$slides[ slick.currentSlide ]);
          destroyHoverZoom($zoomTarget);
        }

      function onSlideshowSlickAfterChange(e, slick) {
        var $zoomTarget = $(slick.$slides[ slick.currentSlide ]);
        if(self.settings.enableZoom) {
          initHoverZoom($zoomTarget);
        }
      }

      function onSlideshowSlickInit(e, slick) {
        var $zoomTarget = $(slick.$slides[ slick.currentSlide ]);
        initHoverZoom($zoomTarget);
      }

      $galleries.each(function() {
        var $slideshow  = $(this).find(selectors.productGallerySlideshow);
        var $thumbnails = $(this).find(selectors.productGalleryThumbnails);

        // Look for element with the initialSlide selector.
        var initialSlide = $(this).find(selectors.initialSlide).length ? $(this).find(selectors.initialSlide).index() : 0;

        var thumbnailsSlidesToShow;
        var thumbnailsSlidesCount = $thumbnails.children().length;

        // Slick has trouble when slideToShow == slideCount
        if (thumbnailsSlidesCount < 4) {
          thumbnailsSlidesToShow = Math.max(thumbnailsSlidesCount - 1, 1);
        } else {
          thumbnailsSlidesToShow = thumbnailsSlidesCount == 4 ? 3 : 4;
        }        

        $slideshow.on({
          init: onSlideshowSlickInit,
          beforeChange: onSlideshowSlickBeforeChange,
          afterChange: onSlideshowSlickAfterChange
        });

        $slideshow.slick({
          speed: 600,
          dots: false,
          swipe: Modernizr.touchevents,
          arrows: !Modernizr.touchevents,
          asNavFor: '#' + $thumbnails.attr('id'),
          prevArrow: '<div class="slick-arrow slick-arrow--prev"><span class="arrow arrow--left"><span class="arrow__icon"></span></span></div>',
          nextArrow: '<div class="slick-arrow slick-arrow--next"><span class="arrow arrow--right"><span class="arrow__icon"></span></span></div>',
          initialSlide: initialSlide,
          accessibility: false,
          draggable: true
        });

        $thumbnails.on('click', selectors.productGalleryThumbnailsSlide, function() {
          $slideshow.slick('slickGoTo', $(this).data('slick-index'));
        });

        $thumbnails.slick({
          speed: 600,
          slidesToShow: thumbnailsSlidesToShow,
          slidestoScroll: 1,
          arrows: false,
          asNavFor: '#' + $slideshow.attr('id'),
          initialSlide: initialSlide,
          accessibility: false,
          draggable: false
        });        
      });

      // Because slick can get weird on initialization, make sure we call `refresh` on any visible galleries
      $galleries.not('.hide').each(function() {
        var $variantGallery = $(this);
        $variantGallery.find(selectors.productGallerySlideshow).slick('getSlick').refresh();
        $variantGallery.find(selectors.productGalleryThumbnails).slick('getSlick').refresh();
      });
    },

    /**
     * Slick sliders are annoying and sometimes need an ass kicking
     *
     */
    resizeGalleries: function() {
      $('.slick-slider', this.$container).resize();
    },

    onVariantChange: function(evt) {
      var variant = evt.variant;

      this.updateProductPrices(variant);
      this.updateAddToCartState(variant);
      this.updateQuantityDropdown(variant);
      this.updateVariantOptionValues(variant);
      this.updateGalleries(variant);

      $(selectors.singleOptionSelector, this.$container).trigger('chosen:updated');
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {Object} variant - Shopify variant object
     */
    updateAddToCartState: function(variant) {

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
    },

    /**
     * Updates the disabled property of the quantity select based on the availability of the selected variant
     *
     * @param {Object} variant - Shopify variant object
     */
    updateQuantityDropdown: function(variant) {

      var $select = $(selectors.quantitySelect, this.$container);

      // Close the dropdown while we make changes to it
      $select.trigger('chosen:close');

      if(variant && variant.available) {
        $select.prop('disabled', false);
      }
      else {
        $select.prop('disabled', true);
      }

      $select.trigger('chosen:updated');
      
    },    

    /**
     * Updates the DOM with specified prices
     *
     * @param {Object} variant - Shopify variant object
     */
    updateProductPrices: function(variant) {
      var $productPrice = $(selectors.productPrice, this.$container);
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls   = $comparePrice.add( $(selectors.comparePriceText, this.$container) );

      if(variant) {
        $productPrice.html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

        if (variant.compare_at_price > variant.price) {
          $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
          $compareEls.removeClass(classes.hide);
        } else {
          $comparePrice.html('');
          $compareEls.addClass(classes.hide);
        }
      }
    },

    /**
     * Updates the DOM state of the elements matching the variantOption Value selector based on the currently selected variant
     *
     * @param {Object} variant - Shopify variant object
     */
    updateVariantOptionValues: function(variant) {
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
    },

    /**
     * Look for a gallery matching one of the selected variant's options and switch to that gallery
     * If a matching gallery doesn't exist, look for the variant's featured image in the main gallery and switch to that
     *
     * @param {Object} variant - Shopify variant object
     */
    updateGalleries: function(variant) {

      var $galleries = $(selectors.productGallery, this.$container);

      function getVariantGalleryForOption(option) {
        return $galleries.filter(function() {
          return $(this).data('variant-gallery') == option;
        });
      }

      if (variant) {
        if ($galleries.length > 1) {
          for (var i = 3; i >= 1; i--) {
            var $variantGallery = getVariantGalleryForOption(variant['option' + i]);

            if ($variantGallery.length && $variantGallery.hasClass(classes.hide)) {
              $galleries.not($variantGallery).addClass(classes.hide);
              $variantGallery.removeClass(classes.hide);
              // Slick needs to make a lot of measurements in order to work, calling `refresh` forces this to happen
              $variantGallery.find(selectors.productGallerySlideshow).slick('getSlick').refresh();
              $variantGallery.find(selectors.productGalleryThumbnails).slick('getSlick').refresh();
            }
          }
        }
        else {
          // $galleries is just a single gallery
          // Slide to featured image for selected variant but only if we're not already on it.
          // Have to check this way because slick clones slides so even if we're currently on it, there can be a cloned slide that also has the correct data-image attribute
          if (variant.featured_image && $galleries.find('.slick-current').data('image') != variant.featured_image.id) {
            var $imageSlide = $galleries.find('[data-image="'+variant.featured_image.id+'"]').first();

            if ($imageSlide.length) {
              $galleries.find(selectors.productGallerySlideshow).slick('slickGoTo', $imageSlide.data('slick-index'));
            }
          }
        }
      }
      else {
        // No variant - Don't do anything?
      }
    },

    /**
     * Handle variant option value click event.
     * Update the associated select tag and update the UI for this value
     *
     * @param {event} evt
     */
    onVariantOptionValueClick: function(e) {

      var $option = $(e.currentTarget);

      if ($option.hasClass(classes.variantOptionValueActive)) {
        return;
      }

      var value     = $option.data('variant-option-value');
      var position  = $option.parents(selectors.variantOptionValueList).data('option-position');
      var $selector = $(selectors.singleOptionSelector, this.$container).filter('[data-index="option'+position+'"]');

      $selector.val(value);
      $selector.trigger('change');

      $option.addClass(classes.variantOptionValueActive);
      $option.siblings().removeClass( classes.variantOptionValueActive );      

    }
  });

  return ProductDetailForm;

})(jQuery, Modernizr, slate);
