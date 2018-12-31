import BaseView from "./base";
import ProductSection from '../sections/product';

export default class ProductView extends BaseView {
  
  constructor($el) {
    super($el);

    this.productSection = new ProductSection($el.find('[data-section-type="product"]'));
  }

  destroy() {
    console.log('destroying product view');
    this.productSection.onSectionUnload();
    delete this.productSection;
  }

  transitionIn() {

  }

  transitionOut(callback) {
    // this.productSection.$container.css('transition', 'all 1000ms cubic-bezier(0.4, 0.08, 0, 1.02)');
    // this.productSection.$container.css('transform', 'translateY(5%)');
    // this.productSection.$container.css('opacity', '0');
    // setTimeout(callback, 400);
    callback();
  }
}