/**
 * Mobile menu Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the mobile menu
 *
 * @namespace - mobileMenu
 */

theme.MobileMenu = (function($) {

  var selectors = {
    toggle: '[data-mobile-menu-toggle]',
    menu: '[data-mobile-menu]'
  };

  function MobileMenu(container) {
    this.$container = $(container);

    this.name = 'mobileMenu';
    this.namespace = '.'+this.name;

    this.$el     = $(selectors.menu, this.$container);
    this.$toggle = $(selectors.toggle); // Don't scope to this.$container

    this.drawer  = new slate.models.Drawer(this.$el);

    this.$toggle.on('click', this.onToggleClick.bind(this));

  }

  MobileMenu.prototype = $.extend({}, MobileMenu.prototype, {

    onToggleClick: function(e) {
      e.preventDefault();
      this.drawer.toggle();
    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      this.drawer.show();
    },

    onDeselect: function() {
      this.drawer.hide();
    },

    onUnload: function() {
      this.drawer.$backdrop && this.drawer.$backdrop.remove();
    },
  });

  return MobileMenu;
})(jQuery);
