import BaseSection from "./base";

const selectors = {
  form: '[data-cart-form]',
  itemQtySelect: '[data-item-quantity-select]'
};

const classes = {

};

export default class CartSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'cart';
    this.namespace = `.${this.name}`;

    const $form = $(selectors.form, this.$container);

    // Since we have more than 1 quantity select per row (1 for mobile, 1 for desktop)
    // We need to use single input per row, which is responsible for sending the form data for that line item
    // Watch for changes on the quantity selects, and then update the input.  These two are tied together using a data attribute
    this.$container.on('change', selectors.itemQtySelect, function(){
      var $itemQtyInput = $('[id="' + $(this).data('item-quantity-select') + '"]'); // Have to do '[id=".."]' instead of '#id' because id is generated using {{ item.key }} which has semi-colons in it - breaks normal id select
      $itemQtyInput.val($(this).val());
      $form.submit();
    });     
  }
  
}