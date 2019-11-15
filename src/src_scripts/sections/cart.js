import BaseSection from './base';
import CartAPI from '../cartAPI';

const selectors = {
  form: '[data-cart-form]',
  itemRemoveLink: '[data-item-remove-link]'
};

const $window = $(window);

export default class CartSection extends BaseSection {
  constructor(container) {
    super(container, 'cart');

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
    window.location.href = '/checkout';

    return false;
  }

  onItemRemoveLinkClick(e) {
    e.preventDefault();
    const $link = $(e.currentTarget);

    this.$form.attr('disabled', true);
    this.$formSubmit.attr('disabled', true);
    this.$form.fadeTo(300, 0.5);

    CartAPI.changeLineItem({
      quantity: 0,
      id: $link.data('item-remove-link')
    })
      .then(cart => {
        const event = $.Event('needsUpdate.ajaxCart');
              event.cart = cart;

        $window.trigger(event); // Trigger a window event so that the ajax cart knows to update

        const wrapper = document.createElement('div')
        wrapper.innerHTML = cart.section_html

        const $newContainer = $(wrapper.children[0]);
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
