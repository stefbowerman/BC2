import BaseSection from './base';
import AJAXCart from '../ajaxCart';

/**
 * Ajax Cart Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the interacting with the ajax cart section.
 * All logic is handled in AjaxCart, this file is strictly for handling section settings and them editor interactions
 *
 * @namespace - ajaxCart
 */

export default class AJAXCartSection extends BaseSection {
  constructor(container) {
    super(container, 'ajaxCart');

    this.ajaxCart = new AJAXCart();

    this.ajaxCart.init({
      gwpVariantId: this.$container.data('gwp-variant'),
      gwpAmount: Number.parseFloat(this.$container.data('gwp-amount'))
    });
  }

  onSelect(e) {
    this.ajaxCart.open();
  }

  onDeselect(e) {
    this.ajaxCart.close();
  }

  onUnload(e) {
    this.ajaxCart.$backdrop && this.ajaxCart.$backdrop.remove();
  }
}
