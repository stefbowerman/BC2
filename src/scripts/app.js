(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Navigo=t()}(this,function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function t(){return!("undefined"==typeof window||!window.history||!window.history.pushState)}function n(e,n,o){this.root=null,this._routes=[],this._useHash=n,this._hash=void 0===o?"#":o,this._paused=!1,this._destroyed=!1,this._lastRouteResolved=null,this._notFoundHandler=null,this._defaultHandler=null,this._usePushState=!n&&t(),this._onLocationChange=this._onLocationChange.bind(this),this._genericHooks=null,this._historyAPIUpdateMethod="pushState",e?this.root=n?e.replace(/\/$/,"/"+this._hash):e.replace(/\/$/,""):n&&(this.root=this._cLoc().split(this._hash)[0].replace(/\/$/,"/"+this._hash)),this._listen(),this.updatePageLinks()}function o(e){return e instanceof RegExp?e:e.replace(/\/+$/,"").replace(/^\/+/,"^/")}function i(e){return e.replace(/\/$/,"").split("/").length}function s(e,t){return i(t)-i(e)}function r(e,t){return function(e){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]).map(function(t){var i=function(e){var t=[];return{regexp:e instanceof RegExp?e:new RegExp(e.replace(n.PARAMETER_REGEXP,function(e,o,i){return t.push(i),n.REPLACE_VARIABLE_REGEXP}).replace(n.WILDCARD_REGEXP,n.REPLACE_WILDCARD)+n.FOLLOWED_BY_SLASH_REGEXP,n.MATCH_REGEXP_FLAGS),paramNames:t}}(o(t.route)),s=i.regexp,r=i.paramNames,a=e.replace(/^\/+/,"/").match(s),h=function(e,t){return 0===t.length?null:e?e.slice(1,e.length).reduce(function(e,n,o){return null===e&&(e={}),e[t[o]]=decodeURIComponent(n),e},null):null}(a,r);return!!a&&{match:a,route:t,params:h}}).filter(function(e){return e})}(e,t)[0]||!1}function a(e,t){var n=t.map(function(t){return""===t.route||"*"===t.route?e:e.split(new RegExp(t.route+"($|/)"))[0]}),i=o(e);return n.length>1?n.reduce(function(e,t){return e.length>t.length&&(e=t),e},n[0]):1===n.length?n[0]:i}function h(e,n,o){var i,s=function(e){return e.split(/\?(.*)?$/)[0]};return void 0===o&&(o="#"),t()&&!n?s(e).split(o)[0]:(i=e.split(o)).length>1?s(i[1]):s(i[0])}function u(t,n,o){if(n&&"object"===(void 0===n?"undefined":e(n))){if(n.before)return void n.before(function(){(!(arguments.length>0&&void 0!==arguments[0])||arguments[0])&&(t(),n.after&&n.after(o))},o);if(n.after)return t(),void(n.after&&n.after(o))}t()}return n.prototype={helpers:{match:r,root:a,clean:o,getOnlyURL:h},navigate:function(e,t){var n;return e=e||"",this._usePushState?(n=(n=(t?"":this._getRoot()+"/")+e.replace(/^\/+/,"/")).replace(/([^:])(\/{2,})/g,"$1/"),history[this._historyAPIUpdateMethod]({},"",n),this.resolve()):"undefined"!=typeof window&&(e=e.replace(new RegExp("^"+this._hash),""),window.location.href=window.location.href.replace(/#$/,"").replace(new RegExp(this._hash+".*$"),"")+this._hash+e),this},on:function(){for(var t=this,n=arguments.length,o=Array(n),i=0;i<n;i++)o[i]=arguments[i];if("function"==typeof o[0])this._defaultHandler={handler:o[0],hooks:o[1]};else if(o.length>=2)if("/"===o[0]){var r=o[1];"object"===e(o[1])&&(r=o[1].uses),this._defaultHandler={handler:r,hooks:o[2]}}else this._add(o[0],o[1],o[2]);else"object"===e(o[0])&&Object.keys(o[0]).sort(s).forEach(function(e){t.on(e,o[0][e])});return this},off:function(e){return null!==this._defaultHandler&&e===this._defaultHandler.handler?this._defaultHandler=null:null!==this._notFoundHandler&&e===this._notFoundHandler.handler&&(this._notFoundHandler=null),this._routes=this._routes.reduce(function(t,n){return n.handler!==e&&t.push(n),t},[]),this},notFound:function(e,t){return this._notFoundHandler={handler:e,hooks:t},this},resolve:function(e){var n,o,i=this,s=(e||this._cLoc()).replace(this._getRoot(),"");this._useHash&&(s=s.replace(new RegExp("^/"+this._hash),"/"));var a=function(e){return e.split(/\?(.*)?$/).slice(1).join("")}(e||this._cLoc()),l=h(s,this._useHash,this._hash);return!this._paused&&(this._lastRouteResolved&&l===this._lastRouteResolved.url&&a===this._lastRouteResolved.query?(this._lastRouteResolved.hooks&&this._lastRouteResolved.hooks.already&&this._lastRouteResolved.hooks.already(this._lastRouteResolved.params),!1):(o=r(l,this._routes))?(this._callLeave(),this._lastRouteResolved={url:l,query:a,hooks:o.route.hooks,params:o.params,name:o.route.name},n=o.route.handler,u(function(){u(function(){o.route.route instanceof RegExp?n.apply(void 0,o.match.slice(1,o.match.length)):n(o.params,a)},o.route.hooks,o.params,i._genericHooks)},this._genericHooks,o.params),o):this._defaultHandler&&(""===l||"/"===l||l===this._hash||function(e,n,o){if(t()&&!n)return!1;if(!e.match(o))return!1;var i=e.split(o);return i.length<2||""===i[1]}(l,this._useHash,this._hash))?(u(function(){u(function(){i._callLeave(),i._lastRouteResolved={url:l,query:a,hooks:i._defaultHandler.hooks},i._defaultHandler.handler(a)},i._defaultHandler.hooks)},this._genericHooks),!0):(this._notFoundHandler&&u(function(){u(function(){i._callLeave(),i._lastRouteResolved={url:l,query:a,hooks:i._notFoundHandler.hooks},i._notFoundHandler.handler(a)},i._notFoundHandler.hooks)},this._genericHooks),!1))},destroy:function(){this._routes=[],this._destroyed=!0,this._lastRouteResolved=null,this._genericHooks=null,clearTimeout(this._listeningInterval),"undefined"!=typeof window&&(window.removeEventListener("popstate",this._onLocationChange),window.removeEventListener("hashchange",this._onLocationChange))},updatePageLinks:function(){var e=this;"undefined"!=typeof document&&this._findLinks().forEach(function(t){t.hasListenerAttached||(t.addEventListener("click",function(n){if((n.ctrlKey||n.metaKey)&&"a"==n.target.tagName.toLowerCase())return!1;var o=e.getLinkPath(t);e._destroyed||(n.preventDefault(),e.navigate(o.replace(/\/+$/,"").replace(/^\/+/,"/")))}),t.hasListenerAttached=!0)})},generate:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=this._routes.reduce(function(n,o){var i;if(o.name===e)for(i in n=o.route,t)n=n.toString().replace(":"+i,t[i]);return n},"");return this._useHash?this._hash+n:n},link:function(e){return this._getRoot()+e},pause:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this._paused=e,this._historyAPIUpdateMethod=e?"replaceState":"pushState"},resume:function(){this.pause(!1)},historyAPIUpdateMethod:function(e){return void 0===e?this._historyAPIUpdateMethod:(this._historyAPIUpdateMethod=e,e)},disableIfAPINotAvailable:function(){t()||this.destroy()},lastRouteResolved:function(){return this._lastRouteResolved},getLinkPath:function(e){return e.getAttribute("href")},hooks:function(e){this._genericHooks=e},_add:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return"string"==typeof t&&(t=encodeURI(t)),this._routes.push("object"===(void 0===n?"undefined":e(n))?{route:t,handler:n.uses,name:n.as,hooks:o||n.hooks}:{route:t,handler:n,hooks:o}),this._add},_getRoot:function(){return null!==this.root?this.root:(this.root=a(this._cLoc().split("?")[0],this._routes),this.root)},_listen:function(){var e=this;if(this._usePushState)window.addEventListener("popstate",this._onLocationChange);else if("undefined"!=typeof window&&"onhashchange"in window)window.addEventListener("hashchange",this._onLocationChange);else{var t=this._cLoc(),n=void 0,o=void 0;(o=function(){n=e._cLoc(),t!==n&&(t=n,e.resolve()),e._listeningInterval=setTimeout(o,200)})()}},_cLoc:function(){return"undefined"!=typeof window?void 0!==window.__NAVIGO_WINDOW_LOCATION_MOCK__?window.__NAVIGO_WINDOW_LOCATION_MOCK__:o(window.location.href):""},_findLinks:function(){return[].slice.call(document.querySelectorAll("[data-navigo]"))},_onLocationChange:function(){this.resolve()},_callLeave:function(){var e=this._lastRouteResolved;e&&e.hooks&&e.hooks.leave&&e.hooks.leave(e.params)}},n.PARAMETER_REGEXP=/([:*])(\w+)/g,n.WILDCARD_REGEXP=/\*/g,n.REPLACE_VARIABLE_REGEXP="([^/]+)",n.REPLACE_WILDCARD="(?:.*)",n.FOLLOWED_BY_SLASH_REGEXP="(?:/$|$)",n.MATCH_REGEXP_FLAGS="",n});


},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shopifyAPI = require('./shopifyAPI');

var _shopifyAPI2 = _interopRequireDefault(_shopifyAPI);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _currency = require('./currency');

var _currency2 = _interopRequireDefault(_currency);

var _images = require('./images');

var _images2 = _interopRequireDefault(_images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $window = $(window);
var $body = $('body');

var selectors = {
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
  itemIncrement: '[data-ajax-cart-item-increment]',
  itemDecrement: '[data-ajax-cart-item-decrement]',
  cartBadge: '[data-cart-badge]',
  cartBadgeCount: '[data-cart-badge-count]'
};

var classes = {
  bodyCartOpen: 'ajax-cart-open',
  backdrop: 'ajax-cart-backdrop',
  backdropVisible: 'is-visible',
  cartOpen: 'is-open',
  cartBadgeHasItems: 'has-items',
  cartRequestInProgress: 'request-in-progress'
};

var AJAXCart = function () {
  function AJAXCart() {
    _classCallCheck(this, AJAXCart);

    this.name = 'ajaxCart';
    this.namespace = '.' + this.name;
    this.events = {
      RENDER: 'render' + this.namespace,
      DESTROY: 'destroy' + this.namespace,
      SCROLL: 'scroll' + this.namespace,
      UPDATE: 'update' + this.namespace //  Use this as a global event to hook into whenever the cart changes
    };

    var initialized = false;
    var settings = {
      disableAjaxCart: false,
      backdrop: true
    };

    this.$el = $(selectors.container);
    this.$backdrop = null;
    this.stateIsOpen = null;
    this.transitionEndEvent = _utils2.default.whichTransitionEnd();
    this.requestInProgress = false;

    /**
     * Initialize the cart
     *
     * @param {object} options - see `settings` variable above
     */
    this.init = function (options) {
      if (initialized) return;

      this.settings = $.extend(settings, options);

      if (!$(selectors.template).length) {
        console.warn('[' + this.name + '] - Handlebars template required to initialize');
        return;
      }

      this.$container = $(selectors.container);
      this.$cartBadge = $(selectors.cartBadge);
      this.$cartBadgeCount = $(selectors.cartBadgeCount);

      // Compile this once during initialization
      this.template = Handlebars.compile($(selectors.template).html());

      // Add the AJAX part
      if (!this.settings.disableAjaxCart) {
        this._formOverride();
      }

      // Add event handlers here
      $body.on('click', selectors.trigger, this.onTriggerClick.bind(this));
      $body.on('click', selectors.close, this.onCloseClick.bind(this));
      $body.on('click', selectors.itemRemove, this.onItemRemoveClick.bind(this));
      $body.on('click', selectors.itemIncrement, this.onItemIncrementClick.bind(this));
      $body.on('click', selectors.itemDecrement, this.onItemDecrementClick.bind(this));
      $window.on(this.events.RENDER, this.onCartRender.bind(this));
      $window.on(this.events.DESTROY, this.onCartDestroy.bind(this));

      // Get the cart data when we initialize the instance
      _shopifyAPI2.default.getCart().then(this.buildCart.bind(this));

      initialized = true;

      return initialized;
    };

    return this;
  }

  /**
   * Call this function to AJAX-ify any add to cart forms on the page
   */


  AJAXCart.prototype._formOverride = function _formOverride() {
    var _this = this;

    $body.on('submit', selectors.addForm, function (e) {
      e.preventDefault();

      if (this.requestInProgress) return;

      var $submitButton = $(e.target).find(selectors.addToCart);
      var $submitButtonText = $submitButton.find(selectors.addToCartText);

      // Update the submit button text and disable the button so the user knows the form is being submitted
      $submitButton.prop('disabled', true);
      $submitButtonText.html(theme.strings.adding);

      this._onRequestStart();

      _shopifyAPI2.default.addItemFromForm($(e.target)).then(function (data) {
        _this._onRequestFinish();
        // Reset button state
        $submitButton.prop('disabled', false);
        $submitButtonText.html(theme.strings.addToCart);
        _this.onItemAddSuccess.call(_this, data);
      }).fail(function (data) {
        _this._onRequestFinish();
        // Reset button state
        $submitButton.prop('disabled', false);
        $submitButtonText.html(theme.strings.addToCart);
        _this.onItemAddFail.call(_this, data);
      });
    }.bind(this));
  };

  /**
   * Ensure we are working with a valid number
   *
   * @param {int|string} qty
   * @return {int} - Integer quantity.  Defaults to 1
   */


  AJAXCart.prototype._validateQty = function _validateQty(qty) {
    return parseFloat(qty) == parseInt(qty) && !isNaN(qty) ? qty : 1;
  };

  /**
   * Ensure we are working with a valid number
   *
   * @param {element} el - cart item row or child element
   * @return {obj}
   */


  AJAXCart.prototype._getItemRowAttributes = function _getItemRowAttributes(el) {
    var $el = $(el);
    var $row = $el.is(selectors.item) ? $el : $el.parents(selectors.item);

    return {
      $row: $row,
      id: $row.data('id'),
      line: $row.index() + 1,
      qty: this._validateQty($row.data('qty'))
    };
  };

  AJAXCart.prototype._onRequestStart = function _onRequestStart() {
    this.requestInProgress = true;
    this.$el.addClass(classes.cartRequestInProgress);
  };

  AJAXCart.prototype._onRequestFinish = function _onRequestFinish() {
    this.requestInProgress = false;
    this.$el.removeClass(classes.cartRequestInProgress);
  };

  AJAXCart.prototype.addBackdrop = function addBackdrop(callback) {

    var _this = this;
    var cb = callback || $.noop;

    if (this.stateIsOpen) {
      this.$backdrop = $(document.createElement('div'));

      this.$backdrop.addClass(classes.backdrop).appendTo($body);

      this.$backdrop.one(this.transitionEndEvent, cb);
      this.$backdrop.one('click', this.close.bind(this));

      // debug this...
      setTimeout(function () {
        _this.$backdrop.addClass(classes.backdropVisible);
      }, 10);
    } else {
      cb();
    }
  };

  AJAXCart.prototype.removeBackdrop = function removeBackdrop(callback) {

    var _this = this;
    var cb = callback || $.noop;

    if (!this.stateIsOpen && this.$backdrop) {
      this.$backdrop.one(this.transitionEndEvent, function () {
        _this.$backdrop && _this.$backdrop.remove();
        _this.$backdrop = null;
        cb();
      });

      setTimeout(function () {
        _this.$backdrop.removeClass(classes.backdropVisible);
      }, 10);
    } else {
      cb();
    }
  };

  /**
   * Callback when adding an item is successful
   *
   * @param {Object} cart - JSON representation of the cart.
   */


  AJAXCart.prototype.onItemAddSuccess = function onItemAddSuccess(cart) {
    this.buildCart(cart);
    this.open();
  };

  /**
   * STUB - Callback when adding an item fails
    * @param {Object} data
   * @param {string} data.message - error message
   */


  AJAXCart.prototype.onItemAddFail = function onItemAddFail(data) {
    console.log('[' + this.name + '] - onItemAddFail');
    console.warn('[' + this.name + '] - ' + data.message);
  };

  /**
  * Callback for when the cart HTML is rendered to the page
  * Allows us to add event handlers for events that don't bubble
  */


  AJAXCart.prototype.onCartRender = function onCartRender(e) {}
  // console.log('['+this.name+'] - onCartRender');


  /**
   * Callback for when the cart HTML is removed from the page
   * Allows us to do cleanup on any event handlers applied post-render
   */
  ;

  AJAXCart.prototype.onCartDestroy = function onCartDestroy(e) {}
  // console.log('['+this.name+'] - onCartDestroy');


  /**
   * Builds the HTML for the ajax cart.
   * Modifies the JSON cart for consumption by our handlebars template
   *
   * @param {object} cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
   * @return ??
   */
  ;

  AJAXCart.prototype.buildCart = function buildCart(cart) {

    // All AJAX Cart requests finish with rebuilding the cart
    // So this is a good place to add this code
    this._onRequestFinish();

    // Make adjustments to the cart object contents before we pass it off to the handlebars template
    cart.total_price = _currency2.default.formatMoney(cart.total_price, theme.moneyFormat);
    // cart.total_price = Currency.stripZeroCents(cart.total_price);

    cart.items.map(function (item) {
      item.image = _images2.default.getSizedImageUrl(item.image, '200x');
      item.price = _currency2.default.formatMoney(item.price, theme.moneyFormat);
      // item.price = Currency.stripZeroCents(item.price);

      // Adjust the item's variant options to add "name" and "value" properties
      if (item.hasOwnProperty('product')) {
        var product = item.product;
        for (var i = item.variant_options.length - 1; i >= 0; i--) {
          var name = product.options[i];
          var value = item.variant_options[i];

          item.variant_options[i] = {
            name: name,
            value: value
          };

          // Don't show this info if it's the default variant that Shopify creates
          if (value == "Default Title") {
            delete item.variant_options[i];
          }
        }
      } else {
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
    this.$container.empty().append(this.template(cart));
    $window.trigger(this.events.RENDER);
    $window.trigger(this.events.UPDATE);

    this.updateCartCount(cart);
  };

  /**
   * Update the cart badge + count here
   *
   * @param {Object} cart - JSON representation of the cart.
   */


  AJAXCart.prototype.updateCartCount = function updateCartCount(cart) {

    this.$cartBadgeCount.html(cart.item_count);

    if (cart.item_count) {
      this.$cartBadge.addClass(classes.cartBadgeHasItems);
    } else {
      this.$cartBadge.removeClass(classes.cartBadgeHasItems);
    }
  };

  /**
   * Remove the item from the cart.  Extract this into a separate method if there becomes more ways to delete an item
   *
   * @param {event} e - Click event
   */


  AJAXCart.prototype.onItemRemoveClick = function onItemRemoveClick(e) {
    e.preventDefault();

    if (this.requestInProgress) return;

    var attrs = this._getItemRowAttributes(e.target);

    this._onRequestStart();
    _shopifyAPI2.default.changeLineItemQuantity(attrs.line, 0).then(_shopifyAPI2.default.getCart).then(this.buildCart.bind(this));
  };

  /**
   * Increase the quantity of an item by 1
   *
   * @param {event} e - Click event
   */


  AJAXCart.prototype.onItemIncrementClick = function onItemIncrementClick(e) {
    e.preventDefault();

    if (this.requestInProgress) return;

    var attrs = this._getItemRowAttributes(e.target);

    this._onRequestStart();
    _shopifyAPI2.default.changeLineItemQuantity(attrs.line, attrs.qty + 1).then(_shopifyAPI2.default.getCart).then(this.buildCart.bind(this));
  };

  /**
   * Decrease the quantity of an item by 1
   *
   * @param {event} e - Click event
   */


  AJAXCart.prototype.onItemDecrementClick = function onItemDecrementClick(e) {
    e.preventDefault();

    if (this.requestInProgress) return;

    var attrs = this._getItemRowAttributes(e.target);
    var newQty = attrs.qty < 1 ? 0 : attrs.qty - 1;

    this._onRequestStart();
    _shopifyAPI2.default.changeLineItemQuantity(attrs.line, newQty).then(_shopifyAPI2.default.getCart).then(this.buildCart.bind(this));
  };

  /**
   * Click the 'ajaxCart - trigger' selector
   *
   * @param {event} e - Click event
   */


  AJAXCart.prototype.onTriggerClick = function onTriggerClick(e) {
    e.preventDefault();
    this.toggleVisibility();
  };

  /**
   * Click the 'ajaxCart - close' selector
   *
   * @param {event} e - Click event
   */


  AJAXCart.prototype.onCloseClick = function onCloseClick(e) {
    e.preventDefault();

    // Do any cleanup before closing the cart
    this.close();
  };

  /**
   * Opens / closes the cart depending on state
   *
   */


  AJAXCart.prototype.toggleVisibility = function toggleVisibility() {
    return this.stateIsOpen ? this.close() : this.open();
  };

  /**
   * Check the open / closed state of the cart
   *
   * @return {bool}
   */


  AJAXCart.prototype.isOpen = function isOpen() {
    return this.stateIsOpen;
  };

  /**
   * Returns true is the cart is closed.
   *
   * @return {bool}
   */


  AJAXCart.prototype.isClosed = function isClosed() {
    return !this.stateIsOpen;
  };

  /**
   * STUB METHOD - Code for opening the cart
   */


  AJAXCart.prototype.open = function open() {
    if (this.stateIsOpen) return;
    this.stateIsOpen = true;

    if (this.settings.backdrop) {
      $body.addClass(classes.bodyCartOpen);
      this.addBackdrop();
    }

    this.$el.addClass(classes.cartOpen);
  };

  /**
   * STUB METHOD - Code for closing the cart
   */


  AJAXCart.prototype.close = function close() {
    if (!this.stateIsOpen) return;

    this.stateIsOpen = false;

    this.$el.removeClass(classes.cartOpen);

    if (this.settings.backdrop) {
      this.removeBackdrop(function () {
        $body.removeClass(classes.bodyCartOpen);
      });
    }
  };

  return AJAXCart;
}();

exports.default = AJAXCart;

},{"./currency":5,"./images":6,"./shopifyAPI":19,"./utils":21}],3:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _appRouter = require('./appRouter');

var _appRouter2 = _interopRequireDefault(_appRouter);

var _header = require('./sections/header');

var _header2 = _interopRequireDefault(_header);

var _footer = require('./sections/footer');

var _footer2 = _interopRequireDefault(_footer);

var _ajaxCart = require('./sections/ajaxCart');

var _ajaxCart2 = _interopRequireDefault(_ajaxCart);

var _mobileMenu = require('./sections/mobileMenu');

var _mobileMenu2 = _interopRequireDefault(_mobileMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Sections
// import SectionManager  from './sectionManager';
(function ($) {

  // Sections Stuff 
  // window.sectionManager = new SectionManager();

  var sections = {};

  sections.header = new _header2.default($('[data-section-type="header"]'));
  sections.footer = new _footer2.default($('[data-section-type="footer"]'));
  sections.ajaxCart = new _ajaxCart2.default($('[data-section-type="ajax-cart"]'));
  sections.mobileMenu = new _mobileMenu2.default($('[data-section-type="mobile-menu"]'));

  var appRouter = new _appRouter2.default({
    onRouteStart: function onRouteStart(url) {
      sections.ajaxCart.ajaxCart.close(); // Run this immediately in case it's open
    },
    onViewTransitionOutDone: function onViewTransitionOutDone(url) {
      // Update the menu immediately or wait?
      sections.header.deactivateMenuLinks();
      sections.header.activateMenuLinkForUrl(url);
    },
    onViewChangeDOMUpdatesComplete: function onViewChangeDOMUpdatesComplete() {
      window.scrollTop = 0;
    }
  });
  // Misc Stuff

  // Chosen JS plugin for select boxes
  _utils2.default.chosenSelects();

  // Apply UA classes to the document
  _utils2.default.userAgentBodyClass();

  // Apply a specific class to the html element for browser support of cookies.
  if (_utils2.default.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
  // END Misc Stuff

  $(document.body).addClass('is-loaded').removeClass('is-loading');

  // Stop here...no AJAX navigation inside the theme editor
  if (Shopify && Shopify.designMode) {
    return;
  }

  $(document.body).on('click', 'a', function (e) {
    if (e.isDefaultPrevented()) return;

    var url = e.currentTarget.getAttribute('href');

    if (_utils2.default.isExternal(url) || url == '#') return;

    e.preventDefault();
    appRouter.navigate(url);
  });

  return;

  // Prefetching :)
  var linkInteractivityTimeout = false;
  var prefetchCache = {};
  $(document.body).on('mouseenter', 'a', function (e) {
    var url = e.currentTarget.getAttribute('href');
    if (_utils2.default.isExternal(url) || url == '#' || prefetchCache.hasOwnProperty(url)) return;

    var linkInteractivityTimeout = setTimeout(function () {
      $.get(url, function () {
        prefetchCache[url] = true;
        console.log(prefetchCache);
      });
    }, 500);
  });

  $(document.body).on('mouseleave', 'a', function (e) {
    var linkInteractivityTimeout = false;
  });
})(jQuery);

},{"./appRouter":4,"./sections/ajaxCart":10,"./sections/footer":14,"./sections/header":15,"./sections/mobileMenu":16,"./utils":21}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('navigo');

var _base = require('./views/base');

var _base2 = _interopRequireDefault(_base);

var _index = require('./views/index');

var _index2 = _interopRequireDefault(_index);

var _product = require('./views/product');

var _product2 = _interopRequireDefault(_product);

var _collection = require('./views/collection');

var _collection2 = _interopRequireDefault(_collection);

var _cart = require('./views/cart');

var _cart2 = _interopRequireDefault(_cart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Views


// TODO - Move the loader and main content bits to variables that get passed in
var $body = $(document.body);
var $mainContent = $('#MainContent');
var $loader = $('#loader');
var TEMPLATE_REGEX = /(^|\s)template-\S+/g;
var firstRoute = true;

var AppRouter = function () {
  function AppRouter() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AppRouter);

    var defaults = {
      onRouteStart: $.noop,
      onViewTransitionOutDone: $.noop,
      onViewChangeDOMUpdatesComplete: $.noop
    };

    this.viewConstructors = {
      'index': _index2.default,
      'product': _product2.default,
      'collection': _collection2.default,
      'cart': _cart2.default
    };

    this.router = new Navigo(window.location.origin, false, '#!');
    this.currentView = null;
    this.settings = $.extend({}, defaults, options);

    // Add Routes
    this.router.on('/products/:slug', function (params) {
      _this.doRoute('/products/' + params.slug, 'product');
    });

    // Product within collection
    this.router.on('/collections/:slug/products/:handle', function (params, query) {
      _this.doRoute('/collections/' + params.slug + '/products/' + params.handle, 'product');
    });

    this.router.on('/collections/:slug', function (params, query) {
      var url = '/collections/' + params.slug;
      if (query) {
        url += '?' + query;
      }
      _this.doRoute(url, 'collection');
    });

    this.router.on('/collections', function () {
      _this.doRoute('/collections', 'list-collections');
    });

    this.router.on('/products', function () {
      _this.doRoute('/products', 'list-collections');
    });

    this.router.on('/cart', function (params) {
      _this.doRoute('/cart');
    });

    this.router.on('/pages/:slug', function (params) {
      _this.doRoute('/pages/' + params.slug, 'page');
    });

    this.router.on('/', function () {
      _this.doRoute('/', 'index');
    });

    this.router.notFound(function (params) {
      // called when there is path specified but
      // there is no route matching
      console.log(params);
    });

    this.router.resolve();
  }

  AppRouter.prototype.doRoute = function doRoute(url, type) {
    var _this2 = this;

    var self = this;
    var viewConstructor = this.viewConstructors[type] || _base2.default;

    if (firstRoute) {
      this.currentView = new viewConstructor($mainContent);
      firstRoute = false;
      return;
    }

    var transitionDeferred = $.Deferred();
    var ajaxDeferred = $.Deferred();

    // Add a timeout to do a basic redirect to the url if the request takes longer than a few seconds
    var t = setTimeout(function () {
      window.location = url;
    }, 4000);

    $.get(url, function (response) {
      clearTimeout(t);
      ajaxDeferred.resolve(response);
    });

    this.settings.onRouteStart(url);

    // Let the current view do it's 'out' transition and then apply the loading state
    this.currentView.transitionOut(function () {

      _this2.settings.onViewTransitionOutDone(url);

      $loader.addClass('is-visible');
      $loader.on('transitionend', function () {
        transitionDeferred.resolve();
      });
    });

    // Once AJAX *and* css animations are done, trigger the callback
    $.when(ajaxDeferred, transitionDeferred).done(function (response) {
      _this2.doViewChange(response, viewConstructor);
    });
  };

  AppRouter.prototype.doViewChange = function doViewChange(AJAXResponse, viewConstructor) {
    var _this3 = this;

    // Kill the current view
    this.currentView.destroy();

    var $responseHtml = $(document.createElement("html"));

    $responseHtml.get(0).innerHTML = AJAXResponse;

    var $responseHead = $responseHtml.find('head');
    var $responseBody = $responseHtml.find('body');

    var $dom = $responseBody.find('#MainContent .layout-main-content');

    // Do DOM updates
    document.title = $responseHead.find('title').text();
    $mainContent.find('.layout-main-content').replaceWith($dom);
    $body.removeClass(function (i, classname) {
      return (classname.match(TEMPLATE_REGEX) || []).join(' ');
    });

    var responseBodyClasses = $responseBody.attr('class').split(' ');
    $body.addClass(function (i, classname) {
      var addClasses = responseBodyClasses.map(function (classname) {
        return classname.match(TEMPLATE_REGEX);
      }).join(' ');

      return addClasses;
      // return responseBodyClasses.(/(^|\s)template-\S+/g).join(' ');
    });
    // Finish DOM updates

    this.settings.onViewChangeDOMUpdatesComplete();

    this.currentView = new viewConstructor($mainContent);

    $mainContent.imagesLoaded(function () {
      $loader.removeClass('is-visible');
      _this3.currentView.transitionIn();
    });
  };

  AppRouter.prototype.navigate = function navigate(url) {
    this.router.navigate(url);
  };

  return AppRouter;
}();

exports.default = AppRouter;

},{"./views/base":22,"./views/cart":23,"./views/collection":24,"./views/index":25,"./views/product":26,"navigo":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moneyFormat = '${{amount}}';

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

exports.default = {

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  formatMoney: function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = _utils2.default.defaultTo(precision, 2);
      thousands = _utils2.default.defaultTo(thousands, ',');
      decimal = _utils2.default.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  },


  /**
   * Removes '.00' if found at the end of the string
   *
   * @param  {string} value - formatted price (see above)
   * @return {string} value - formatted value
   */
  stripZeroCents: function stripZeroCents(string) {
    return string.replace(/\.00$/, '');
  }
};

},{"./utils":21}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

exports.default = {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */
  preload: function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  },


  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  loadImage: function loadImage(path) {
    new Image().src = path;
  },


  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  imageSize: function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  },


  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  getSizedImageUrl: function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  },
  removeProtocol: function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _productVariants = require('./productVariants');

var _productVariants2 = _interopRequireDefault(_productVariants);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _currency = require('../currency');

var _currency2 = _interopRequireDefault(_currency);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var $window = $(window);

var ProductDetailForm = function () {

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
    _classCallCheck(this, ProductDetailForm);

    this.settings = {};
    this.name = 'productDetailForm';
    this.namespace = '.' + this.name;

    this.events = {
      RESIZE: 'resize' + this.namespace,
      CLICK: 'click' + this.namespace,
      READY: 'ready' + this.namespace
    };

    var ready = false;
    var defaults = {
      enableHistoryState: true
    };

    this.initialize = function () {
      if (ready) {
        return;
      }

      this.settings = $.extend({}, defaults, config);

      if (!this.settings.$el || this.settings.$el == undefined) {
        console.warn('[' + this.name + '] - $el required to initialize');
        return;
      }

      this.$el = this.settings.$el;
      this.$container = this.settings.$container;

      if (!this.$container || this.$container == undefined) {
        this.$container = this.$el;
      }

      this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

      _utils2.default.chosenSelects(this.$container);

      var variantOptions = {
        $container: this.$container,
        enableHistoryState: this.settings.enableHistoryState,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new _productVariants2.default(variantOptions);

      // See productVariants
      this.$container.on('variantChange' + this.namespace, this.onVariantChange.bind(this));
      this.$container.on(this.events.CLICK, selectors.variantOptionValue, this.onVariantOptionValueClick.bind(this));

      this.initGalleries();

      var e = $.Event(this.events.READY);
      this.$el.trigger(e);

      ready = true;
    };
  }

  ProductDetailForm.prototype.initGalleries = function initGalleries() {
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
        callback: function callback() {
          $zoomTarget.addClass(classes.zoomReady);
        },
        onZoomIn: function onZoomIn() {
          $zoomTarget.addClass(classes.zoomedIn);
        },
        onZoomOut: function onZoomOut() {
          $zoomTarget.removeClass(classes.zoomedIn);
        }
      };

      $zoomTarget.zoom(opts);

      $zoomTarget.find(selectors.productZoomButton).on('click', function (e) {
        $zoomTarget.trigger('click');
        return false;
      });
    }

    function destroyHoverZoom($zoomTarget) {
      $zoomTarget.trigger('zoom.destroy');
      $zoomTarget.find(selectors.productZoomButton).off('click');
    }

    function onSlideshowSlickBeforeChange(e, slick) {
      var $zoomTarget = $(slick.$slides[slick.currentSlide]);
      destroyHoverZoom($zoomTarget);
    }

    function onSlideshowSlickAfterChange(e, slick) {
      var $zoomTarget = $(slick.$slides[slick.currentSlide]);
      if (self.settings.enableZoom) {
        initHoverZoom($zoomTarget);
      }
    }

    function onSlideshowSlickInit(e, slick) {
      var $zoomTarget = $(slick.$slides[slick.currentSlide]);
      initHoverZoom($zoomTarget);
    }

    $galleries.each(function () {
      var $slideshow = $(this).find(selectors.productGallerySlideshow);
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

      $thumbnails.on('click', selectors.productGalleryThumbnailsSlide, function () {
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
    $galleries.not('.hide').each(function () {
      var $variantGallery = $(this);
      $variantGallery.find(selectors.productGallerySlideshow).slick('getSlick').refresh();
      $variantGallery.find(selectors.productGalleryThumbnails).slick('getSlick').refresh();
    });
  };

  /**
   * Slick sliders are annoying and sometimes need an ass kicking
   *
   */


  ProductDetailForm.prototype.resizeGalleries = function resizeGalleries() {
    $('.slick-slider', this.$container).resize();
  };

  ProductDetailForm.prototype.onVariantChange = function onVariantChange(evt) {
    var variant = evt.variant;

    this.updateProductPrices(variant);
    this.updateAddToCartState(variant);
    this.updateQuantityDropdown(variant);
    this.updateVariantOptionValues(variant);
    this.updateGalleries(variant);

    $(selectors.singleOptionSelector, this.$container).trigger('chosen:updated');
  };

  /**
   * Updates the DOM state of the add to cart button
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateAddToCartState = function updateAddToCartState(variant) {

    var $addToCartBtn = $(selectors.addToCart, this.$container);
    var $addToCartBtnText = $(selectors.addToCartText, this.$container);
    var $priceWrapper = $(selectors.priceWrapper, this.$container);

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
  };

  /**
   * Updates the disabled property of the quantity select based on the availability of the selected variant
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateQuantityDropdown = function updateQuantityDropdown(variant) {

    var $select = $(selectors.quantitySelect, this.$container);

    // Close the dropdown while we make changes to it
    $select.trigger('chosen:close');

    if (variant && variant.available) {
      $select.prop('disabled', false);
    } else {
      $select.prop('disabled', true);
    }

    $select.trigger('chosen:updated');
  };

  /**
   * Updates the DOM with specified prices
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateProductPrices = function updateProductPrices(variant) {
    var $productPrice = $(selectors.productPrice, this.$container);
    var $comparePrice = $(selectors.comparePrice, this.$container);
    var $compareEls = $comparePrice.add($(selectors.comparePriceText, this.$container));

    if (variant) {
      $productPrice.html(_currency2.default.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(_currency2.default.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass(classes.hide);
      } else {
        $comparePrice.html('');
        $compareEls.addClass(classes.hide);
      }
    }
  };

  /**
   * Updates the DOM state of the elements matching the variantOption Value selector based on the currently selected variant
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateVariantOptionValues = function updateVariantOptionValues(variant) {
    if (variant) {
      // Loop through all the options and update the option value
      for (var i = 1; i <= 3; i++) {
        var variantOptionValue = variant['option' + i];

        if (!variantOptionValue) break; // Break if the product doesn't have an option at this index

        // Since we are finding the variantOptionValueUI based on the *actual* value, we need to scope to the correct list
        // As some products can have the same values for different variant options (waist + inseam both use "32", "34", etc..)
        var $variantOptionValueList = $(selectors.variantOptionValueList, this.$container).filter('[data-option-position="' + i + '"]');
        var $variantOptionValueUI = $('[data-variant-option-value="' + variantOptionValue + '"]', $variantOptionValueList);

        $variantOptionValueUI.addClass(classes.variantOptionValueActive);
        $variantOptionValueUI.siblings().removeClass(classes.variantOptionValueActive);
      }
    }
  };

  /**
   * Look for a gallery matching one of the selected variant's options and switch to that gallery
   * If a matching gallery doesn't exist, look for the variant's featured image in the main gallery and switch to that
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateGalleries = function updateGalleries(variant) {

    var $galleries = $(selectors.productGallery, this.$container);

    function getVariantGalleryForOption(option) {
      return $galleries.filter(function () {
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
      } else {
        // $galleries is just a single gallery
        // Slide to featured image for selected variant but only if we're not already on it.
        // Have to check this way because slick clones slides so even if we're currently on it, there can be a cloned slide that also has the correct data-image attribute
        if (variant.featured_image && $galleries.find('.slick-current').data('image') != variant.featured_image.id) {
          var $imageSlide = $galleries.find('[data-image="' + variant.featured_image.id + '"]').first();

          if ($imageSlide.length) {
            $galleries.find(selectors.productGallerySlideshow).slick('slickGoTo', $imageSlide.data('slick-index'));
          }
        }
      }
    } else {
      // No variant - Don't do anything?
    }
  };

  /**
   * Handle variant option value click event.
   * Update the associated select tag and update the UI for this value
   *
   * @param {event} evt
   */


  ProductDetailForm.prototype.onVariantOptionValueClick = function onVariantOptionValueClick(e) {

    var $option = $(e.currentTarget);

    if ($option.hasClass(classes.variantOptionValueActive)) {
      return;
    }

    var value = $option.data('variant-option-value');
    var position = $option.parents(selectors.variantOptionValueList).data('option-position');
    var $selector = $(selectors.singleOptionSelector, this.$container).filter('[data-index="option' + position + '"]');

    $selector.val(value);
    $selector.trigger('change');

    $option.addClass(classes.variantOptionValueActive);
    $option.siblings().removeClass(classes.variantOptionValueActive);
  };

  return ProductDetailForm;
}();

exports.default = ProductDetailForm;

},{"../currency":5,"../utils":21,"./productVariants":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Product Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 */

var ProductVariants = function () {
  function ProductVariants(options) {
    _classCallCheck(this, ProductVariants);

    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  /**
   * Get the currently selected options from add-to-cart form. Works with all
   * form input elements.
   *
   * @return {array} options - Values of currently selected variants
   */


  ProductVariants.prototype._getCurrentOptions = function _getCurrentOptions() {
    var currentOptions = $.map($(this.singleOptionSelector, this.$container), function (element) {
      var $element = $(element);
      var type = $element.attr('type');
      var currentOption = {};

      if (type === 'radio' || type === 'checkbox') {
        if ($element[0].checked) {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        } else {
          return false;
        }
      } else {
        currentOption.value = $element.val();
        currentOption.index = $element.data('index');

        return currentOption;
      }
    });

    // remove any unchecked input values if using radio buttons or checkboxes
    currentOptions = _utils2.default.compact(currentOptions);

    return currentOptions;
  };

  /**
   * Find variant based on selected values.
   *
   * @param  {array} selectedValues - Values of variant inputs
   * @return {object || undefined} found - Variant object from product.variants
   */


  ProductVariants.prototype._getVariantFromOptions = function _getVariantFromOptions() {
    var selectedValues = this._getCurrentOptions();
    var variants = this.product.variants;
    var found = false;

    variants.forEach(function (variant) {
      var satisfied = true;

      selectedValues.forEach(function (option) {
        if (satisfied) {
          satisfied = option.value === variant[option.index];
        }
      });

      if (satisfied) {
        found = variant;
      }
    });

    return found || null;
  };

  /**
   * Event handler for when a variant input changes.
   */


  ProductVariants.prototype._onSelectChange = function _onSelectChange() {
    var variant = this._getVariantFromOptions();

    this.$container.trigger({
      type: 'variantChange',
      variant: variant
    });

    if (!variant) {
      return;
    }

    this._updateMasterSelect(variant);
    this._updateImages(variant);
    this._updatePrice(variant);
    this.currentVariant = variant;

    if (this.enableHistoryState) {
      this._updateHistoryState(variant);
    }
  };

  /**
   * Trigger event when variant image changes
   *
   * @param  {object} variant - Currently selected variant
   * @return {event}  variantImageChange
   */


  ProductVariants.prototype._updateImages = function _updateImages(variant) {
    var variantImage = variant.featured_image || {};
    var currentVariantImage = this.currentVariant.featured_image || {};

    if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
      return;
    }

    this.$container.trigger({
      type: 'variantImageChange',
      variant: variant
    });
  };

  /**
   * Trigger event when variant price changes.
   *
   * @param  {object} variant - Currently selected variant
   * @return {event} variantPriceChange
   */


  ProductVariants.prototype._updatePrice = function _updatePrice(variant) {
    if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
      return;
    }

    this.$container.trigger({
      type: 'variantPriceChange',
      variant: variant
    });
  };

  /**
   * Update history state for product deeplinking
   *
   * @param  {variant} variant - Currently selected variant
   * @return {k}         [description]
   */


  ProductVariants.prototype._updateHistoryState = function _updateHistoryState(variant) {
    if (!history.replaceState || !variant) {
      return;
    }

    var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
    window.history.replaceState({ path: newurl }, '', newurl);
  };

  /**
   * Update hidden master select of variant change
   *
   * @param  {variant} variant - Currently selected variant
   */


  ProductVariants.prototype._updateMasterSelect = function _updateMasterSelect(variant) {
    $(this.originalSelectorId, this.$container)[0].value = variant.id;
  };

  return ProductVariants;
}();

exports.default = ProductVariants;

},{"../utils":21}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _test = require('./sections/test');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  test: _test2.default
};

},{"./sections/test":18}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _ajaxCart = require('../ajaxCart');

