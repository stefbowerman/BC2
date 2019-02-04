import BaseSection from "./base";

const selectors = {
  form: '[data-cart-form]',
  itemRemoveLink: '[data-item-remove-link]',
  verifyModal: '[data-verify-modal]',
  verifyForm: '[data-verify-form]'
};

const classes = {

};

const $window = $(window);

export default class CartSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'cart';
    this.namespace = `.${this.name}`;

    this.setInstanceVars();
    this.bindEvents();
  }

  setInstanceVars() {
    this.cartIsVerified = false;
    this.userFormSubmitEvent = null;    
    this.$form = $(selectors.form, this.$container);
    this.$formSubmit = this.$form.find('input[type="submit"]');
    this.$verifyModal = $(selectors.verifyModal, this.$container);
    this.$verifyForm  = $(selectors.verifyForm, this.$container);
  }

  bindEvents(e) {
    this.$form.on('submit', this.onFormSubmit.bind(this));
    this.$verifyForm.on('submit', this.onVerifyFormSubmit.bind(this));
    this.$container.on('click', selectors.itemRemoveLink, this.onItemRemoveLinkClick.bind(this));
  }

  removeEvents(e) {
    this.$form.off('submit');
    this.$verifyForm.off('submit');
    this.$container.off('click', selectors.itemRemoveLink, this.onItemRemoveLinkClick);
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

  onItemRemoveLinkClick(e) {
    e.preventDefault();
    const $link = $(e.currentTarget);

    $.ajax({
      url: $link.attr('href'),
      beforeSend: () => {
        this.$form.attr('disabled', true);
        this.$formSubmit.attr('disabled', true);
        this.$form.fadeTo(300, 0.5);
      }
    })
    .done((response) => {
      
      // Trigger this ASAP since it runs an AJAX Call
      $window.trigger('needsUpdate.ajaxCart');

      const $responseHtml = $(document.createElement("html"));
      $responseHtml.get(0).innerHTML = response;

      const $responseBody = $responseHtml.find('body');
      const $newContainer = $responseBody.find('[data-section-type="cart"]');

      this.removeEvents();      
      this.$container.replaceWith($newContainer);
      this.$container = $newContainer;
      this.setInstanceVars();
      this.bindEvents();
      $window.scrollTop(0);
      this.$form.css('opacity', 0.5);
      this.$form.fadeTo(300, 1);
    });
  }
  
}