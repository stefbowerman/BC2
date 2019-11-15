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

    this.$container.find(selectors.mainLazyImg).unveil(200, function() {
      const $img = $(this);
      $img.on('load', () => {
        $img.parents(selectors.gallery).addClass(classes.galleryLoaded);
      });
    });
  }
}
