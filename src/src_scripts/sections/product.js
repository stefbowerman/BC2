import BaseSection from "./base";
import ProductDetailForm from '../product/productDetailForm';
import Drawer from '../uiComponents/drawer';

const selectors = {
  sizeGuideDrawer: '[data-size-guide-drawer]',
  sizeGuideShow: '[data-size-guide-show]'
}

export default class ProductSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'product';
    this.namespace = `.${this.name}`;

    this.productDetailForm = new ProductDetailForm({
      $el: this.$container,
      $container: this.$container,
      enableHistoryState: false
    });

    this.productDetailForm.initialize();

    this.$sizeGuideDrawerEl = $(selectors.sizeGuideDrawer, this.$container);

    if(this.$sizeGuideDrawerEl.length) {
      this.drawer = new Drawer(this.$sizeGuideDrawerEl);

      this.$container.on('click', selectors.sizeGuideShow, (e) => {
        e.preventDefault();
        this.drawer.show();
      });
    }
  }

  onSelect(e) {
    console.log('on select in product section');
  }
  
}