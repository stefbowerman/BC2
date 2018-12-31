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
    this.$menu = this.$el.find('.main-menu');

    setTimeout(() => {
      this.$menu.addClass('is-visible');
    }, 500);
  }

  activateMenuLinkForUrl(url) {
    this.$menu.find('a').each((i, el) => {
      const $el = $(el);
      const href = $el.attr('href');
      if(href == url || url.indexOf(href) > -1) {
        $el.addClass('is-active');
      }
    });
  }

  deactivateMenuLinks() {
    this.$menu.find('.is-active').removeClass('is-active');
  }
  
}