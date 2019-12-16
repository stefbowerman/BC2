import BaseSection from './base';

const selectors = {
  gallery: '[data-product-card-gallery]',
  mainLazyImg: '[data-product-card-main-lazy]'
};

const classes = {
  galleryLoaded: 'is-loaded'
};

export default class CollectionSection extends BaseSection {
  constructor(container) {
    super(container, 'collection');

    this.onLazyLoadedCallback = this.onLazyLoaded.bind(this);

    document.addEventListener('lazyloaded', this.onLazyLoadedCallback);
  }

  onUnload() {
    document.removeEventListener('lazyloaded', this.onLazyLoadedCallback);
  }

  onLazyLoaded(e) {
    const $img = $(e.target);

    if ($img.is(selectors.mainLazyImg)) {
      $img.parents(selectors.gallery).addClass(classes.galleryLoaded);
    }
  }
}