var _ajaxCart2 = _interopRequireDefault(_ajaxCart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

/**
 * Ajax Cart Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the interacting with the ajax cart section.
 * All logic is handled in AjaxCart, this file is strictly for handling section settings and them editor interactions
 *
 * @namespace - ajaxCart
 */

var $body = $(document.body);

var AJAXCartSection = function (_BaseSection) {
  _inherits(AJAXCartSection, _BaseSection);

  function AJAXCartSection(container) {
    _classCallCheck(this, AJAXCartSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'ajaxCart';
    _this.namespace = '.' + _this.name;

    _this.ajaxCart = new _ajaxCart2.default();

    _this.ajaxCart.init();
    return _this;
  }

  AJAXCartSection.prototype.onSelect = function onSelect(e) {
    console.log('on select inside AJAXCart');
    this.ajaxCart.open();
  };

  AJAXCartSection.prototype.onDeselect = function onDeselect(e) {
    this.ajaxCart.close();
  };

  AJAXCartSection.prototype.onUnload = function onUnload(e) {
    this.ajaxCart.$backdrop && this.ajaxCart.$backdrop.remove();
  };

  return AJAXCartSection;
}(_base2.default);

exports.default = AJAXCartSection;

},{"../ajaxCart":2,"./base":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var shopifyEvents = ['shopify:section:unload', 'shopify:section:select', 'shopify:section:deselect', 'shopify:section:reorder', 'shopify:block:select', 'shopify:block:deselect'];

var BaseSection = function () {
  function BaseSection(container) {
    _classCallCheck(this, BaseSection);

    this.$container = container instanceof $ ? container : $(container);
    this.id = this.$container.data('section-id');
    this.type = this.$container.data('section-type');

    $(document).on(shopifyEvents.join(' '), this.onShopifyEvent.bind(this));
  }

  BaseSection.prototype.onShopifyEvent = function onShopifyEvent(e) {
    if (e.detail.sectionId != this.id.toString()) {
      return;
    }

    switch (e.type) {
      case 'shopify:section:unload':
        this.onUnload(e);
        break;
      case 'shopify:section:select':
        this.onSelect(e);
        break;
      case 'shopify:section:deselect':
        this.onDeselect(e);
        break;
      case 'shopify:section:reorder':
        this.onReorder(e);
        break;
      case 'shopify:block:select':
        this.onBlockSelect(e);
        break;
      case 'shopify:block:deselect':
        this.onBlockDeselect(e);
        break;
    }
  };

  BaseSection.prototype.onUnload = function onUnload(e) {
    console.log('[BaseSection] - removing event listeners - onSectionUnload');
    $(document).off(shopifyEvents.join(' '), this.onShopifyEvent.bind(this));
  };

  BaseSection.prototype.onSelect = function onSelect(e) {
    console.log('onselect in base section');
  };

  BaseSection.prototype.onDeselect = function onDeselect(e) {};

  BaseSection.prototype.onReorder = function onReorder(e) {};

  BaseSection.prototype.onBlockSelect = function onBlockSelect(e) {};

  BaseSection.prototype.onBlockDeselect = function onBlockDeselect(e) {};

  return BaseSection;
}();

exports.default = BaseSection;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  form: '[data-cart-form]',
  itemQtySelect: '[data-item-quantity-select]'
};

var classes = {};

var CartSection = function (_BaseSection) {
  _inherits(CartSection, _BaseSection);

  function CartSection(container) {
    _classCallCheck(this, CartSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'cart';
    _this.namespace = '.' + _this.name;

    var $form = $(selectors.form, _this.$container);

    // Since we have more than 1 quantity select per row (1 for mobile, 1 for desktop)
    // We need to use single input per row, which is responsible for sending the form data for that line item
    // Watch for changes on the quantity selects, and then update the input.  These two are tied together using a data attribute
    _this.$container.on('change', selectors.itemQtySelect, function () {
      var $itemQtyInput = $('[id="' + $(this).data('item-quantity-select') + '"]'); // Have to do '[id=".."]' instead of '#id' because id is generated using {{ item.key }} which has semi-colons in it - breaks normal id select
      $itemQtyInput.val($(this).val());
      $form.submit();
    });
    return _this;
  }

  return CartSection;
}(_base2.default);

exports.default = CartSection;

},{"./base":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var CollectionSection = function (_BaseSection) {
  _inherits(CollectionSection, _BaseSection);

  function CollectionSection(container) {
    _classCallCheck(this, CollectionSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'collection';
    _this.namespace = '.' + _this.name;
    console.log('constructing collection view');
    return _this;
  }

  return CollectionSection;
}(_base2.default);

exports.default = CollectionSection;

},{"./base":11}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require("./base");

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {};

var FooterSection = function (_BaseSection) {
  _inherits(FooterSection, _BaseSection);

  function FooterSection(container) {
    _classCallCheck(this, FooterSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'footer';
    _this.namespace = "." + _this.name;
    return _this;
  }

  return FooterSection;
}(_base2.default);

exports.default = FooterSection;

},{"./base":11}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  header: '[data-header]',
  mainMenu: '.main-menu'
};

var classes = {
  menuLinkActive: 'is-active'
};

var HeaderSection = function (_BaseSection) {
  _inherits(HeaderSection, _BaseSection);

  function HeaderSection(container) {
    _classCallCheck(this, HeaderSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.$el = $(selectors.header, _this.$container);
    _this.name = 'header';
    _this.namespace = '.' + _this.name;
    _this.$menu = _this.$el.find(selectors.mainMenu);
    _this.$menuDirectLinks = _this.$menu.find('> li > a');

    _this.$menu.on('mouseleave', _this.onMenuMouseleave.bind(_this));
    _this.$menuDirectLinks.on('mouseenter', _this.onMenuLinkMouseenter.bind(_this));
    _this.$menuDirectLinks.on('mouseleave', _this.onMenuLinkMouseleave.bind(_this));
    return _this;
  }

  HeaderSection.prototype.activateMenuLinkForUrl = function activateMenuLinkForUrl(url) {
    this.$menu.find('a').each(function (i, el) {
      var $el = $(el);
      var href = $el.attr('href');
      if (href == url || url.indexOf(href) > -1) {
        $el.addClass(classes.menuLinkActive);
      }
    });
  };

  HeaderSection.prototype.deactivateMenuLinks = function deactivateMenuLinks() {
    this.$menu.find('.' + classes.menuLinkActive).removeClass(classes.menuLinkActive);
  };

  HeaderSection.prototype.onMenuMouseleave = function onMenuMouseleave(e) {
    this.$menu.removeClass('has-hovered-link');
    this.$menuDirectLinks.removeClass('is-hovered');
  };

  HeaderSection.prototype.onMenuLinkMouseenter = function onMenuLinkMouseenter(e) {
    this.$menu.addClass('has-hovered-link');
    $(e.currentTarget).addClass('is-hovered');
  };

  HeaderSection.prototype.onMenuLinkMouseleave = function onMenuLinkMouseleave(e) {
    this.$menu.removeClass('has-hovered-link');
    $(e.currentTarget).removeClass('is-hovered');
  };

  return HeaderSection;
}(_base2.default);

exports.default = HeaderSection;

},{"./base":11}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require("./base");

var _base2 = _interopRequireDefault(_base);

var _drawer = require("../uiComponents/drawer");

var _drawer2 = _interopRequireDefault(_drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  toggle: '[data-mobile-menu-toggle]',
  menu: '[data-mobile-menu]'
};

var MobileMenuSection = function (_BaseSection) {
  _inherits(MobileMenuSection, _BaseSection);

  function MobileMenuSection(container) {
    _classCallCheck(this, MobileMenuSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'mobileMenu';
    _this.namespace = "." + _this.name;

    _this.$el = $(selectors.menu, _this.$container);
    _this.$toggle = $(selectors.toggle); // Don't scope to this.$container

    _this.drawer = new _drawer2.default(_this.$el);

    _this.$toggle.on('click', _this.onToggleClick.bind(_this));
    return _this;
  }

  MobileMenuSection.prototype.onToggleClick = function onToggleClick(e) {
    e.preventDefault();
    this.drawer.toggle();
  };

  /**
   * Theme Editor section events below
   */


  MobileMenuSection.prototype.onSelect = function onSelect() {
    this.drawer.show();
  };

  MobileMenuSection.prototype.onDeselect = function onDeselect() {
    this.drawer.hide();
  };

  MobileMenuSection.prototype.onUnload = function onUnload() {
    this.drawer.$backdrop && this.drawer.$backdrop.remove();
  };

  return MobileMenuSection;
}(_base2.default);

exports.default = MobileMenuSection;

},{"../uiComponents/drawer":20,"./base":11}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _productDetailForm = require('../product/productDetailForm');

var _productDetailForm2 = _interopRequireDefault(_productDetailForm);

var _drawer = require('../uiComponents/drawer');

var _drawer2 = _interopRequireDefault(_drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  sizeGuideDrawer: '[data-size-guide-drawer]',
  sizeGuideShow: '[data-size-guide-show]'
};

var ProductSection = function (_BaseSection) {
  _inherits(ProductSection, _BaseSection);

  function ProductSection(container) {
    _classCallCheck(this, ProductSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'product';
    _this.namespace = '.' + _this.name;

    _this.productDetailForm = new _productDetailForm2.default({
      $el: _this.$container,
      $container: _this.$container,
      enableHistoryState: true
    });

    _this.productDetailForm.initialize();

    _this.$sizeGuideDrawerEl = $(selectors.sizeGuideDrawer, _this.$container);

    if (_this.$sizeGuideDrawerEl.length) {
      _this.drawer = new _drawer2.default(_this.$sizeGuideDrawerEl);

      _this.$container.on('click', selectors.sizeGuideShow, _this.onSizeGuideShowClick.bind(_this));
    }
    return _this;
  }

  ProductSection.prototype.onSelect = function onSelect(e) {
    console.log('on select in product section');
  };

  ProductSection.prototype.onSizeGuideShowClick = function onSizeGuideShowClick(e) {
    e.preventDefault();
    this.drawer.show();
  };

  return ProductSection;
}(_base2.default);

exports.default = ProductSection;

},{"../product/productDetailForm":7,"../uiComponents/drawer":20,"./base":11}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require("./base");

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var TestSection = function (_BaseSection) {
  _inherits(TestSection, _BaseSection);

  function TestSection(container) {
    _classCallCheck(this, TestSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'test';
    _this.namespace = "." + _this.name;

    _this.$container.append(new Date());

    return _this;
  }

  return TestSection;
}(_base2.default);

exports.default = TestSection;

},{"./base":11}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  /**
   * AJAX submit an 'add to cart' form
   *
   * @param {jQuery} $form - jQuery instance of the form
   * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
   */
  addItemFromForm: function addItemFromForm($form) {
    var promise = $.Deferred();
    var self = this;

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/add.js',
      data: $form.serialize(),
      success: function success() {
        self.getCart().then(function (data) {
          promise.resolve(data);
        });
      },
      error: function error() {
        promise.reject({
          message: 'The quantity you entered is not available.'
        });
      }
    });

    return promise;
  },


  /**
   * Retrieve a JSON respresentation of the users cart
   *
   * @return {Promise} - JSON cart
   */
  getCart: function getCart() {
    var promise = $.Deferred();
    var url = '/cart?view=json';

    if (Shopify && Shopify.designMode) {
      url = '/cart.js';
    }

    $.ajax({
      type: 'get',
      url: url,
      success: function success(data) {
        var cart = JSON.parse(data);
        promise.resolve(cart);
      },
      error: function error() {
        promise.reject({
          message: 'Could not retrieve cart items'
        });
      }
    });

    return promise;
  },


  /**
   * Retrieve a JSON respresentation of the users cart
   *
   * @return {Promise} - JSON cart
   */
  getProduct: function getProduct(handle) {
    return $.getJSON('/products/' + handle + '.js');
  },


  /**
   * Change the quantity of an item in the users cart
   *
   * @param {int} line - Cart line
   * @param {int} qty - New quantity of the variant
   * @return {Promise} - JSON cart
   */
  changeLineItemQuantity: function changeLineItemQuantity(line, qty) {
    return $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/change.js',
      data: 'quantity=' + qty + '&line=' + line
    });
  }
};

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $document = $(document);
var $body = $(document.body);

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

