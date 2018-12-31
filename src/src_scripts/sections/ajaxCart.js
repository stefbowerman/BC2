import BaseSection from "./base";
import AJAXCart from '../ajaxCart';

/**
 * Ajax Cart Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the interacting with the ajax cart section.
 * All logic is handled in AjaxCart, this file is strictly for handling section settings and them editor interactions
 *
 * @namespace - ajaxCart
 */

var $body = $(document.body);

export default class AJAXCartSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'ajaxCart';
    this.namespace = `.${this.name}`;

    this.ajaxCart = new AJAXCart();

    this.ajaxCart.init();
  }

  onSelect() {
    this.ajaxCart.open();
  }

  onDeselect() {
    this.ajaxCart.close();
  }

  onUnload() {
    this.ajaxCart.$backdrop && this.ajaxCart.$backdrop.remove();
  }  
}
