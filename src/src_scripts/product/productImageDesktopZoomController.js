const selectors = {
  gallery: '[data-gallery]',
  galleryImage: '[data-gallery-image]'
};

const classes = {
  isZoomed: 'is-zoomed',
  cursor: 'product-gallery__cursor',
  cursorVisible: 'is-visible'
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
      CLICK:      'click' + this.namespace,
      MOUSEENTER: 'mouseenter' + this.namespace,
      MOUSELEAVE: 'mouseleave' + this.namespace,
      MOUSEMOVE:  'mousemove' + this.namespace
    };    

    this.enabled = false;
    this.isZoomed = false;
    this.isTouch = Modernizr && Modernizr.touchevents;

    this.$container = $el;

    if(!$el) {
      console.warn('['+this.name+'] - $el required to initialize');
      return;
    }

    this.$gallery       = $(selectors.gallery, this.$container);
    this.$galleryImages = $(selectors.galleryImage, this.$container);
    this.$cursor        = $(document.createElement('div')).addClass(classes.cursor);

    // this.setCursors('in');
  }

  enable() {
    if(this.enabled) return;

    this.$gallery.on(this.events.CLICK, this.onGalleryClick.bind(this));

    if(!this.isTouch) {
      this.$gallery.append(this.$cursor);
      this.$gallery.on(this.events.MOUSEENTER, this.onGalleryMouseenter.bind(this));
      this.$gallery.on(this.events.MOUSEMOVE, this.onGalleryMousemove.bind(this));  
      this.$gallery.on(this.events.MOUSELEAVE, this.onGalleryMouseleave.bind(this));
    }

    // this.setCursors('in');

    this.enabled = true;
  }

  disable() {
    if(!this.enabled) return;

    this.$gallery.off(this.events.CLICK, this.onGalleryClick.bind(this));
    this.$gallery.off(this.events.MOUSEENTER, this.onGalleryMouseenter.bind(this));
    this.$gallery.off(this.events.MOUSEMOVE, this.onGalleryMousemove.bind(this));
    this.$gallery.off(this.events.MOUSELEAVE, this.onGalleryMouseleave.bind(this));

    this.$cursor.remove();

    this.enabled = false;
  }

  zoomIn(src) {
    if(this.isZoomed) return;

    this.$gallery.addClass(classes.isZoomed);
    // this.setCursors('out');
    this.isZoomed = true;
  }

  zoomOut() {
    if(!this.isZoomed) return;

    this.$gallery.removeClass(classes.isZoomed);

    console.log('TODO - place cursor at the bottom of the gallery if you zoom out and its too far below');
    // if(this.$cursor.offset()['top'] > (this.$gallery.outerHeight() - this.$cursor.outerHeight())) {
    // }

    // this.setCursors('in');
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

  onGalleryMouseenter(e) {
    this.$cursor.addClass(classes.cursorVisible);
  }

  onGalleryMouseleave(e) {
    this.$cursor.removeClass(classes.cursorVisible);
  }

  onGalleryMousemove(e) {
    var off = this.$gallery.offset();
    var x = e.clientX; // Math.floor(e.pageX - off.left);
    var y = Math.floor(e.pageY - off.top);    
    window.requestAnimationFrame(function() {
      this.$cursor.css({
        'transform': 'translate(' + x + 'px, ' + y + 'px)'
      });
    }.bind(this));
  }

  onGalleryClick(e) {
    e.preventDefault();
    this.isZoomed ? this.zoomOut() : this.zoomIn();
  }
}