var Drawer = function () {

  /**
   * Drawer constructor
   *
   * @param {HTMLElement | $} el - The drawer element
   * @param {Object} options
   */
  function Drawer(el, options) {
    _classCallCheck(this, Drawer);

    this.name = 'drawer';
    this.namespace = '.' + this.name;

    this.$el = $(el);
    this.$backdrop = null;
    this.stateIsOpen = false;
    this.transitionEndEvent = _utils2.default.whichTransitionEnd();
    this.supportsCssTransitions = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;

    if (this.$el == undefined || !this.$el.hasClass(classes.drawer)) {
      console.warn('[' + this.name + '] - Element with class `' + classes.drawer + '` required to initialize.');
      return;
    }

    var defaults = {
      closeSelector: selectors.close,
      backdrop: true
    };

    this.settings = $.extend({}, defaults, options);

    this.events = {
      HIDE: 'hide' + this.namespace,
      HIDDEN: 'hidden' + this.namespace,
      SHOW: 'show' + this.namespace,
      SHOWN: 'shown' + this.namespace
    };

    this.$el.on('click', this.settings.closeSelector, this.onCloseClick.bind(this));
  }

  Drawer.prototype.addBackdrop = function addBackdrop(callback) {
    var _this = this;
    var cb = callback || $.noop;

    if (this.stateIsOpen) {
      this.$backdrop = $(document.createElement('div'));

      this.$backdrop.addClass(classes.backdrop).appendTo($body);

      this.$backdrop.one(this.transitionEndEvent, cb);
      this.$backdrop.one('click', this.hide.bind(this));

      // debug this...
      setTimeout(function () {
        $body.addClass(classes.bodyDrawerOpen);
        _this.$backdrop.addClass(classes.backdropVisible);
      }, 10);
    } else {
      cb();
    }
  };

  Drawer.prototype.removeBackdrop = function removeBackdrop(callback) {
    var _this = this;
    var cb = callback || $.noop;

    if (this.$backdrop) {
      this.$backdrop.one(this.transitionEndEvent, function () {
        _this.$backdrop && _this.$backdrop.remove();
        _this.$backdrop = null;
        cb();
      });

      setTimeout(function () {
        _this.$backdrop.removeClass(classes.backdropVisible);
        $body.removeClass(classes.bodyDrawerOpen);
      }, 10);
    } else {
      cb();
    }
  };

  /**
   * Called after the closing animation has run
   */


  Drawer.prototype.onHidden = function onHidden() {
    this.stateIsOpen = false;
    var e = $.Event(this.events.HIDDEN);
    this.$el.trigger(e);
  };

  /**
   * Called after the opening animation has run
   */


  Drawer.prototype.onShown = function onShown() {
    var e = $.Event(this.events.SHOWN);
    this.$el.trigger(e);
  };

  Drawer.prototype.hide = function hide() {
    var e = $.Event(this.events.HIDE);
    this.$el.trigger(e);

    if (!this.stateIsOpen) return;

    this.$el.removeClass(classes.visible);

    if (this.settings.backdrop) {
      this.removeBackdrop();
    }

    if (this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onHidden.bind(this));
    } else {
      this.onHidden();
    }
  };

  Drawer.prototype.show = function show() {
    var e = $.Event(this.events.SHOW);
    this.$el.trigger(e);

    if (this.stateIsOpen) return;

    this.stateIsOpen = true;

    this.$el.addClass(classes.visible);

    if (this.settings.backdrop) {
      this.addBackdrop();
    }

    if (this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onShown.bind(this));
    } else {
      this.onShown();
    }
  };

  Drawer.prototype.toggle = function toggle() {
    return this.stateIsOpen ? this.hide() : this.show();
  };

  Drawer.prototype.onCloseClick = function onCloseClick(e) {
    e.preventDefault();
    this.hide();
  };

  return Drawer;
}();

