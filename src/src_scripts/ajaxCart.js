import ShopifyAPI from './shopifyAPI';
import Utils from './utils';
import Currency from './currency';
import Images from './images';
import Toast from './uiComponents/toast';

const $window = $(window);
const $body = $('body');

const selectors = {
  container: '[data-ajax-cart-container]',
  template: 'script[data-ajax-cart-template]',
  trigger: '[data-ajax-cart-trigger]',
  close: '[data-ajax-cart-close]',
  addForm: 'form[action^="/cart/add"]',
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]',
  header: '[data-ajax-cart-header]',
  body: '[data-ajax-cart-body]',
  footer: '[data-ajax-cart-footer]',
  item: '[data-ajax-item][data-id][data-qty]',
  itemRemove: '[data-ajax-cart-item-remove]',
  cartBadge: '[data-cart-badge]',

  // Verify Stuff
  verifyContainer: '[data-cart-verify-modal-container]',
  verifyTemplate: '[data-cart-verify-modal-template]',
  verifyCheckoutLink: '[data-verify-checkout-link]',

  // Alert
  toast: '[data-ajax-cart-toast]'
};

const classes = {
  bodyCartOpen: 'ajax-cart-open',
  backdrop: 'ajax-cart-backdrop',
  backdropCursor: 'ajax-cart-backdrop-cursor',
  backdropVisible: 'is-visible',
  backdropCursorVisible: 'is-visible',
  cartOpen: 'is-open',
  cartBadgeHasItems: 'has-items',
  cartRequestInProgress: 'request-in-progress'
};

export default class AJAXCart {
  constructor() {
    this.name = 'ajaxCart';
    this.namespace = `.${this.name}`;
    this.events = {
      RENDER:  'render'  + this.namespace,
      DESTROY: 'destroy' + this.namespace,
      SCROLL:  'scroll'  + this.namespace,
      UPDATE:  'update'  + this.namespace, //  Use this as a global event to hook into whenever the cart changes
      NEEDS_UPDATE: 'needsUpdate' + this.namespace
    };   

    var initialized = false;
    var settings = {
      disableAjaxCart: false,
      backdrop: true
    };

    this.$el                = $(selectors.container);
    this.$backdrop          = null;
    this.$backdropCursor    = null;
    this.stateIsOpen        = null;
    this.transitionEndEvent = Utils.whichTransitionEnd();
    this.requestInProgress  = false;
    this.cartIsVerified     = false;

   /**
    * Initialize the cart
    *
    * @param {object} options - see `settings` variable above
    */
    this.init = function(options) {
      if(initialized) return;

      this.settings = $.extend(settings, options);

      if(!$(selectors.template).length){
        console.warn('['+this.name+'] - Handlebars template required to initialize');
        return;
      }

      this.$container      = $(selectors.container);
      this.$cartBadge      = $(selectors.cartBadge);
      this.$cartBadgeCount = $(selectors.cartBadgeCount);
      this.$verifyContainer = $(selectors.verifyContainer);  
      this.$toast = new Toast($(selectors.toast));     

      // Compile this once during initialization
      this.template = Handlebars.compile($(selectors.template).html());
      this.verifyTemplate = Handlebars.compile($(selectors.verifyTemplate).html());

      // Add the AJAX part
      if(!this.settings.disableAjaxCart) {
        this._formOverride();
      }

      // Add event handlers here
      $body.on('click', selectors.trigger, this.onTriggerClick.bind(this));
      $body.on('click', selectors.close, this.onCloseClick.bind(this));
      $body.on('click', selectors.itemRemove, this.onItemRemoveClick.bind(this));
      this.$container.on('submit', 'form', this.onFormSubmit.bind(this));
      this.$verifyContainer.on('click', selectors.verifyCheckoutLink, this.onVerifyCheckoutLinkClick.bind(this));
      $window.on(this.events.RENDER, this.onCartRender.bind(this));
      $window.on(this.events.DESTROY, this.onCartDestroy.bind(this));
      $window.on(this.events.NEEDS_UPDATE, this.onNeedsUpdate.bind(this));

      // Get the cart data when we initialize the instance
      ShopifyAPI.getCart().then(this.buildCart.bind(this));

      initialized = true;

      return initialized;
    };

    return this;
  }

