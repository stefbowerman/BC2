import BaseView from './base';

export default class IndexView extends BaseView {
  constructor($el) {
    super($el);

    $('[data-section-id]').each((i, el) => {
      this._createSectionInstance($(el));
    });
  }
}
