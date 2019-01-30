import BaseSection from "./base";

const selectors = {
  form: '[data-cart-form]',
  verifyModal: '[data-verify-modal]',
  verifyForm: '[data-verify-form]'
};

const classes = {

};

export default class CartSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'cart';
    this.namespace = `.${this.name}`;

    this.cartIsVerified = false;
    this.userFormSubmitEvent = null;

    this.$form = $(selectors.form, this.$container);
    this.$formSubmit = this.$form.find('input[type="submit"]');
    this.$verifyModal = $(selectors.verifyModal, this.$container);
    this.$verifyForm  = $(selectors.verifyForm, this.$container);

    this.$form.on('submit', this.onFormSubmit.bind(this));
    this.$verifyForm.on('submit', this.onVerifyFormSubmit.bind(this));
  }

  onFormSubmit(e) {
    
    if(!this.cartIsVerified) {
      this.$verifyModal.modal('show');
      return false;
    }

    console.log('cart is verified, submit as normal');

    this.$formSubmit.val('Redirecting to Checkout..');
    this.$formSubmit.prop('disabled', true);
    window.location.href = "/checkout";

    return false;
  }

  onVerifyFormSubmit(e) {
    this.cartIsVerified = true;
    this.$verifyModal.one('hidden.bs.modal', () => { this.onFormSubmit(); });
    this.$verifyModal.modal('hide');
  }
  
}