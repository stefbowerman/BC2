const selectors = {
  gallery: '[data-gallery]',
  galleryImage: '[data-gallery-image]'
};

const classes = {
  isZoomed: 'is-zoomed'
};

const $window = $(window);
const $body   = $(document.body);

export default class ProductImageDesktopZoomController {
  
  /**
   * ProductImageDesktopZoomController
   *
   * @constructor
   * @param {jQuery} $el - element containing all required elements
   */
  constructor($el) {
    this.name = 'productImageDesktopZoomController';
    this.namespace = '.'+this.name;

    this.events = {
      CLICK:  'click'  + this.namespace
    };    

    this.enabled = false;
    this.isZoomed = false;

    this.$container = $el;

    if(!$el) {
      console.warn('['+this.name+'] - $el required to initialize');
      return;
    }

    this.$gallery = $(selectors.gallery, this.$container);
    this.$galleryImages = $(selectors.galleryImage, this.$container);

    this.setCursors('in');
  }

  enable() {
    if(this.enabled) return;

    this.$galleryImages.on(this.events.CLICK, this.onGalleryImageClick.bind(this));
    this.setCursors('in');

    this.enabled = true;
  }

  disable() {
    if(!this.enabled) return;

    this.$galleryImages.off(this.events.CLICK, this.onGalleryImageClick.bind(this));
    this.setCursors();

    this.enabled = false;
  }

  zoomIn(src) {
    if(this.isZoomed) return;

    this.$gallery.addClass(classes.isZoomed);
    this.setCursors('out');
    this.isZoomed = true;
  }

  zoomOut() {
    if(!this.isZoomed) return;

    this.$gallery.removeClass(classes.isZoomed);
    this.setCursors('in');
    this.isZoomed = false;
  }

  setCursors(type) {
    const $images = this.$gallery.find('img');
    if(type == 'in') {
      $images.css('cursor', 'zoom-in');
    }
    else if(type == 'out') {
      $images.css('cursor', 'zoom-out');
    }
    else {
      $images.css('cursor', '');
    }
  }

  onGalleryImageClick(e) {
    e.preventDefault();
    this.isZoomed ? this.zoomOut() : this.zoomIn();
  }
}
