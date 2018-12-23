/**
 * Footer Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - footer
 */

theme.Footer = (function($) {

  var selectors = {

  };

  var classes = {

  };

  function Footer(container) {

    this.$container = $(container);

    this.name = 'footer';
    this.namespace = '.'+this.name;

  }

  Footer.prototype = $.extend({}, Footer.prototype, {

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      console.log('['+this.name+'] - section:select');
    },

    onShow: function() {
      console.log('['+this.name+'] - section:show');
    },

    onLoad: function() {
      console.log('['+this.name+'] - section::load');
    },

    onUnload: function() {
      console.log('['+this.name+'] - section::unload');
    }
  });

  return Footer;
})(jQuery);
