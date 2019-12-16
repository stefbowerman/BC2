// import IScroll from '../../../node_modules/iscroll/build/iscroll-zoom';
import Panzoom from 'panzoom';
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
   * @param {Object} options
   */
  constructor($el, options) {
    this.name = 'productImageTouchZoomController';
    this.namespace = '.'+this.name;

    this.events = {
      CLICK: `click${this.namespace}`
    };

    const defaults = {
      onZoomIn: () => {},
      onZoomOut: () => {}
    };

    this.settings = $.extend({}, defaults, options);
    this.enabled = false;
    this.isZoomed = false;
    this.iscrollInstance = undefined;
    this.panZoomInstance = undefined;
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
    
    this.$blowupImage.one('load', () => {
      let startZoom;
      const startZoomRatio = 1.2; // Start by making the image 120% in the shortest direction
      const zoomMin = 0.4;
      const imageHeight = this.$blowupImage.outerHeight();
      const imageWidth = this.$blowupImage.outerHeight();
      const winHeight = $window.height();
      const winWidth = $window.width();

      // Landscape
      if (window.innerWidth > window.innerHeight) {
        startZoom = startZoomRatio * (winHeight/imageHeight);
      }
      // Portrait
      else {
        startZoom = startZoomRatio * (winWidth/imageWidth);
      }

      if (startZoom < zoomMin) {
        startZoom = zoomMin;
      }

      const startX = -1 * (((imageWidth * startZoom) - winWidth)/2);
      const startY = -1 * (((imageHeight * startZoom) - winHeight)/2);

      // this.iscrollInstance = new IScroll(this.$blowupScroll.get(0), {
      //   zoom: true,
      //   hideScrollbar: true,
      //   scrollX: true,
      //   scrollY: true,
      //   zoomMin: zoomMin,
      //   zoomMax: 1,
      //   startZoom: startZoom,
      //   startX: startX,
      //   startY: startY,
      //   directionLockThreshold: 20,
      //   tap: true,
      //   click: true
      // });

      this.panZoomInstance = new Panzoom(this.$blowupImage.get(0), {
        minZoom: 1,
        maxZoom: 2,
        filterKey: () => true // Ignore keyboard events
      }).zoomAbs(startX, startY, startZoom);

      this.$blowupImage.get(0).addEventListener('panzoomchange', (event) => {
        console.log('panzoomchange');
        console.log(event.detail) // => { x: 0, y: 0, scale: 1 }
      });
      this.$blowupImage.get(0).addEventListener('panzoomstart', (event) => {
        console.log('panzoomstart');
        console.log(event.detail) // => { x: 0, y: 0, scale: 1 }
      });
    });

    // Set the smaller image immediately (it should already be loaded from the slideshow)
    this.$blowupImage.attr('src', src);

    this.$blowup.addClass(classes.blowupActive);
    $body.addClass(classes.bodyBlowupOpen);
    this.$blowup.one(this.events.CLICK, this.zoomOut.bind(this));
    this.isZoomed = true;

    this.settings.onZoomIn();
  }

  zoomOut() {
    if (!this.isZoomed) return;

    $body.removeClass(classes.bodyBlowupOpen);
    this.$blowup.removeClass(classes.blowupActive);
    this.$blowup.one(this.transitionEndEvent, () => {
      // this.iscrollInstance && this.iscrollInstance.destroy();
      this.panZoomInstance && this.panZoomInstance.dispose();
      this.$blowupImage.attr('src', '');
      this.isZoomed = false;
    });

    this.settings.onZoomOut();
  }

  onGalleryImageClick(e) {
    e.preventDefault();
    this.zoomIn($(e.currentTarget).attr('src'));
  }
}
