/**
 * Product Card Scripts
 * -----------------------------------------------------------------------------
 * Handles any events associated with the product card html (see snippets/product-card.liquid)
 */

slate.productCard = (function() {

  var selectors = {
    el: '[data-product-card]',
    gallery: '[data-product-card-gallery]',
    mainLazyImg: '[data-product-card-main-lazy]'
  };

  var classes = {
    mainLoaded: 'is-loaded'
  };

  $(document).ready(function() {

    var $productCards = $(selectors.el);

    if(!$productCards.length) {
      return;
    }

    // Unveil plugin to lazy load main product card images
    $(selectors.mainLazyImg).unveil(200, function() {
      var $img = $(this);
      $img.on('load', function() {
        $img.parents(selectors.gallery).addClass(classes.mainLoaded);
      });
    });
  });

  

}());