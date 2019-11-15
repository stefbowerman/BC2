export default class GiftWithPurchase {
  constructor(settings = {}) {
    this.id = settings.id;
    this.amount = settings.amount;
  }

  isValid() {
    return !!(this.id && (!Number.isNaN(this.amount) && this.amount > 0));
  }

  qualifies(amount) {
    return amount >= this.amount;
  }

  cartNeedsGift(cart) {
    let needs = false;

    if (this.isValid() && this.qualifies(cart.total_price/100) && !this.cartContainsGift(cart)) {
      needs = true;
    }

    return needs;
  }

  // Retrieves the quantity of gifts in the cart
  cartGetGiftQuantity(cart) {
    let quantity = 0;
    
    if (cart && cart.items && cart.items.length) {
      for (let i = cart.items.length - 1; i >= 0; i--) {
        if (cart.items[i].id === this.id) {
          quantity += cart.items[i].quantity;
        }
      }
    }

    return quantity;
  }

  cartHasMultipleGifts(cart) {
    return this.cartGetGiftQuantity(cart) > 1;
  }

  cartContainsGift(cart) {
    return this.cartGetGiftQuantity(cart) > 0;
  }

  cartQualifiesButHasMultipleGifts(cart) {
    return this.qualifies(cart.total_price/100) && this.cartHasMultipleGifts(cart);
  }

  cartContainsGiftButDoesntQualify(cart) {
    return this.cartContainsGift(cart) && !this.qualifies(cart.total_price/100);
  }
}
