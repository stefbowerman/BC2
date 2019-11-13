import BaseSection from './base';

const selectors = {
  header: '[data-header]',
}

export default class HeaderSection extends BaseSection {
  constructor(container) {
    super(container, 'header');
    this.$el = $(selectors.header, this.$container);
  }
}