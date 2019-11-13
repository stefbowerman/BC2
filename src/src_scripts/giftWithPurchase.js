export default class GiftWithPurchase {
  constructor(variantId, amount) {
    this.variantId = variantId;
    this.amount = amount;
  }

  isValid() {
    return !!(this.variantId && (!Number.isNaN(this.amount) && this.amount > 0))
  }

  qualifies(amount) {
    return amount >= this.amount
  }

  cartNeedsGift(cart) {
    let needs = false

    if(this.isValid() && this.qualifies(cart.total_price/100) && !this.cartContainsGift(cart)) {
      needs = true
    }

    return needs
  }

  cartContainsGift(cart) {
    let contains = false
    
    if(cart && cart.items && cart.items.length) {
      contains = (cart.items.findIndex(item => item.variant_id == this.variantId) > -1)
    }

    return contains
  }

  cartContainsGiftButDoesntQualify(cart) {
    return this.cartContainsGift(cart) && !this.qualifies(cart.total_price/100)
  }
}