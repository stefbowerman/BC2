/**
 * Product Card Scripts
 * -----------------------------------------------------------------------------
 * Handles any events associated with the product card html (see snippets/product-card.liquid)
 */

slate.productCard = (function() {

  var selectors = {
    el: '[data-product-card]',
    gallery: '[data-product-card-gallery]',
    mainLazyImg: '[data-product-card-main-lazy]',
    altLazyImg: '[data-product-card-alt-lazy]'
  };

  var classes = {
    mainLoaded: 'is-loaded',
    altLoaded: 'alt-loaded' // added to the product card once the alt image is loaded to avoid a flash of white while loading
  };
 
  var events = window.PointerEvent ? {
              end:   "pointerup",
              enter: "pointerenter",
              leave: "pointerleave"
            } : {
              end: "touchend",
              enter: "mouseenter",
              leave: "mouseleave"
            };

  function onEnter(e) {
    var $productCard = $(e.currentTarget);
    var $lazyImg = $productCard.find( selectors.altLazyImg );

    if($lazyImg.length) {
      $lazyImg.on('load', function() {
        $productCard.addClass(classes.altLoaded);
      });
      $lazyImg.attr('src', $lazyImg.data('src'));
      $lazyImg.removeAttr('data-src');
    }
  }

  $(document).ready(function() {

    var $productCards = $(selectors.el);

    if(!$productCards.length) {
      return;
    }

    $productCards.one(events.enter, onEnter);

    // Unveil plugin to lazy load main product card images
    $(selectors.mainLazyImg).unveil(200, function() {
      var $img = $(this);
      $img.on('load', function() {
        $img.parents(selectors.gallery).addClass(classes.mainLoaded);
      });
    });
  });

  

}());