exports.default = Drawer;

},{"../utils":21}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function findInstance(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },


  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function removeInstance(array, key, value) {
    var i = array.length;
    while (i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },


  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function compact(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },


  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function defaultTo(value, defaultValue) {
    return value == null || value !== value ? defaultValue : value;
  },


  /**
   * Constructs an object of key / value pairs out of the parameters of the query string
   *
   * @return {Object}
   */
  getQueryParams: function getQueryParams() {
    var queryString = location.search && location.search.substr(1) || '';
    var queryParams = {};

    queryString.split('&').filter(function (element) {
      return element.length;
    }).forEach(function (paramValue) {
      var splitted = paramValue.split('=');

      if (splitted.length > 1) {
        queryParams[splitted[0]] = splitted[1];
      } else {
        queryParams[splitted[0]] = true;
      }
    });

    return queryParams;
  },


  /**
   * Returns empty string or query string with '?' prefix
   *
   * @return (string)
   */
  getQueryString: function getQueryString() {
    var queryString = location.search && location.search.substr(1) || '';

    // Add the '?' prefix if there is an actual query
    if (queryString.length) {
      queryString = '?' + queryString;
    }

    return queryString;
  },


  /**
   * Constructs a version of the current URL with the passed in key value pair as part of the query string
   * Will also remove the key if an empty value is passed in
   * See: https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
   *
   * @param {String} key
   * @param {String} value
   * @param {String} uri - optional, defaults to window.location.href
   * @return {String}
   */
  getUrlWithUpdatedQueryStringParameter: function getUrlWithUpdatedQueryStringParameter(key, value, uri) {

    uri = uri || window.location.href;

    // remove the hash part before operating on the uri
    var i = uri.indexOf('#');
    var hash = i === -1 ? '' : uri.substr(i);
    uri = i === -1 ? uri : uri.substr(0, i);

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";

    if (!value) {
      // remove key-value pair if value is empty
      uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
      if (uri.slice(-1) === '?') {
        uri = uri.slice(0, -1);
      }
      // replace first occurrence of & by ? if no ? is present
      if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
    } else if (uri.match(re)) {
      uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      uri = uri + separator + key + "=" + value;
    }
    return uri + hash;
  },


  /**
   * Constructs a version of the current URL with the passed in parameter key and associated value removed
   *
   * @param {String} key
   * @return {String}
   */
  getUrlWithRemovedQueryStringParameter: function getUrlWithRemovedQueryStringParameter(parameterKeyToRemove, uri) {
    uri = uri || window.location.href;

    var rtn = uri.split("?")[0],
        param,
        params_arr = [],
        queryString = uri.indexOf("?") !== -1 ? uri.split("?")[1] : "";

    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        if (param === parameterKeyToRemove) {
          params_arr.splice(i, 1);
        }
      }
      if (params_arr.length > 0) {
        rtn = rtn + "?" + params_arr.join("&");
      }
    }

    return rtn;
  },


  /**
   * Check if we're running the theme inside the theme editor
   *
   * @return {bool}
   */
  isThemeEditor: function isThemeEditor() {
    return location.href.match(/myshopify.com/) !== null && location.href.match(/theme_id/) !== null;
  },


  /**
   * Get the name of the correct 'transitionend' event for the browser we're in
   *
   * @return {string}
   */
  whichTransitionEnd: function whichTransitionEnd() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  },


  /**
   * Adds user agent classes to the document to target specific browsers
   *
   */
  userAgentBodyClass: function userAgentBodyClass() {
    var ua = navigator.userAgent,
        d = document.documentElement,
        classes = d.className,
        matches;

    // Detect iOS (needed to disable zoom on form elements)
    // http://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      classes += ' ua-ios';

      // Add class for version of iOS
      matches = ua.match(/((\d+_?){2,3})\slike\sMac\sOS\sX/);
      if (matches) {
        classes += ' ua-ios-' + matches[1]; // e.g. ua-ios-7_0_2
      }

      // Add class for Twitter app
      if (/Twitter/.test(ua)) {
        classes += ' ua-ios-twitter';
      }

      // Add class for Chrome browser
      if (/CriOS/.test(ua)) {
        classes += ' ua-ios-chrome';
      }
    }

    // Detect Android (needed to disable print links on old devices)
    // http://www.ainixon.me/how-to-detect-android-version-using-js/
    if (/Android/.test(ua)) {
      matches = ua.match(/Android\s([0-9\.]*)/);
      classes += matches ? ' ua-aos ua-aos-' + matches[1].replace(/\./g, '_') : ' ua-aos';
    }

    // Detect webOS (needed to disable optimizeLegibility)
    if (/webOS|hpwOS/.test(ua)) {
      classes += ' ua-webos';
    }

    // Detect Samsung Internet browser
    if (/SamsungBrowser/.test(ua)) {
      classes += ' ua-samsung';
    }

    d.className = classes;
  },


  /**
   * Generates a 32 bit integer from a string
   * Reference - https://stackoverflow.com/a/7616484
   *
   * @param {string}
   * @return {int}
   */
  hashFromString: function hashFromString(string) {
    var hash = 0,
        i,
        chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr = string.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },
  chosenSelects: function chosenSelects($container) {
    var $selects = $container ? $('select.form-control', $container) : $('select.form-control');
    $selects.not('[data-no-chosen]').chosen();

    // Allows browser autofill to function properly
    $selects.on('change', function () {
      $(this).trigger('chosen:updated');
    });
  },


  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function cookiesEnabled() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
    }
    return cookieEnabled;
  },


  /**
   * Pluralizes the unit for the nuber passed in.
   * Usage mirrors the Shopify "pluralize" string filter
   *
   * @param {Number} number
   * @param {String} singular
   * @param {String} plural
   * @return {String}
   */
  pluralize: function pluralize(number, singular, plural) {
    var output = '';

    number = parseInt(number);

    if (number == 1) {
      output = singular;
    } else {
      output = plural;
      if (typeof plural == "undefined") {
        output = singular + 's'; // last resort, turn singular into a plural
      }
    }
    return output;
  },


  /**
   * Checks if a url is an external link or not
   *
   * @param {String} url
   * @return {Bool}
   */
  isExternal: function isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + { "http:": 80, "https:": 443 }[location.protocol] + ")?$"), "") !== location.host) return true;
    return false;
  }
};

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('../sections/base');

