views.ProductView = (function($, slate) {

  var selectors = {

  };

  var classes = {

  };
  
  var $window   = $(window);
  var $document = $(document);

  function ProductView($container) {

    this.name = 'productView';
    this.namespace = '.'+this.name;

    this.$container = $container;
    this.productDetailForm = new slate.ProductDetailForm({
      $el: this.$container,
      $container: this.$container,
      enableHistoryState: true
    });

    this.productDetailForm.initialize();

    console.log('created new product view');
  }

  ProductView.prototype = $.extend({}, ProductView.prototype, {
    destroy: function() {
      console.log('['+this.name+'] - destroy view');
    }
  });

  return ProductView;
})(jQuery, slate);
