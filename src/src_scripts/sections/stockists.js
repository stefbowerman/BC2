import BaseSection from "./base";

const selectors = {
  list: '[data-stockists-list]'
};

var classes = {
};

export default class StockistsSection extends BaseSection {

  constructor(container) {
    super(container);
    this.name = 'stockists';
    this.namespace = `.${this.name}`;

    this.$lists = $(selectors.list, this.$container);

    // This stuff doesn't come back sorted from Shopify so sort it by the 'data-alpha' attribute that we put on there...
    this.$lists.each((i, el) => {
      const $list = $(el);
      const $lis = $list.children().detach();

      $lis.sort((a, b) => {
        const aAlph = $(a).data('alpha');
        const bAlph = $(b).data('alpha');
        if(aAlph > bAlph) {
          return 1;
        }
        else if(aAlph < bAlph) {
          return -1;
        }
        else {
          return 0;
        }
      });

      $list.append($lis);
    });
  }
  
}