import BaseSection from "./base";

const selectors = {
  header: '[data-header]',
}

const classes  = {
};

export default class HeaderSection extends BaseSection {

  constructor(container) {
    super(container);
    this.$el = $(selectors.header, this.$container);
    this.name = 'header';
    this.namespace = `.${this.name}`;
  }
  
}