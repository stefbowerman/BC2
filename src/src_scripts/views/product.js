import BaseView from "./base";
import ProductSection from '../sections/product';

export default class ProductView extends BaseView {
  
  constructor($el) {
    super($el);

    this.productSection = new ProductSection($el.find('[data-section-type="product"]'));

    this.sections.push(this.productSection);
  }

  transitionIn() {

  }

  transitionOut(callback) {
    if(this.productSection.drawer && this.productSection.drawer.stateIsOpen) {
      this.productSection.drawer.$el.one('hidden.drawer', callback);
      this.productSection.drawer.hide();
    }
    else {
      callback();  
    }
  }
}