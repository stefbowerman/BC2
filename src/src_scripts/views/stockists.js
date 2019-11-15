import BaseView from './base';
import StockistsSection from '../sections/stockists';

export default class StockistsView extends BaseView {
  constructor($el) {
    super($el);

    this.stockistsSection = new StockistsSection($el.find('[data-section-type="stockists"]'));

    this.sections.push(this.stockistsSection);
  }
}
