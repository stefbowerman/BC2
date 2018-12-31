import BaseSection from "./base";
import ProductDetailForm from '../product/productDetailForm';

export default class ProductSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'product';
    this.namespace = `.${this.name}`;

    const productDetailForm = new ProductDetailForm({
      $el: this.$container,
      $container: this.$container,
      enableHistoryState: true
    });

    productDetailForm.initialize();    
  }

  onSelect(evt) {
    console.log('on select in product section');
  }
  
}