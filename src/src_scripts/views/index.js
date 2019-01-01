import BaseView from "./base";
import BaseSection from '../sections/base';

export default class IndexView extends BaseView {
  
  constructor($el) {
    super($el);
    console.log('index view');

    $('[data-section-id]').each((i, el) => {
      this._createSectionInstance($(el));
    });
  }
}