import panzoom from 'panzoom';
import Utils from '../utils';

const selectors = {
  galleryImage: '[data-gallery-image]',
  blowup: '[data-blowup]',
  blowupImage: '[data-blowup-image]',
  blowupClose: '[data-blowup-close]'
};

const classes = {
  bodyBlowupOpen: 'blowup-open',
  blowupActive: 'is-active',
  blowupRevealed: 'is-revealed',
  blowupIsInteracting: 'is-interacting',
  blowupIsLeaving: 'is-leaving',
  blowupImageHidden: 'is-hidden'
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
    this.pzInstance = undefined;
    this.transitionEndEvent = Utils.whichTransitionEnd();
    this.orientationchangeCallback = this.onOrientationchange.bind(this);

    this.$container = $el;

    if (!$el) {
      console.warn('['+this.name+'] - $el required to initialize');
      return;
    }

    this.$blowup       = $(selectors.blowup, this.$container);
    this.$blowupImage  = $(selectors.blowupImage, this.$container);
    this.$blowupClose  = $(selectors.blowupClose, this.$container);
  }

  enable() {
    if (this.enabled) return;

    this.$container.on(this.events.CLICK, selectors.galleryImage, this.onGalleryImageClick.bind(this));
    this.$blowupClose.on(this.events.CLICK, this.zoomOut.bind(this));
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

  getInitialZoomAttributes() {
    let minZoom = 0.1;
    const maxZoom = 0.75; // Ensure that the image remains crisp
    const startZoomRatio = 1.5; // Start by making the image 150% of the screen dimension in the shortest direction
    const imageHeight = this.$blowupImage.outerHeight();
    const imageWidth = this.$blowupImage.outerWidth();
    const winHeight = $window.height();
    const winWidth = $window.width();

    // Landscape
    if (winWidth > winHeight) {
      minZoom = winHeight/imageHeight;
    }
    // Portrait
    else {
      minZoom = winWidth/imageWidth;
    }

    let startZoom = startZoomRatio * minZoom;

    if (startZoom > maxZoom) {
      startZoom = maxZoom;
    }

    const startX = Math.floor(-1 * (((imageWidth * startZoom) - winWidth)/2));
    const startY = Math.floor(-1 * (((imageHeight * startZoom) - winHeight)/2));

    return {
      minZoom,
      maxZoom,
      startZoom,
      startX,
      startY
    };
  }

  createPZInstance() {
    const attrs = this.getInitialZoomAttributes();

    this.pzInstance = panzoom(this.$blowupImage.get(0), {
      minZoom: attrs.minZoom,
      maxZoom: attrs.maxZoom,
      bounds: true,
      beforeWheel: () => false, // Ignore scroll
      filterKey: () => true // Ignore keyboard events
    });

    this.pzInstance.on('panstart', (e) => {
      this.$blowup.addClass(classes.blowupIsInteracting);
    });

    this.pzInstance.on('panend', (e) => {
      this.$blowup.removeClass(classes.blowupIsInteracting);
    });

    this.pzInstance.zoomAbs(0, 0, attrs.startZoom); // This doesn't seem to set the initial position correctly
    this.pzInstance.moveTo(attrs.startX, attrs.startY); // This does :-/
  }

  destroyPZInstance() {
    this.pzInstance && this.pzInstance.dispose();
    this.$blowupImage.attr('style', '');
    this.pzInstance = null;
  }

  zoomIn(src) {
    if (this.isZoomed) return;
    
    this.$blowupImage.one('load', this.createPZInstance.bind(this));

    // Set the smaller image immediately (it should already be loaded from the slideshow)
    this.$blowupImage.attr('src', src);

    setTimeout(() => {
      this.$blowup.addClass(classes.blowupRevealed);
    }, 1000);

    this.$blowup.addClass(classes.blowupActive);
    $body.addClass(classes.bodyBlowupOpen);

    this.isZoomed = true;

    this.settings.onZoomIn();
  }

  zoomOut() {
    if (!this.isZoomed) return;

    this.$blowup.addClass(classes.blowupIsLeaving);
    this.$blowup.removeClass(classes.blowupRevealed);

    // Transition end event wasn't happy
    // Timeout duration is based on the duration + delay of .blowup.is-leaving
    setTimeout(() => {
      const classesToRemove = [classes.blowupActive, classes.blowupIsInteracting, classes.blowupIsLeaving].join(' ');
      $body.removeClass(classes.bodyBlowupOpen);
      this.$blowup.removeClass(classesToRemove);
      this.destroyPZInstance();
      this.$blowupImage.attr('src', '');
      this.isZoomed = false;
      this.settings.onZoomOut();
    }, 700);
  }

  onGalleryImageClick(e) {
    e.preventDefault();
    this.zoomIn($(e.currentTarget).attr('src'));
  }

  onOrientationchange(e) {
    if (!(this.isZoomed && this.pzInstance)) return;

    // Kill the instance, hide the image briefly, create the instance and then display again
    this.destroyPZInstance();

    this.$blowupImage.addClass(classes.blowupImageHidden);
    this.$blowupImage.one(this.transitionEndEvent, () => {
      this.createPZInstance();
      this.$blowupImage.removeClass(classes.blowupImageHidden);
    });
  }
}