 /**
  * Call this function to AJAX-ify any add to cart forms on the page
  */
  _formOverride() {
    var _this = this;

    $body.on('submit', selectors.addForm, function(e) {
      e.preventDefault();

      if(this.requestInProgress) return;

      var $submitButton = $(e.target).find(selectors.addToCart);
      var $submitButtonText = $submitButton.find(selectors.addToCartText);

      // Update the submit button text and disable the button so the user knows the form is being submitted
      $submitButton.prop('disabled', true);
      $submitButtonText.html(theme.strings.adding);

      this._onRequestStart();

      ShopifyAPI.addItemFromForm( $(e.target) )
        .then(function(data) {
          _this._onRequestFinish();
          // Reset button state
          $submitButton.prop('disabled', false);
          $submitButtonText.html(theme.strings.addToCart);
          _this.onItemAddSuccess.call(_this, data);
        })
        .fail(function(data) {
          _this._onRequestFinish();
          // Reset button state
          $submitButton.prop('disabled', false);
          $submitButtonText.html(theme.strings.addToCart);
          _this.onItemAddFail.call(_this, data);
        });
    }.bind(this));
  }

 /**
  * Ensure we are working with a valid number
  *
  * @param {int|string} qty
  * @return {int} - Integer quantity.  Defaults to 1
  */
  _validateQty(qty) {
    return (parseFloat(qty) == parseInt(qty)) && !isNaN(qty) ? qty : 1;
  }

 /**
  * Ensure we are working with a valid number
  *
  * @param {element} el - cart item row or child element
  * @return {obj}
  */
  _getItemRowAttributes(el) {
    var $el = $(el);
    var $row = $el.is(selectors.item) ? $el : $el.parents(selectors.item);

    return {
      $row: $row,
      id:  $row.data('id'),
      line: ($row.index() + 1),
      qty: this._validateQty($row.data('qty'))
    };
  }

  _onRequestStart() {
    this.requestInProgress = true;
    this.$el.addClass(classes.cartRequestInProgress);
  }

  _onRequestFinish() {
    this.requestInProgress = false;
    this.$el.removeClass(classes.cartRequestInProgress);
  }      

