export default class GiftWithPurchase {
  constructor(settings = {}) {
    this.id = settings.id;
    this.amount = settings.amount;
  }

  // Checks the validity of the gift based on the settings passed into the contructor
  isValid() {
    return !!(this.id && (!Number.isNaN(this.amount) && this.amount > 0));
  }

  // Checks if the value passed in qualifies for the gift
  qualifies(amount) {
    return amount >= this.amount;
  }

  getCartData(cart) {
    let giftQuantity = 0;

    if (cart && cart.items && cart.items.length) {
      for (let i = cart.items.length - 1; i >= 0; i--) {
        if (cart.items[i].id === this.id) {
          giftQuantity += cart.items[i].quantity;
        }
      }
    }
    
    const qualifies = this.qualifies(cart.total_price/100);
    const containsGift = giftQuantity > 0;
    const needsGift = (this.isValid() && qualifies && !containsGift);
    const hasMultipleGifts = giftQuantity > 1;
    const qualifiesButHasMultipleGifts = (qualifies && hasMultipleGifts);
    const containsGiftButDoesntQualify = (containsGift && !qualifies)

    return {
      needsGift,
      giftQuantity,
      containsGift,
      hasMultipleGifts,
      qualifiesButHasMultipleGifts,
      containsGiftButDoesntQualify
    };
  }
}
