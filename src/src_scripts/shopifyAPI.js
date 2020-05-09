export default {
 /**
  * AJAX submit an 'add to cart' form
  *
  * @param {jQuery} $form - jQuery instance of the form
  * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
  */
  addItemFromForm($form) {
    return this.add($form.serialize());
  },

 /**
  * AJAX add by variant ID
  *
  * @param {integer} id - Variant ID
  * @param {integer} qty - quantity
  * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
  */
  addVariant(id, quantity = 1) {
    return this.add({ quantity, id });
  },

 /**
  * AJAX add to cart
  *
  * @param {Object} data - Data object
  * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
  */
  add(data) {
    const promise = $.Deferred();

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/add.js',
      data: data,
      success: () => {
        this.getCart().then(response => promise.resolve(response));
      },
      error: function() {
        promise.reject({
          message: 'The quantity you entered is not available.'
        });
      }
    });

    return promise;
  },

 /**
  * AJAX change line item
  *
  * @param {Object} data - Data object
  * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
  */
  changeLineItem(data) {
    const promise = $.Deferred();

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/change.js',
      data: data,
      success: () => {
        this.getCart().then(response => promise.resolve(response));
      },
      error: function() {
        promise.reject({
          message: 'The quantity you entered is not available.'
        });
      }
    });

    return promise;
  },

 /**
  * AJAX update the cart's note, attributes, or line item quantities.
  *
  * @param {Object} data - Data object
  * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
  */
  update(data) {
    const promise = $.Deferred();
    
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/update.js',
      data: data,
      success: () => {
        this.getCart().then(response => promise.resolve(response));
      },
      error: function(err) {
        promise.reject({
          message: err
        });
      }      
    });

    return promise
  },

 /**
  * Retrieve a JSON respresentation of the users cart
  *
  * @return {Promise} - JSON cart
  */
  getCart() {
    const promise = $.Deferred();
    const url = `/cart${window.Shopify && window.Shopify.designMode ? '.js' : '?view=json'}`;
    
    $.ajax({
      type: 'get',
      url: url,
      success: (data) => promise.resolve(JSON.parse(data)),
      error: function() {
        promise.reject({
          message: 'Could not retrieve cart items'
        });
      }
    });

    return promise;
  }
};
