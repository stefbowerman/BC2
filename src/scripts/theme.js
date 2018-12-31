window.slate = window.slate || {};
window.theme = window.theme || {};
window.views = window.views || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js
// =require slate/ajaxMailChimpForm.js
// =require slate/animations.js
// =require slate/user.js
// =require slate/breakpoints.js
// =require slate/productCard.js
// =require slate/productDetailForm.js
// =require slate/quantityAdjuster.js
// =require slate/forms.js

// =require slate/models/drawer.js
// =require slate/models/slideshow.js
// =require slate/models/slideup.js
// =require slate/models/overlay.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js
// =require templates/page-styles.js
// =require templates/page-components.js

(function($) {

  var $window       = $(window);
  var $document     = $(document);
  var $body         = $(document.body);

  $(document).ready(function() {

    $('.in-page-link').on('click', function(evt) {
      slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
    });

    // Common a11y fixes
    slate.a11y.pageLinkFocus($(window.location.hash));    

    // Target tables to make them scrollable
    slate.rte.wrapTables({
      $tables: $('.rte table'),
      tableWrapperClass: 'table-responsive'
    });

    // Target iframes to make them responsive
    var iframeSelectors =
      '.rte iframe[src*="youtube.com/embed"],' +
      '.rte iframe[src*="player.vimeo"]';

    slate.rte.wrapIframe({
      $iframes: $(iframeSelectors),
      iframeWrapperClass: 'rte__video-wrapper'
    });

    // Form event handling / validation
    slate.forms.initialize();

  });

}(jQuery));