var _base2 = _interopRequireDefault(_base);

var _sectionConstructorDictionary = require('../sectionConstructorDictionary');

var _sectionConstructorDictionary2 = _interopRequireDefault(_sectionConstructorDictionary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseView = function () {
  function BaseView($el) {
    _classCallCheck(this, BaseView);

    this.$el = $el;
    this.sections = [];

    $(document).on('shopify:section:load', this.onSectionLoad.bind(this));
    $(document).on('shopify:section:unload', this.onSectionUnload.bind(this));

    console.log('BaseView - contructing view');
  }

  BaseView.prototype._createSectionInstance = function _createSectionInstance($container) {
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    var constructor = _sectionConstructorDictionary2.default[type];

    // Need to make sure we're working with actual sections here..
    if (typeof constructor === 'undefined' || !(constructor.prototype instanceof _base2.default)) {
      return;
    }

    console.log('creating new section instance for type - ' + type);

    this.sections.push(new constructor($container));
  };

  BaseView.prototype.onSectionLoad = function onSectionLoad(e) {
    console.log('[BaseView] - calling section LOAD');

    this._createSectionInstance($('[data-section-id]', e.target));
  };

  BaseView.prototype.onSectionUnload = function onSectionUnload(e) {
    console.log('[BaseView] - calling section UNLOAD');
    console.log('sections count - ' + this.sections.length);

    var remainingSections = [];
    this.sections.forEach(function (section) {
      if (section.id == e.detail.sectionId) {
        console.log('removing section for type - ' + section.type);
        section.onUnload();
      } else {
        remainingSections.push(section);
      }
    });

    this.sections = remainingSections;
    console.log('updated sections count - ' + this.sections.length);
  };

  BaseView.prototype.destroy = function destroy() {
    console.log('[BaseView] - calling DESTROY');
    this.sections.forEach(function (section) {
      section.onUnload && section.onUnload();
    });
  };

  BaseView.prototype.transitionIn = function transitionIn() {
    console.log('transition in!');
  };

  BaseView.prototype.transitionOut = function transitionOut(callback) {
    callback();
  };

  return BaseView;
}();

exports.default = BaseView;

},{"../sectionConstructorDictionary":9,"../sections/base":11}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _cart = require('../sections/cart');

