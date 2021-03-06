import BaseView from './base';
import CartSection from '../sections/cart';

export default class CartView extends BaseView {
  constructor($el) {
    super($el);

    this.sections.push(new CartSection($el.find('[data-section-type="cart"]')));
  }
}
