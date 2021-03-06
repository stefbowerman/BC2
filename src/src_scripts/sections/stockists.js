import Utils from '../utils';
import BaseSection from './base';

const selectors = {
  list: '[data-stockists-list]'
};

export default class StockistsSection extends BaseSection {
  constructor(container) {
    super(container, 'stockists');

    this.$lists = $(selectors.list, this.$container);

    // This stuff doesn't come back sorted from Shopify so sort it by the 'data-alpha' attribute that we put on there...
    this.$lists.each((i, el) => {
      const $list = $(el);
      const $lis  = $list.children().detach();

      $lis.sort((a, b) => {
        const aAlph = $(a).data('alpha').toString();
        const bAlph = $(b).data('alpha').toString();

        if (aAlph > bAlph) {
          return 1;
        }
        if (aAlph < bAlph) {
          return -1;
        }
        
        return 0;
      });

      $list.append($lis);
    });

    this.$lists.find('a').each((i, el) => {
      if (Utils.isExternal(el.getAttribute('href'))) {
        el.setAttribute('target', '_blank');
      }
    });
  }
}
