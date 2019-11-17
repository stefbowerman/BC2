import ShopifyAPI from './shopifyAPI';
import Currency from './currency';
import { getSizedImageUrl } from './images';
import GiftWithPurchase from './giftWithPurchase';

// Proxy to the shopify AJAX API calls 
// Intercept because we need to handle logic around GWP
// and fixing the cart
class CartAPI {
  constructor() {
    this.giftWithPurchase = new GiftWithPurchase(window.GWP);
  }

  _onRequestDone(cart, promise) {
    // "On request done" means we made an alteration to the cart
    // so now is a good time to check if the gift with purchase applies, needs to be added, removed
    // or none of the above

    const gwpCartData = this.giftWithPurchase.getCartData(cart);

    // If the cart needs the gift, make one more request and *then* resolve
    if (gwpCartData.needsGift) {
      ShopifyAPI.addVariant(this.giftWithPurchase.id, 1).then(c => {
        promise.resolve(this.fixCart(c))
      });
    }
    // If we ended up with more than one gift in the cart, fix it and *then* resolve
    else if (gwpCartData.qualifiesButHasMultipleGifts) {
      ShopifyAPI.changeLineItem({ id: this.giftWithPurchase.id, quantity: 1 }).then(c => {
        promise.resolve(this.fixCart(c))
      });
    }
    // If the cart has a gift in it but it shouldn't..
    else if (gwpCartData.containsGiftButDoesntQualify) {
      ShopifyAPI.changeLineItem({ id: this.giftWithPurchase.id, quantity: 0 }).then(c => {
        promise.resolve(this.fixCart(c))
      });
    }
    else {
      promise.resolve(this.fixCart(cart));
    }
  }

  getCart() {
    const promise = $.Deferred();

    ShopifyAPI.getCart()
      .done(cart => {
        this._onRequestDone(cart, promise);
      })
      .fail(data => {
        promise.reject(data);
      });

    return promise;
  }

  addItemFromForm($form) {
    const promise = $.Deferred();
    
    ShopifyAPI.addItemFromForm($form)
      .done(cart => {
        this._onRequestDone(cart, promise);
      })
      .fail(data => {
        promise.reject(data);
      });

    return promise;
  }

  changeLineItem(data) {
    const promise = $.Deferred();

    ShopifyAPI.changeLineItem(data)
      .done(cart => {
        this._onRequestDone(cart, promise);
      })
      .fail(response => {
        promise.reject(response);
      });

    return promise;
  }

 /**
  * Modifies the JSON cart for consumption by our handlebars template
  *
  * @param {object} cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
  * @return {object} - fixed up cart
  */
  fixCart(cart) {
    cart.total_price = Currency.formatMoney(cart.total_price, theme.moneyFormat);
    cart.total_price = Currency.stripZeroCents(cart.total_price);
    cart.has_unavailable_items = false;

    let gwpIndex = -1;

    cart.items.map((item, index) => {
      item.image        = getSizedImageUrl(item.image, '250x'); // If you update this, update the value corresponding value in product-detail-form-gallery.liquid
      item.line_price   = Currency.formatMoney(item.line_price, theme.moneyFormat);
      item.line_price   = Currency.stripZeroCents(item.line_price);
      item.unavailable  = !item.available;
      item.has_multiple = (item.quantity > 1);

      if (item.unavailable) {
        cart.has_unavailable_items = true;
      }

      const product = item.product;

      // Adjust the item's variant options to add "name" and "value" properties
      if (product) {
        for (let i = item.variant_options.length - 1; i >= 0; i--) {
          const name  = product.options[i];
          const value = item.variant_options[i];

          item.variant_options[i] = { name, value };

          // Don't show this info if it's the default variant that Shopify creates
          if (value === 'Default Title') {
            delete item.variant_options[i];
          }
        }
        
        item.url = `/products/${product.handle}`;
      }
      else {
        delete item.variant_options; // skip it and use the variant title instead
      }

      if (item.id === this.giftWithPurchase.id) {
        gwpIndex = index
      }

      return item;
    });

    // GWP check
    if (gwpIndex > -1) {
      cart.items = cart.items.filter(item => item.id !== this.giftWithPurchase.id)

      // Update the item count now that the cart.items array has been modified
      cart.item_count = cart.items.reduce((count, item) => count + item.quantity, 0)
    }

    return cart
  }
}

export default new CartAPI()
