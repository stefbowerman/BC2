import BaseSection from "./base";

const selectors = {
  gallery: '[data-product-card-gallery]',
  mainLazyImg: '[data-product-card-main-lazy]'
};

var classes = {
  galleryLoaded: 'is-loaded'
};

export default class CollectionSection extends BaseSection {

  constructor(container) {
    super(container);
    this.name = 'collection';
    this.namespace = `.${this.name}`;

    this.$container.find(selectors.mainLazyImg).unveil(200, function() {
      const $img = $(this);
      $img.on('load', function() {
        $img.parents(selectors.gallery).addClass(classes.galleryLoaded);
      });
    });
  }
  
}