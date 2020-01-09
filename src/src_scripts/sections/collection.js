import BaseSection from './base';
import * as Breakpoints from '../breakpoints';

const selectors = {
  productCard: '[data-product-card]',
  prefetchLazyLink: 'link[rel="prefetch"][data-href]',
  gallery: '[data-product-card-gallery]',
  mainLazyImg: '[data-product-card-main-lazy]'
};

const classes = {
  galleryLoaded: 'is-loaded',
  productCardSoldOut: 'product-card--sold-out'
};

const $document = $(document);

export default class CollectionSection extends BaseSection {
  constructor(container) {
    super(container, 'collection');

    this.onLazyLoadedCallback = this.onLazyLoaded.bind(this);
    this.productCardMouseoverTimeout = null;
    this.prefetchMinBrowserWidth = Breakpoints.getBreakpointMinWidth('lg');

    this.$productCards = $(selectors.productCard, this.$container);

    this.$productCards.on('mouseenter', this.onProductCardMouseenter.bind(this));
    this.$productCards.on('mouseleave', this.onProductCardMouseleave.bind(this));
    $document.on('lazyloaded', this.onLazyLoadedCallback);
  }

  onUnload() {
    $document.off('lazyloaded', this.onLazyLoadedCallback);
  }

  onLazyLoaded(e) {
    const $img = $(e.target);

    if ($img.is(selectors.mainLazyImg)) {
      $img.parents(selectors.gallery).addClass(classes.galleryLoaded);
    }
  }

  onProductCardMouseenter(e) {
    const $card = $(e.currentTarget);
    const $prefetchLazyLink = $card.find(selectors.prefetchLazyLink);

    // Don't prefetch if we're on a small screen
    // Or if the product is sold out (we're prefetching to make the *buying* experience better)
    if ($prefetchLazyLink.length === 0 || $card.hasClass(classes.productCardSoldOut) || Breakpoints.getWidth() < this.prefetchMinBrowserWidth) return;

    this.productCardMouseoverTimeout = setTimeout(() => {
      $prefetchLazyLink.attr('href', $prefetchLazyLink.data('href'));
      $prefetchLazyLink.removeAttr('data-href');
    }, 500); // Need to hover over for at least this long before prefetching
  }

  onProductCardMouseleave(e) {
    clearTimeout(this.productCardMouseoverTimeout);
  }
}
