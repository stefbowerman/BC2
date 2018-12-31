/**
 * Ajax Cart Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the interacting with the ajax cart section.
 * All logic is handled in slate.AjaxCart, this file is strictly for handling section settings and them editor interactions
 *
 * @namespace - ajaxCart
 */

theme.AjaxCart = (function($) {

  var $body = $(document.body);

  /**
   * AjaxCart section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function AjaxCart(container) {
    this.$container = $(container);

    this.name = 'ajaxCart',
    this.namespace = '.'+this.name;

    this.ajaxCart = new slate.AjaxCart();

    if (!$body.hasClass('template-cart')) {
      this.ajaxCart.init();      
    }
  }

  AjaxCart.prototype = $.extend({}, AjaxCart.prototype, {

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      this.ajaxCart.open();
    },

    onDeselect: function() {
      this.ajaxCart.close();
    },

    onShow: function() {

    },

    onLoad: function() {

    },

    onUnload: function() {
      this.ajaxCart.$backdrop && this.ajaxCart.$backdrop.remove();
    }
  });

  return AjaxCart;
})(jQuery);
