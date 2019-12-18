import BaseView from './base';

export default class PageView extends BaseView {
  constructor($el) {
    super($el);

    $('[data-section-id]', $el).each((i, el) => {
      this._createSectionInstance($(el));
    });
  }
}