var _cart2 = _interopRequireDefault(_cart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var CartView = function (_BaseView) {
  _inherits(CartView, _BaseView);

  function CartView($el) {
    _classCallCheck(this, CartView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    _this.cartSection = new _cart2.default($el.find('[data-section-type="cart"]'));

    _this.sections.push(_this.cartSection);
    return _this;
  }

  return CartView;
}(_base2.default);

exports.default = CartView;

},{"../sections/cart":12,"./base":22}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _collection = require('../sections/collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var CollectionView = function (_BaseView) {
  _inherits(CollectionView, _BaseView);

  function CollectionView($el) {
    _classCallCheck(this, CollectionView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    _this.collectionSection = new _collection2.default($el.find('[data-section-type="collection"]'));

    _this.sections.push(_this.collectionSection);
    return _this;
  }

  CollectionView.prototype.transitionOut = function transitionOut(callback) {
    $("html, body").animate({ scrollTop: 0 }, 300);
    setTimeout(callback, 150);
  };

  return CollectionView;
}(_base2.default);

exports.default = CollectionView;

},{"../sections/collection":13,"./base":22}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _base3 = require('../sections/base');

var _base4 = _interopRequireDefault(_base3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var IndexView = function (_BaseView) {
  _inherits(IndexView, _BaseView);

  function IndexView($el) {
    _classCallCheck(this, IndexView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    console.log('index view');

    $('[data-section-id]').each(function (i, el) {
      _this._createSectionInstance($(el));
    });
    return _this;
  }

  return IndexView;
}(_base2.default);

exports.default = IndexView;

},{"../sections/base":11,"./base":22}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _product = require('../sections/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var ProductView = function (_BaseView) {
  _inherits(ProductView, _BaseView);

  function ProductView($el) {
    _classCallCheck(this, ProductView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    _this.productSection = new _product2.default($el.find('[data-section-type="product"]'));

    _this.sections.push(_this.productSection);
    return _this;
  }

  ProductView.prototype.transitionIn = function transitionIn() {};

  ProductView.prototype.transitionOut = function transitionOut(callback) {
    if (this.productSection.drawer && this.productSection.drawer.stateIsOpen) {
      this.productSection.drawer.$el.one('hidden.drawer', callback);
      this.productSection.drawer.hide();
    } else {
      callback();
    }
    // this.productSection.$container.css('transition', 'all 1000ms cubic-bezier(0.4, 0.08, 0, 1.02)');
    // this.productSection.$container.css('transform', 'translateY(5%)');
    // this.productSection.$container.css('opacity', '0');
    // setTimeout(callback, 400);
  };

  return ProductView;
}(_base2.default);

exports.default = ProductView;

},{"../sections/product":17,"./base":22}]},{},[3]);
