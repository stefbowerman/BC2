(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Navigo=t()}(this,function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function t(){return!("undefined"==typeof window||!window.history||!window.history.pushState)}function n(e,n,o){this.root=null,this._routes=[],this._useHash=n,this._hash=void 0===o?"#":o,this._paused=!1,this._destroyed=!1,this._lastRouteResolved=null,this._notFoundHandler=null,this._defaultHandler=null,this._usePushState=!n&&t(),this._onLocationChange=this._onLocationChange.bind(this),this._genericHooks=null,this._historyAPIUpdateMethod="pushState",e?this.root=n?e.replace(/\/$/,"/"+this._hash):e.replace(/\/$/,""):n&&(this.root=this._cLoc().split(this._hash)[0].replace(/\/$/,"/"+this._hash)),this._listen(),this.updatePageLinks()}function o(e){return e instanceof RegExp?e:e.replace(/\/+$/,"").replace(/^\/+/,"^/")}function i(e){return e.replace(/\/$/,"").split("/").length}function s(e,t){return i(t)-i(e)}function r(e,t){return function(e){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]).map(function(t){var i=function(e){var t=[];return{regexp:e instanceof RegExp?e:new RegExp(e.replace(n.PARAMETER_REGEXP,function(e,o,i){return t.push(i),n.REPLACE_VARIABLE_REGEXP}).replace(n.WILDCARD_REGEXP,n.REPLACE_WILDCARD)+n.FOLLOWED_BY_SLASH_REGEXP,n.MATCH_REGEXP_FLAGS),paramNames:t}}(o(t.route)),s=i.regexp,r=i.paramNames,a=e.replace(/^\/+/,"/").match(s),h=function(e,t){return 0===t.length?null:e?e.slice(1,e.length).reduce(function(e,n,o){return null===e&&(e={}),e[t[o]]=decodeURIComponent(n),e},null):null}(a,r);return!!a&&{match:a,route:t,params:h}}).filter(function(e){return e})}(e,t)[0]||!1}function a(e,t){var n=t.map(function(t){return""===t.route||"*"===t.route?e:e.split(new RegExp(t.route+"($|/)"))[0]}),i=o(e);return n.length>1?n.reduce(function(e,t){return e.length>t.length&&(e=t),e},n[0]):1===n.length?n[0]:i}function h(e,n,o){var i,s=function(e){return e.split(/\?(.*)?$/)[0]};return void 0===o&&(o="#"),t()&&!n?s(e).split(o)[0]:(i=e.split(o)).length>1?s(i[1]):s(i[0])}function u(t,n,o){if(n&&"object"===(void 0===n?"undefined":e(n))){if(n.before)return void n.before(function(){(!(arguments.length>0&&void 0!==arguments[0])||arguments[0])&&(t(),n.after&&n.after(o))},o);if(n.after)return t(),void(n.after&&n.after(o))}t()}return n.prototype={helpers:{match:r,root:a,clean:o,getOnlyURL:h},navigate:function(e,t){var n;return e=e||"",this._usePushState?(n=(n=(t?"":this._getRoot()+"/")+e.replace(/^\/+/,"/")).replace(/([^:])(\/{2,})/g,"$1/"),history[this._historyAPIUpdateMethod]({},"",n),this.resolve()):"undefined"!=typeof window&&(e=e.replace(new RegExp("^"+this._hash),""),window.location.href=window.location.href.replace(/#$/,"").replace(new RegExp(this._hash+".*$"),"")+this._hash+e),this},on:function(){for(var t=this,n=arguments.length,o=Array(n),i=0;i<n;i++)o[i]=arguments[i];if("function"==typeof o[0])this._defaultHandler={handler:o[0],hooks:o[1]};else if(o.length>=2)if("/"===o[0]){var r=o[1];"object"===e(o[1])&&(r=o[1].uses),this._defaultHandler={handler:r,hooks:o[2]}}else this._add(o[0],o[1],o[2]);else"object"===e(o[0])&&Object.keys(o[0]).sort(s).forEach(function(e){t.on(e,o[0][e])});return this},off:function(e){return null!==this._defaultHandler&&e===this._defaultHandler.handler?this._defaultHandler=null:null!==this._notFoundHandler&&e===this._notFoundHandler.handler&&(this._notFoundHandler=null),this._routes=this._routes.reduce(function(t,n){return n.handler!==e&&t.push(n),t},[]),this},notFound:function(e,t){return this._notFoundHandler={handler:e,hooks:t},this},resolve:function(e){var n,o,i=this,s=(e||this._cLoc()).replace(this._getRoot(),"");this._useHash&&(s=s.replace(new RegExp("^/"+this._hash),"/"));var a=function(e){return e.split(/\?(.*)?$/).slice(1).join("")}(e||this._cLoc()),l=h(s,this._useHash,this._hash);return!this._paused&&(this._lastRouteResolved&&l===this._lastRouteResolved.url&&a===this._lastRouteResolved.query?(this._lastRouteResolved.hooks&&this._lastRouteResolved.hooks.already&&this._lastRouteResolved.hooks.already(this._lastRouteResolved.params),!1):(o=r(l,this._routes))?(this._callLeave(),this._lastRouteResolved={url:l,query:a,hooks:o.route.hooks,params:o.params,name:o.route.name},n=o.route.handler,u(function(){u(function(){o.route.route instanceof RegExp?n.apply(void 0,o.match.slice(1,o.match.length)):n(o.params,a)},o.route.hooks,o.params,i._genericHooks)},this._genericHooks,o.params),o):this._defaultHandler&&(""===l||"/"===l||l===this._hash||function(e,n,o){if(t()&&!n)return!1;if(!e.match(o))return!1;var i=e.split(o);return i.length<2||""===i[1]}(l,this._useHash,this._hash))?(u(function(){u(function(){i._callLeave(),i._lastRouteResolved={url:l,query:a,hooks:i._defaultHandler.hooks},i._defaultHandler.handler(a)},i._defaultHandler.hooks)},this._genericHooks),!0):(this._notFoundHandler&&u(function(){u(function(){i._callLeave(),i._lastRouteResolved={url:l,query:a,hooks:i._notFoundHandler.hooks},i._notFoundHandler.handler(a)},i._notFoundHandler.hooks)},this._genericHooks),!1))},destroy:function(){this._routes=[],this._destroyed=!0,this._lastRouteResolved=null,this._genericHooks=null,clearTimeout(this._listeningInterval),"undefined"!=typeof window&&(window.removeEventListener("popstate",this._onLocationChange),window.removeEventListener("hashchange",this._onLocationChange))},updatePageLinks:function(){var e=this;"undefined"!=typeof document&&this._findLinks().forEach(function(t){t.hasListenerAttached||(t.addEventListener("click",function(n){if((n.ctrlKey||n.metaKey)&&"a"==n.target.tagName.toLowerCase())return!1;var o=e.getLinkPath(t);e._destroyed||(n.preventDefault(),e.navigate(o.replace(/\/+$/,"").replace(/^\/+/,"/")))}),t.hasListenerAttached=!0)})},generate:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=this._routes.reduce(function(n,o){var i;if(o.name===e)for(i in n=o.route,t)n=n.toString().replace(":"+i,t[i]);return n},"");return this._useHash?this._hash+n:n},link:function(e){return this._getRoot()+e},pause:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this._paused=e,this._historyAPIUpdateMethod=e?"replaceState":"pushState"},resume:function(){this.pause(!1)},historyAPIUpdateMethod:function(e){return void 0===e?this._historyAPIUpdateMethod:(this._historyAPIUpdateMethod=e,e)},disableIfAPINotAvailable:function(){t()||this.destroy()},lastRouteResolved:function(){return this._lastRouteResolved},getLinkPath:function(e){return e.getAttribute("href")},hooks:function(e){this._genericHooks=e},_add:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return"string"==typeof t&&(t=encodeURI(t)),this._routes.push("object"===(void 0===n?"undefined":e(n))?{route:t,handler:n.uses,name:n.as,hooks:o||n.hooks}:{route:t,handler:n,hooks:o}),this._add},_getRoot:function(){return null!==this.root?this.root:(this.root=a(this._cLoc().split("?")[0],this._routes),this.root)},_listen:function(){var e=this;if(this._usePushState)window.addEventListener("popstate",this._onLocationChange);else if("undefined"!=typeof window&&"onhashchange"in window)window.addEventListener("hashchange",this._onLocationChange);else{var t=this._cLoc(),n=void 0,o=void 0;(o=function(){n=e._cLoc(),t!==n&&(t=n,e.resolve()),e._listeningInterval=setTimeout(o,200)})()}},_cLoc:function(){return"undefined"!=typeof window?void 0!==window.__NAVIGO_WINDOW_LOCATION_MOCK__?window.__NAVIGO_WINDOW_LOCATION_MOCK__:o(window.location.href):""},_findLinks:function(){return[].slice.call(document.querySelectorAll("[data-navigo]"))},_onLocationChange:function(){this.resolve()},_callLeave:function(){var e=this._lastRouteResolved;e&&e.hooks&&e.hooks.leave&&e.hooks.leave(e.params)}},n.PARAMETER_REGEXP=/([:*])(\w+)/g,n.WILDCARD_REGEXP=/\*/g,n.REPLACE_VARIABLE_REGEXP="([^/]+)",n.REPLACE_WILDCARD="(?:.*)",n.FOLLOWED_BY_SLASH_REGEXP="(?:/$|$)",n.MATCH_REGEXP_FLAGS="",n});


},{}],2:[function(require,module,exports){
'use strict';

require('navigo');

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _product = require('./views/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($, Navigo) {

  console.log('I have 8 ' + _utils2.default.pluralize(8, 'dog', 'dogs'));

  // Test router
  var $mainContent = $('#MainContent');
  var root = window.location.origin;
  var useHash = false; // Defaults to: false
  var hash = '#!'; // Defaults to: '#'
  var firstRoute = true;
  var currentView = null;

  var viewContructors = {
    'product': _product2.default
  };

  var doPageChange = function doPageChange(url, type) {

    if (firstRoute) {
      if (viewContructors.hasOwnProperty(type)) {
        currentView = new viewContructors[type]($mainContent);
      }
      firstRoute = false;
      return;
    }

    // Kill the current view
    currentView && currentView.destroy && currentView.destroy();

    // Add a timeout to do a basic redirect to the url if the request takes longer than a few seconds
    var t = setTimeout(function () {
      window.location = url;
    }, 3000);

    $.get(url, function (response) {
      clearTimeout(t);
      var $html = $(response);
      var title = $html.filter('title').text();
      var $dom = $html.find('#MainContent .layout-main-content');

      $mainContent.find('.layout-main-content').replaceWith($dom);
      document.title = title;

      console.log('instantiate new view for ' + type);
      if (viewContructors.hasOwnProperty(type)) {
        currentView = new viewContructors[type]($mainContent);
      }

      $mainContent.imagesLoaded(function () {
        window.scrollTop = 0;
        $mainContent.removeClass('go-away');
      });
      console.log('after');
    });
  };

  var beforePageChange = function beforePageChange(done, params) {
    if (firstRoute) {
      // firstRoute = false;
      done();
      return;
    }
    $mainContent.addClass('go-away');
    setTimeout(function () {
      done();
    }, 500);
  };

  window.router = new Navigo(root, useHash, '#!');

  router.on('/products/:slug', function (params) {
    doPageChange('/products/' + params.slug, 'product');
  }).on('/collections/:slug', function (params, query) {
    console.log(params);
    console.log(query);
    var url = '/collections/' + params.slug;
    if (query) {
      url += '?' + query;
    }
    doPageChange(url, 'collection');
  });
  router.on('/cart', function (params) {
    doPageChange('/cart');
  }).on('/', function () {
    doPageChange('/', 'home');
  });

  router.notFound(function (params) {
    // called when there is path specified but
    // there is no route matching
    console.log(params);
  });

  router.resolve();

  $(document.body).on('click', 'a', function (e) {
    if (e.isDefaultPrevented()) return;
    e.preventDefault();
    router.navigate(e.currentTarget.getAttribute('href'));
  });
})(jQuery, Navigo);

},{"./utils":3,"./views/product":5,"navigo":1}],3:[function(require,module,exports){
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
  }
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseView = function () {
  function BaseView() {
    _classCallCheck(this, BaseView);
  }

  BaseView.prototype.create = function create() {
    console.log('calling create from the baseview');
  };

  BaseView.prototype.destroy = function destroy() {
    console.log('calling destroy from the baseview');
  };

  return BaseView;
}();

exports.default = BaseView;

},{}],5:[function(require,module,exports){
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

var ProductView = function (_BaseView) {
  _inherits(ProductView, _BaseView);

  function ProductView() {
    _classCallCheck(this, ProductView);

    return _possibleConstructorReturn(this, _BaseView.call(this));
  }

  ProductView.prototype.destroy = function destroy() {
    console.log('calling destroy from the product view');
  };

  return ProductView;
}(_base2.default);

exports.default = ProductView;

},{"./base":4}]},{},[2]);
