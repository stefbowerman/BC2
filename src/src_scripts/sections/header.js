import BaseSection from "./base";

const selectors = {
  header: '[data-header]'
}

export default class HeaderSection extends BaseSection {

  constructor(container) {
    super(container);
    this.$el = $(selectors.header, this.$container);
    this.name = 'header';
    this.namespace = `.${this.name}`;

    setTimeout(() => {
      this.$el.find('.main-menu').addClass('is-visible');
    }, 500);
  }
  
}