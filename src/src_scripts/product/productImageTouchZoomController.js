// import IScroll from '../../../node_modules/iscroll/build/iscroll-zoom';
import panzoom from 'panzoom';
import Utils from '../utils';

const selectors = {
  galleryImage: '[data-gallery-image]',
  blowup: '[data-blowup]',
  blowupScroll: '[data-blowup-scroll]',
  blowupImage: '[data-blowup-image]',
  blowupClose: '[data-blowup-close]'
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
    this.orientationchangeCallback = this.onOrientationchange.bind(this);

    this.$container = $el;

    if (!$el) {
      console.warn('['+this.name+'] - $el required to initialize');
      return;
    }

    this.$blowup       = $(selectors.blowup, this.$container);
    this.$blowupScroll = $(selectors.blowupScroll, this.$container);
    this.$blowupImage  = $(selectors.blowupImage, this.$container);
    this.$blowupClose  = $(selectors.blowupClose, this.$container);
  }

  enable() {
    if (this.enabled) return;

    this.$container.on(this.events.CLICK, selectors.galleryImage, this.onGalleryImageClick.bind(this));
    this.$blowupClose.on(this.events.CLICK, this.zoomOut.bind(this))
    $window.on('orientationchange', this.orientationchangeCallback);
    this.enabled = true;
  }

  disable() {
    if (!this.enabled) return;

    this.$container.off(this.events.CLICK);
    this.$blowupClose.off(this.events.CLICK);
    $window.off('orientationchange', this.orientationchangeCallback);
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

      console.log('creating panzoom instance');

      // Find biggest screen dimension (height vs. width)
      // Which ever one is larger, use that to define the min-zoom?

      const minZoom = window.innerWidth / this.$blowupImage.outerWidth();
      console.log(minZoom);

      this.panZoomInstance = panzoom(this.$blowupImage.get(0), {
        minZoom: minZoom,
        maxZoom: 1,
        bounds: true,
        onTouch: function(e) {
          // `e` - is current touch event.

          console.log(e);
          e.stopPropagation();
          e.preventDefault();

          return false; // tells the library to not preventDefault. Allows us to click and close?
        },
        filterKey: () => true // Ignore keyboard events
      });

      window.instance = this.panZoomInstance;

      const _startZoom = 1;
      const _startX = -1 * (((imageWidth * _startZoom) - winWidth)/2);
      const _startY = -1 * (((imageHeight * _startZoom) - winHeight)/2);

      // this.panZoomInstance.zoomAbs(startX, startY, startZoom);
      console.log(`move to ${_startX}, ${_startY}`)
      this.panZoomInstance.moveTo(_startX, _startY);

      this.panZoomInstance.on('panstart', function(e) {
        console.log('Fired when pan is just started ', e);
        // Note: e === instance.
      });

      this.panZoomInstance.on('pan', function(e) {
        console.log('Fired when the `element` is being panned', e);
      });

      this.panZoomInstance.on('panend', function(e) {
        console.log('Fired when pan ended', e);
      });

      this.panZoomInstance.on('zoom', function(e) {
        console.log('Fired when `element` is zoomed', e);
      });

      this.panZoomInstance.on('zoomend', function(e) {
        console.log('Fired when zoom animation ended', e);
      });

      // this.panZoomInstance.on('transform', function(e) {
      //   // This event will be called along with events above.
      //   console.log('Fired when any transformation has happened', e);
      // });
    });

    // Set the smaller image immediately (it should already be loaded from the slideshow)
    this.$blowupImage.attr('src', src);

    this.$blowup.addClass(classes.blowupActive);
    $body.addClass(classes.bodyBlowupOpen);
    // this.$blowup.one(this.events.CLICK, this.zoomOut.bind(this));
    // this.$blowupImage.one(this.events.CLICK, this.zoomOut.bind(this));
    this.$blowupImage.on('click', (e) => {
      console.log('onCLick');
    })
    this.isZoomed = true;

    this.settings.onZoomIn();
  }

  zoomOut() {
    console.log('zoomOut');
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

  onOrientationchange(e) {
    // console.log(e);
    // if (!this.isZoomed) return;
    // if (!this.panZoomInstance) return;

    // console.log(this.panZoomInstance.getTransform());

    // On orientation change, we need to reset the center point...I think?
  }
}
