const selectors = {
  gallery: '[data-gallery]',
  galleryImage: '[data-gallery-image]'
};

const classes = {
  isZoomed: 'is-zoomed'
};

export default class ProductImageDesktopZoomController {
  /**
   * ProductImageDesktopZoomController
   *
   * @constructor
   * @param {jQuery} $el - element containing all required elements
   */
  constructor($el, options) {
    this.name = 'productImageDesktopZoomController';
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

    this.$container = $el;

    if (!$el) {
      console.warn('['+this.name+'] - $el required to initialize');
      return;
    }

    this.$gallery       = $(selectors.gallery, this.$container);
    this.$galleryImages = $(selectors.galleryImage, this.$container);

    this.setCursors('in');
  }

  enable() {
    if (this.enabled) return;

    this.$gallery.on(this.events.CLICK, this.onGalleryClick.bind(this));
    this.setCursors('in');

    this.enabled = true;
  }

  disable() {
    if (!this.enabled) return;

    this.$gallery.off(this.events.CLICK, this.onGalleryClick.bind(this));
    this.setCursors();

    this.enabled = false;
  }

  zoomIn(src) {
    if (this.isZoomed) return;

    this.$gallery.addClass(classes.isZoomed);
    this.setCursors('out');
    this.isZoomed = true;

    this.settings.onZoomIn();
  }

  zoomOut() {
    if (!this.isZoomed) return;

    this.$gallery.removeClass(classes.isZoomed);

    this.setCursors('in');
    this.isZoomed = false;

    this.settings.onZoomOut();
  }

  setCursors(type) {
    const $images = this.$gallery.find('img');
    if (type === 'in') {
      $images.css('cursor', 'zoom-in');
    }
    else if (type === 'out') {
      $images.css('cursor', 'zoom-out');
    }
    else {
      $images.css('cursor', '');
    }
  }

  onGalleryClick(e) {
    e.preventDefault();
    this.isZoomed ? this.zoomOut() : this.zoomIn();
  }
}
