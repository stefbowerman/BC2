/**
 * Header Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - header
 */

theme.Header = (function($) {

  var $window = $(window);
  var $body   = $(document.body);

  var selectors = {
    header: '[data-header]'
  };

  var classes = {
    headerFixed: 'is-fixed'
  };

  function Header(container) {

    var _this = this;

    this.$container = $(container);
    this.$el = $(selectors.header, this.$container);
    this.name = 'header';
    this.namespace = '.'+this.name;

    setTimeout(function() {
      this.$el.find('.main-menu').addClass('is-visible');
    }.bind(this), 500);

  }

  Header.prototype = $.extend({}, Header.prototype, {

  });

  return Header;
})(jQuery);
