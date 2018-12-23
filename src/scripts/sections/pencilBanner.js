/**
 * Pencil Banner Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the opening and closing of the banner
 *
 * @namespace - pencilBanner
 */

theme.PencilBanner = (function($) {

  var $window = $(window);

  var selectors = {
    close: '[data-pencil-banner-close]'
  };

  var classes = {

  };

  /**
   * Pencil Banner section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function PencilBanner(container) {
    this.$container = $(container);

    this.name = 'pencilBanner',
    this.namespace = '.'+this.name;

    this.events = {
      SHOW: 'show'   + this.namespace,
      CLOSE: 'close' + this.namespace
    };

    $(selectors.close).on('click', this.close.bind(this));
  }

  PencilBanner.prototype = $.extend({}, PencilBanner.prototype, {

    /**
     * Allows you to run specific code when viewing this section inside the theme editor for a more pleasant experience
     * To use, call this at the end of the constructor method
     */
    initForThemeEditor: function() {
     
      if(slate.utils.isThemeEditor()){
        // Hide the close button to make life simpler
        // $(selectors.close).hide();
      }
    },

    /**
     * STUB METHOD - You need to add implementation details
     * Call this to show the banner
     */
    show: function() {
      console.log('['+this.name+'] - open');
      $window.trigger( $.Event(this.events.SHOW) );
    },

    /**
     * STUB METHOD - You need to add implementation details
     * Call this to close the banner
     */
    close: function() {
      console.log('['+this.name+'] - close');
      $window.trigger( $.Event(this.events.CLOSE) );
    },

    onCloseClick: function(e){
      e.preventDefault();
      this.close();
    },

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

  return PencilBanner;
})(jQuery);
