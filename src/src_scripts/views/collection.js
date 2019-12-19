import BaseView from './base';
import CollectionSection from '../sections/collection';

export default class CollectionView extends BaseView {
  constructor($el) {
    super($el);

    this.sections.push(new CollectionSection($el.find('[data-section-type="collection"]')));
  }
}
