/* eslint-disable */

export default {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance(array, key, value) {
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
  removeInstance(array, key, value) {
    var i = array.length;
    while(i--) {
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
  compact(array) {
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
  defaultTo(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value;
  },

  /**
   * Constructs an object of key / value pairs out of the parameters of the query string
   *
   * @return {Object}
   */
  getQueryParams() {
    var queryString = location.search && location.search.substr(1) || '';
    var queryParams = {};

    queryString
      .split('&')
      .filter(function (element) {
        return element.length;
      })
      .forEach(function (paramValue) {
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
  getQueryString() {
    var queryString = location.search && location.search.substr(1) || '';

    // Add the '?' prefix if there is an actual query
    if (queryString.length){
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
  getUrlWithUpdatedQueryStringParameter(key, value, uri) {

    uri = uri || window.location.href;

    // remove the hash part before operating on the uri
    var i = uri.indexOf('#');
    var hash = i === -1 ? ''  : uri.substr(i);
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
  getUrlWithRemovedQueryStringParameter(parameterKeyToRemove, uri) {
    uri = uri || window.location.href;

    var rtn = uri.split("?")[0],
        param,
        params_arr = [],
        queryString = (uri.indexOf("?") !== -1) ? uri.split("?")[1] : "";

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
  isThemeEditor() {
    return location.href.match(/myshopify.com/) !== null && location.href.match(/theme_id/) !== null;
  },

  /**
   * Get the name of the correct 'transitionend' event for the browser we're in
   *
   * @return {string}
   */
  whichTransitionEnd() {
    const el = document.createElement('fakeelement');
    const transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    let which = transitions['transition'];

    // Some browsers fire prefixed AND unprefixed versions
    // Make sure it *doesn't* support the unprefixed version first
    Object.keys(transitions).forEach((key) => {
      if (el.style['transition'] === undefined && el.style[key] !== undefined){
        which = transitions[key];
      }
    });

    return which
  },

  /**
   * Adds user agent classes to the document to target specific browsers
   *
   */
  userAgentBodyClass() {
    var ua = navigator.userAgent,
        d = document.documentElement,
        classes = d.className,
        matches;

    // Detect iOS (needed to disable zoom on form elements)
    // http://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
    if ( /iPad|iPhone|iPod/.test(ua) && !window.MSStream ) {
      classes += ' ua-ios';

      // Add class for version of iOS
      matches = ua.match(/((\d+_?){2,3})\slike\sMac\sOS\sX/);
      if ( matches ) {
        classes += ' ua-ios-' + matches[1];// e.g. ua-ios-7_0_2
      }

      // Add class for Twitter app
      if ( /Twitter/.test(ua) ) {
        classes += ' ua-ios-twitter';
      }

      // Add class for Chrome browser
      if ( /CriOS/.test(ua) ) {
        classes += ' ua-ios-chrome';
      }
    }

    // Detect Android (needed to disable print links on old devices)
    // http://www.ainixon.me/how-to-detect-android-version-using-js/
    if ( /Android/.test(ua) ) {
      matches = ua.match(/Android\s([0-9\.]*)/);
      classes += matches ? ' ua-aos ua-aos-' + matches[1].replace(/\./g,'_') : ' ua-aos';
    }

    // Detect webOS (needed to disable optimizeLegibility)
    if ( /webOS|hpwOS/.test(ua) ) {
      classes += ' ua-webos';
    }

    // Detect Samsung Internet browser
    if ( /SamsungBrowser/.test(ua) ) {
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
  hashFromString(string) {
    var hash = 0, i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },

  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
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
  pluralize(number, singular, plural)  {
    let output = '';

    number = parseInt(number);

    if (number == 1) {
      output = singular;
    }
    else {
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
  isExternal(url) {
    const match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{ "http:":80, "https:":443 }[location.protocol]+")?$"), "") !== location.host) return true;
    return false;
  }
}