  addBackdrop(callback) {

    var _this = this;
    var cb    = callback || $.noop;

    if(this.stateIsOpen) {
      this.$backdrop = $(document.createElement('div'));
      this.$backdropCursor = $(document.createElement('div'));

      this.$backdropCursor.addClass(classes.backdropCursor)
                          .appendTo(this.$backdrop);

      this.$backdrop.addClass(classes.backdrop)
                    .appendTo($body);

      this.$backdrop.one(this.transitionEndEvent, cb);
      this.$backdrop.one('click', this.close.bind(this));
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

    if(!this.stateIsOpen && this.$backdrop) {
      this.$backdrop.one(this.transitionEndEvent, function(){
        _this.$backdrop.off('mousemove mouseenter mouseleave');
        _this.$backdrop && _this.$backdrop.remove();
        _this.$backdrop = null;
        _this.$backdropCursor = null;
        cb();
      });

      setTimeout(function() {
        _this.$backdrop.removeClass(classes.backdropVisible);
      }, 10);
    }
    else {
      cb();
    }
  }

 /**
  * Callback when adding an item is successful
  *
  * @param {Object} cart - JSON representation of the cart.
  */
  onItemAddSuccess(cart){
    this.buildCart(cart);
    this.open();
  }

 /**
  * Callback when adding an item fails
  *
  * @param {Object} data
  * @param {string} data.message - error message
  */
  onItemAddFail(data){
    this.$toast.setContent('Requested item is unavailable');
    this.$toast.show();
  }

  /**
  * Callback for when the cart HTML is rendered to the page
  * Allows us to add event handlers for events that don't bubble
  */
  onCartRender(e) {
    // We only re-render the cart when something has changed.
    // If something changed, the user has to re-verify
    this.cartIsVerified = false;
  }

 /**
  * Callback for when the cart HTML is removed from the page
  * Allows us to do cleanup on any event handlers applied post-render
  */
  onCartDestroy(e) {
    // console.log('['+this.name+'] - onCartDestroy');
  }

  onNeedsUpdate(e) {
    ShopifyAPI.getCart().then(this.buildCart.bind(this));
  }

 /**
  * Builds the HTML for the ajax cart.
  * Modifies the JSON cart for consumption by our handlebars template
  *
  * @param {object} cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
  * @return ??
  */
  buildCart(cart) {

    // All AJAX Cart requests finish with rebuilding the cart
    // So this is a good place to add this code
    this._onRequestFinish();

    // Make adjustments to the cart object contents before we pass it off to the handlebars template
    cart.total_price = Currency.formatMoney(cart.total_price, theme.moneyFormat);
    cart.total_price = Currency.stripZeroCents(cart.total_price);
    cart.has_unavailable_items = false;

    cart.items.map(function(item){
      item.image    = Images.getSizedImageUrl(item.image, '250x');
      item.price    = Currency.formatMoney(item.price, theme.moneyFormat);
      item.price    = Currency.stripZeroCents(item.price);
      item.unavailable = !item.available;
      item.has_multiple = (item.quantity > 1);

      if(item.unavailable) {
        cart.has_unavailable_items = true;
      }

      // Adjust the item's variant options to add "name" and "value" properties
      if(item.hasOwnProperty('product')) {
        var product = item.product;
        for (var i = item.variant_options.length - 1; i >= 0; i--) {
          var name  = product.options[i];
          var value = item.variant_options[i];

          item.variant_options[i] = {
            name: name,
            value: value
          };

          // Don't show this info if it's the default variant that Shopify creates
          if(value == "Default Title") {
            delete item.variant_options[i];
          }
        }
        
        item.url = `/products/${product.handle}`;
      }
      else {
        delete item.variant_options; // skip it and use the variant title instead
      }

      return item;
    });

    /**
     *  You can also use this as an intermediate step to constructing the AJAX cart DOM
     *  by returning an HTML string and using another function to do the DOM updating
     *
     *  return this.template(cart)
     *
     *  The code below isn't the most elegant way to update the cart but it works...
     */        

    $window.trigger(this.events.DESTROY);
    this.$container.empty().append( this.template(cart) );
    this.$verifyContainer.empty().append( this.verifyTemplate(cart) );
    $window.trigger(this.events.RENDER);
    $window.trigger(this.events.UPDATE);

    this.updateCartCount(cart);
  }

 /**
  * Update the cart badge + count here
  *
  * @param {Object} cart - JSON representation of the cart.
  */
  updateCartCount(cart) {

    if(cart.item_count) {
      this.$cartBadge.text(cart.item_count + ' ' + (cart.item_count == 1 ? 'Item' : 'Items'));
      this.$cartBadge.addClass(classes.cartBadgeHasItems);
    }
    else {
      this.$cartBadge.text('');
      this.$cartBadge.removeClass(classes.cartBadgeHasItems);
    }
  }

 /**
  * Called when someone submits the ajax cart form to go to checkout
  *
  * @param {event} e - Submit Event
  */
  onFormSubmit(e) {
    if(!this.cartIsVerified && this.$verifyContainer.find('.modal').length) {
      this.$verifyContainer.find('.modal').modal('show');
      return false;
    }
  }

  onVerifyCheckoutLinkClick(e) {
    this.cartIsVerified = true;
    $(e.currentTarget).attr('disabled', true);
    $(e.currentTarget).text('Redirecting to Checkout..');
  }

 /**
  * Remove the item from the cart.  Extract this into a separate method if there becomes more ways to delete an item
  *
  * @param {event} e - Click event
  */
  onItemRemoveClick(e) {
    e.preventDefault();

    if(this.requestInProgress) return;

    var attrs = this._getItemRowAttributes(e.target);

    this._onRequestStart();
    ShopifyAPI.changeLineItemQuantity(attrs.line, 0).then(ShopifyAPI.getCart).then(this.buildCart.bind(this));
  }

 /**
  * Click the 'ajaxCart - trigger' selector
  *
  * @param {event} e - Click event
  */
  onTriggerClick(e) {
    e.preventDefault();
    this.toggleVisibility();
  }

 /**
  * Click the 'ajaxCart - close' selector
  *
  * @param {event} e - Click event
  */
  onCloseClick(e) {
    e.preventDefault();

    // Do any cleanup before closing the cart
    this.close();
  }

 /**
  * Opens / closes the cart depending on state
  *
  */
  toggleVisibility() {
    return this.stateIsOpen ? this.close() : this.open();
  }

 /**
  * Check the open / closed state of the cart
  *
  * @return {bool}
  */
  isOpen() {
    return this.stateIsOpen;
  }

 /**
  * Returns true is the cart is closed.
  *
  * @return {bool}
  */
  isClosed() {
    return !this.stateIsOpen;
  }

 /**
  * STUB METHOD - Code for opening the cart
  */
  open() {
    if(this.stateIsOpen) return;
    this.stateIsOpen = true;

    if(this.settings.backdrop) {
      $body.addClass(classes.bodyCartOpen);
      this.addBackdrop();
    }

    this.$el.addClass(classes.cartOpen);
  }

 /**
  * STUB METHOD - Code for closing the cart
  */
  close() {
    if(!this.stateIsOpen) return;

    this.stateIsOpen = false;

    this.$el.removeClass(classes.cartOpen);
    this.$el.one(this.transitionEndEvent, () => {
      this.$el.scrollTop(0);
    });

    if(this.settings.backdrop) {
      this.removeBackdrop(function() {
        $body.removeClass(classes.bodyCartOpen);
      });          
    }

  }  
}