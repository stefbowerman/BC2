import IScroll from '../../../node_modules/iscroll/build/iscroll-zoom';
import Utils from '../utils';

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
    this.transitionEndEvent = Utils.whichTransitionEnd();

    this.$container = $el;

    if (!$el) {
      console.warn('['+this.name+'] - $el required to initialize');
      return;
    }

    this.$blowup       = $(selectors.blowup, this.$container);
    this.$blowupScroll = $(selectors.blowupScroll, this.$container);
    this.$blowupImage  = $(selectors.blowupImage, this.$container);    
  }

  enable() {
    if (this.enabled) return;

    this.$container.on(this.events.CLICK, selectors.galleryImage, this.onGalleryImageClick.bind(this));
    this.enabled = true;
  }

  disable() {
    if (!this.enabled) return;

    this.$container.off(this.events.CLICK);
    this.enabled = false;
  }

  zoomIn(src) {
    if (this.isZoomed) return;
    
    this.$blowupImage.one('load', function() {

      var startZoom;
      var startZoomRatio = 1.2; // Start by making the image 120% in the shortest direction
      var zoomMin = 0.4;
      var imageHeight = this.$blowupImage.outerHeight();
      var imageWidth = this.$blowupImage.outerHeight();
      var winHeight = $window.height();
      var winWidth = $window.width();

      // Landscape
      if (window.innerWidth > window.innerHeight) {
        startZoom = startZoomRatio * winHeight/imageHeight;
      }
      // Portrait
      else {
        startZoom = startZoomRatio * winWidth/imageWidth;
      }

      if (startZoom < zoomMin) {
        startZoom = zoomMin;
      }

      var startX = -1 * (((imageWidth * startZoom) - winWidth)/2);
      var startY = -1 * (((imageHeight * startZoom) - winHeight)/2);

      this.iscrollInstance = new IScroll(this.$blowupScroll.get(0), {
        zoom: true,
        hideScrollbar: true,
        scrollX: true,
        scrollY: true,
        zoomMin: zoomMin,
        zoomMax: 1,
        startZoom: startZoom,
        startX: startX,
        startY: startY,
        directionLockThreshold: 20,
        tap: true,
        click: true
      }); 


    }.bind(this));

    // Set the smaller image immediately (it should already be loaded from the slideshow)
    this.$blowupImage.attr('src', src);   

    this.$blowup.addClass(classes.blowupActive);
    $body.addClass(classes.bodyBlowupOpen);
    this.$blowup.one(this.events.CLICK, this.zoomOut.bind(this));
    this.isZoomed = true;
  }

  zoomOut() {
    if (!this.isZoomed) return;

    $body.removeClass(classes.bodyBlowupOpen);
    this.$blowup.removeClass(classes.blowupActive);
    this.$blowup.one(this.transitionEndEvent, () => {
      this.iscrollInstance && this.iscrollInstance.destroy();
      this.$blowupImage.attr('src', '');
      this.isZoomed = false;      
    });
  }

  onGalleryImageClick(e) {
    e.preventDefault();
    this.zoomIn($(e.currentTarget).attr('src'));
  }
}
