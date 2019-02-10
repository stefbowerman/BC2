import BaseSection from "./base";

const selectors = {
  form: '[data-cart-form]',
  itemRemoveLink: '[data-item-remove-link]'
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
    this.$form = $(selectors.form, this.$container);
    this.$formSubmit = this.$form.find('input[type="submit"]');
  }

  bindEvents(e) {
    this.$form.on('submit', this.onFormSubmit.bind(this));
    this.$container.on('click', selectors.itemRemoveLink, this.onItemRemoveLinkClick.bind(this));
  }

  removeEvents(e) {
    this.$form.off('submit');
    this.$container.off('click', selectors.itemRemoveLink, this.onItemRemoveLinkClick);
  }

  onFormSubmit(e) {

    this.$formSubmit.val('Redirecting to Checkout..');
    this.$formSubmit.prop('disabled', true);
    window.location.href = "/checkout";

    return false;
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