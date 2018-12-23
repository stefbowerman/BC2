/**
 * Slideshow Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - Slideshow
 */

theme.Slideshow = (function($) {

  var selectors = {
    slideshow: '[data-slideshow]',
  };

  var classes = {

  };
  
  /**
   * Slideshow section constructor
   *
   * @param {string} container - selector for the section container DOM element
   */
  function Slideshow(container) {
    this.$container = $(container);

    this.name = 'slideshow';
    this.namespace = '.'+this.name;

    var settings = {
      // Put your settings here
    };

    this.slideshow = new slate.models.Slideshow( $(selectors.slideshow, this.$container), settings);

  }

  Slideshow.prototype = $.extend({}, Slideshow.prototype, {
    /**
     * Theme Editor section events below
     */
    onBlockSelect: function(evt) {
      this.slideshow.goToSlideByBlockId( evt.detail.blockId );
      this.slideshow.pause();
    }
  });

  return Slideshow;
})(jQuery);
