import CartAPI from './cartAPI';
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
      RENDER:  `render${this.namespace}`,
      DESTROY: `destroy${this.namespace}`,
      SCROLL:  `scroll${this.namespace}`,
      UPDATE:  `update${this.namespace}`, //  Use this as a global event to hook into whenever the cart changes
      NEEDS_UPDATE: `needsUpdate${this.namespace}`
    };

    let initialized = false;

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
    */
    this.init = function(options) {
      if (initialized) return;

      if (!$(selectors.template).length){
        console.warn('['+this.name+'] - Handlebars template required to initialize');
        return;
      }

      this.$cartBadge       = $(selectors.cartBadge);
      this.$cartBadgeCount  = $(selectors.cartBadgeCount);
      this.$verifyContainer = $(selectors.verifyContainer);  
      this.toast            = new Toast($(selectors.toast));

      // Compile this once during initialization
      this.template = Handlebars.compile($(selectors.template).html());
      this.verifyTemplate = Handlebars.compile($(selectors.verifyTemplate).html());

      // Add the AJAX part
      this._formOverride();

      // Add event handlers here
      $body.on('click', selectors.trigger, this.onTriggerClick.bind(this));
      $body.on('click', selectors.close, this.onCloseClick.bind(this));
      $body.on('click', selectors.itemRemove, this.onItemRemoveClick.bind(this));
      this.$el.on('submit', 'form', this.onFormSubmit.bind(this));
      this.$verifyContainer.on('click', selectors.verifyCheckoutLink, this.onVerifyCheckoutLinkClick.bind(this));
      $window.on(this.events.RENDER, this.onCartRender.bind(this));
      $window.on(this.events.DESTROY, this.onCartDestroy.bind(this));
      $window.on(this.events.NEEDS_UPDATE, this.onNeedsUpdate.bind(this));

      // Get the cart data when we initialize the instance
      CartAPI.getCart().then(cart => this.renderCart(cart));

      initialized = true;

      return initialized;
    };

    return this;
  }

 /**
  * Call this function to AJAX-ify any add to cart forms on the page
  */
  _formOverride() {
    $body.on('submit', selectors.addForm, (e) => {
      e.preventDefault();

      if (this.requestInProgress) return;

      const $submitButton = $(e.target).find(selectors.addToCart);
      const $submitButtonText = $submitButton.find(selectors.addToCartText);

      // Update the submit button text and disable the button so the user knows the form is being submitted
      $submitButton.prop('disabled', true);
      $submitButtonText.html(theme.strings.adding);

      this._onRequestStart();

      CartAPI.addItemFromForm($(e.target))
        .done(cart => {
          this.onItemAddSuccess(cart)
        })
        .fail(cart => {
          this.onItemAddFail(cart);
        })
        .always(() => {
          this._onRequestFinish();
          $submitButton.prop('disabled', false);
          $submitButtonText.html(theme.strings.addToCart);
        })
    });
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
    const $el = $(el);
    const $row = $el.is(selectors.item) ? $el : $el.parents(selectors.item);

    return {
      $row,
      key: $row.data('key'),
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
    const cb = callback || (() => {});

    if (this.stateIsOpen) {
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
        window.requestAnimationFrame(() => {
          this.$backdropCursor.css({
            'transform': `translate(${e.clientX}px, ${e.clientY}px)`
          });
        });
      });

      // debug this...
      setTimeout(() => {
        this.$backdrop.addClass(classes.backdropVisible);
      }, 20);
    }
    else {
      cb();
    }
  }

  removeBackdrop(callback) {
    const cb = callback || (() => {});

    if (!this.stateIsOpen && this.$backdrop) {
      this.$backdrop.one(this.transitionEndEvent, () => {
        this.$backdrop.off('mousemove mouseenter mouseleave');
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
        this.$backdropCursor = null;
        cb();
      });

      setTimeout(() => {
        this.$backdrop.removeClass(classes.backdropVisible);
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
    this.renderCart(cart);
    this.open();
  }

 /**
  * Callback when adding an item fails
  *
  * @param {Object} data
  */
  onItemAddFail(data){
    this.toast.setContent('Requested item is unavailable');
    this.toast.show();
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

 /**
  * Callback for window event signifying that the ajax cart needs to update
  * If the event has a property called "cart" we'll use that to render
  * Otherwise we'll hit the API and get a fresh copy
  */
  onNeedsUpdate(e) {
    if (e.cart) {
      this.renderCart(e.cart)
    }
    else {
      CartAPI.getCart().then(cart => {
        this.renderCart(cart)
      });
    }
  }

  renderCart(cart) {
    $window.trigger(this.events.DESTROY);

    this.$el.empty().append(this.template(cart));
    this.$verifyContainer.empty().append(this.verifyTemplate(cart));

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
    if (cart.item_count) {
      this.$cartBadge.text(`${cart.item_count} ${cart.item_count == 1 ? 'Item' : 'Items'}`);
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
    if (!this.cartIsVerified && this.$verifyContainer.find('.modal').length) {
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
  * Remove the item from the cart.
  *
  * @param {event} e - Click event
  */
  onItemRemoveClick(e) {
    e.preventDefault();

    if (this.requestInProgress) return;

    this._onRequestStart();

    CartAPI.changeLineItem({
      id: this._getItemRowAttributes(e.target).key,
      quantity: 0
    })
      .then(cart => {
        this.renderCart(cart)
      })
      .always(() => {
        this._onRequestFinish()
      })
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
  * Code for opening the cart
  */
  open() {
    if (this.stateIsOpen) return;

    this.stateIsOpen = true;

    $body.addClass(classes.bodyCartOpen);
    this.addBackdrop();
    
    this.$el.addClass(classes.cartOpen);
  }

 /**
  * Code for closing the cart
  */
  close() {
    if (!this.stateIsOpen) return;

    this.stateIsOpen = false;

    this.$el.removeClass(classes.cartOpen);
    this.$el.one(this.transitionEndEvent, () => {
      this.$el.scrollTop(0);
    });

    this.removeBackdrop(function() {
      $body.removeClass(classes.bodyCartOpen);
    });
  }
}
