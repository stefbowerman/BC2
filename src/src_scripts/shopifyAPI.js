export default {

 /**
  * AJAX submit an 'add to cart' form
  *
  * @param {jQuery} $form - jQuery instance of the form
  * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
  */
  addItemFromForm($form) {
    var promise = $.Deferred();
    var self = this;

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/add.js',
      data: $form.serialize(),
      success: function () {
        self.getCart().then(function (data) {
          promise.resolve(data);
        });
      },
      error: function () {
        promise.reject({
          message: 'The quantity you entered is not available.'
        });
      }
    });

    return promise;
  },

 /**
  * Retrieve a JSON respresentation of the users cart
  *
  * @return {Promise} - JSON cart
  */
  getCart() {
    let promise = $.Deferred();
    let url = '/cart?view=json';

    if(Shopify && Shopify.designMode) {
      url = '/cart.js';
    }
    
    $.ajax({
      type: 'get',
      url: url,
      success: function (data) {
        const cart = JSON.parse(data);
        promise.resolve(cart);
      },
      error: function () {
        promise.reject({
          message: 'Could not retrieve cart items'
        });
      }
    });

    return promise;
  },

 /**
  * Retrieve a JSON respresentation of the users cart
  *
  * @return {Promise} - JSON cart
  */
  getProduct(handle) {
    return $.getJSON('/products/' + handle + '.js');
  }, 

 /**
  * Change the quantity of an item in the users cart
  *
  * @param {int} line - Cart line
  * @param {int} qty - New quantity of the variant
  * @return {Promise} - JSON cart
  */
  changeLineItemQuantity(line, qty) {
    return $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/change.js',
      data: 'quantity=' + qty + '&line=' + line
    });
  }
}