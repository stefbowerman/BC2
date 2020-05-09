import BaseSection from './base';
import CartAPI from '../cartAPI';

const selectors = {
  form: '[data-cart-form]',
  itemRemoveLink: '[data-item-remove-link]',
  shippingNoticeCheckbox: '[data-shipping-notice-checkbox]'
};

const $window = $(window);

export default class CartSection extends BaseSection {
  constructor(container) {
    super(container, 'cart');

    this.formIsDisabled = this.$container.data('form-disabled');

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onItemRemoveLinkClick = this.onItemRemoveLinkClick.bind(this)
    this.onShippingNoticeCheckboxChange = this.onShippingNoticeCheckboxChange.bind(this)

    this.setInstanceVars();
    this.bindEvents();
  }

  setInstanceVars() {
    this.$form = $(selectors.form, this.$container);
    this.$formSubmit = this.$form.find('input[type="submit"]');
  }

  bindEvents(e) {
    this.$form.on('submit', this.onFormSubmit);
    this.$container.on('click', selectors.itemRemoveLink, this.onItemRemoveLinkClick);
    this.$container.on('change', selectors.shippingNoticeCheckbox, this.onShippingNoticeCheckboxChange);
  }

  removeEvents(e) {
    this.$form.off('submit');
    this.$container.off('click', selectors.itemRemoveLink, this.onItemRemoveLinkClick);
    this.$container.off('change', selectors.shippingNoticeCheckbox, this.onShippingNoticeCheckboxChange);
  }

  onFormSubmit(e) {
    if (this.formIsDisabled) return;

    this.$formSubmit.val('Redirecting to Checkout..');
    this.$formSubmit.prop('disabled', true);
    window.location.href = '/checkout';

    return false;
  }

  onItemRemoveLinkClick(e) {
    e.preventDefault();
    const $link = $(e.currentTarget);

    this.formIsDisabled = true
    this.$formSubmit.attr('disabled', true);
    this.$form.fadeTo(300, 0.5);

    CartAPI.changeLineItem({
      quantity: 0,
      id: $link.data('item-remove-link')
    })
      .then((cart) => {
        const event = $.Event('needsUpdate.ajaxCart');
        event.cart = cart;

        $window.trigger(event); // Trigger a window event so that the ajax cart knows to update

        const wrapper = document.createElement('div');
        wrapper.innerHTML = cart.section_html;

        const $newContainer = $(wrapper.children[0]);
        this.removeEvents();
        this.$container.replaceWith($newContainer);
        this.$container = $newContainer;
        this.setInstanceVars();
        this.bindEvents();
        $window.scrollTop(0);
        this.$form.css('opacity', 0.5);
        this.$form.fadeTo(300, 1);
        this.formIsDisabled = false
      });
  }

  onShippingNoticeCheckboxChange(e) {
    const $checkbox = $(e.currentTarget);
    const attr = $checkbox.attr('name')
    const checked = $checkbox.is(':checked');

    this.formIsDisabled = true
    this.$form.fadeTo(300, 0.5);

    CartAPI.update(`${attr}=${checked ? 'true' : ''}`)
      .then((cart) => {
        const disabled = !(cart.attributes['Shipping Notice Seen'] === 'true')

        this.formIsDisabled = disabled
        this.$formSubmit.attr('disabled', disabled);
        this.$form.fadeTo(200, 1);
      });
  }
}
