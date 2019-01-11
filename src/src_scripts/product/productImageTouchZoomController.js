import IScroll from '../../../node_modules/iscroll/build/iscroll-zoom';

const selectors = {
  galleryImage: '[data-gallery-image]',
  blowup: '[data-blowup]',
  blowupScroll: '[data-blowup-scroll]',
  blowupImage: '[data-blowup-image]'  
};

const classes = {
  bodyBlowupOpen: 'blowup-open',
  blowupActive: 'is-active'
};

const $window = $(window);
const $body   = $(document.body);

export default class ProductImageTouchZoomController {
  
  /**
   * ProductImageTouchZoomController
   *
   * @constructor
   * @param {jQuery} $el - element containing all required elements
   */
  constructor($el) {
    this.name = 'productImageTouchZoomController';
    this.namespace = '.'+this.name;

    this.events = {
      CLICK:  'click'  + this.namespace
    };    

    this.enabled = false;
    this.isZoomed = false;
    this.iscrollInstance = undefined;

    this.$container = $el;

    if(!$el) {
      console.warn('['+this.name+'] - $el required to initialize');
      return;
    }

    this.$blowup       = $(selectors.blowup, this.$container);
    this.$blowupScroll = $(selectors.blowupScroll, this.$container);
    this.$blowupImage  = $(selectors.blowupImage, this.$container);    
  }

  enable() {
    if(this.enabled) return;

    this.$container.on(this.events.CLICK, selectors.galleryImage, this.onGalleryImageClick.bind(this));
    this.$container.on(this.events.CLICK, selectors.blowup, this.zoomOut.bind(this));

    this.enabled = true;
  }

  disable() {
    if(!this.enabled) return;

    this.$container.off(this.events.CLICK);

    this.enabled = false;
  }

  zoomIn(src) {
    if(this.isZoomed) return;

    // var $zoomImg  = $(new Image());
    var startZoom = 1.2;

    this.iscrollInstance = new IScroll(this.$blowupScroll.get(0), {
      zoom: true,
      hideScrollbar: true,
      scrollX: true,
      scrollY: true,
      zoomMin: 1,
      zoomMax: 2,
      startZoom: startZoom,
      directionLockThreshold: 20,
      tap: true,
      click: true
    });      

    this.$blowupImage.on('load', function() {
      var x = -1 * (((this.$blowupImage.outerWidth() * startZoom) - $window.width())/2);
      var y = -1 * (((this.$blowupImage.outerHeight() * startZoom) - $window.height())/2);
      this.iscrollInstance.scrollTo(x, y, 0);
    }.bind(this));

    // Set the smaller image immediately (it should already be loaded from the slideshow)
    this.$blowupImage.attr('src', src);   

    // if(zoomSrc) {
    //   $zoomImg.on('load', function() {
    //     this.$blowupImage.attr('src', zoomSrc);
    //   }.bind(this));
    //   $zoomImg.attr('src', zoomSrc);
    // }

    this.$blowup.addClass(classes.blowupActive);
    $body.addClass(classes.bodyBlowupOpen);
    this.isZoomed = true;
  }

  zoomOut() {
    if(!this.isZoomed) return;

    if(this.iscrollInstance instanceof IScroll) {
      this.iscrollInstance.destroy();
    }

    $body.removeClass(classes.bodyBlowupOpen);
    this.$blowup.removeClass(classes.blowupActive);
    this.$blowupImage.attr('src', '');
    this.isZoomed = false;
  }

  onGalleryImageClick(e) {
    e.preventDefault();
    this.zoomIn($(e.currentTarget).attr('src'));
  }
}
