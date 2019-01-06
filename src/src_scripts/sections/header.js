import BaseSection from "./base";

const selectors = {
  header: '[data-header]',
  mainMenu: '.main-menu'
}

const classes  = {
  menuLinkActive: 'is-active'
};

export default class HeaderSection extends BaseSection {

  constructor(container) {
    super(container);
    this.$el = $(selectors.header, this.$container);
    this.name = 'header';
    this.namespace = `.${this.name}`;
    this.$menu = this.$el.find(selectors.mainMenu);
    this.$menuDirectLinks = this.$menu.find('> li > a')

    this.$menu.on('mouseleave', this.onMenuMouseleave.bind(this));
    this.$menuDirectLinks.on('mouseenter', this.onMenuLinkMouseenter.bind(this));
    this.$menuDirectLinks.on('mouseleave', this.onMenuLinkMouseleave.bind(this));
  }

  activateMenuLinkForUrl(url) {
    this.$menu.find('a').each((i, el) => {
      const $el = $(el);
      const href = $el.attr('href');
      if(href == url || url.indexOf(href) > -1) {
        $el.addClass(classes.menuLinkActive);
      }
    });
  }

  deactivateMenuLinks() {
    this.$menu.find(`.${classes.menuLinkActive}`).removeClass(classes.menuLinkActive);
  }

  onMenuMouseleave(e) {
    this.$menu.removeClass('has-hovered-link');
    this.$menuDirectLinks.removeClass('is-hovered');
  }

  onMenuLinkMouseenter(e) {
    this.$menu.addClass('has-hovered-link');
    $(e.currentTarget).addClass('is-hovered');
  }

  onMenuLinkMouseleave(e) {
    this.$menu.removeClass('has-hovered-link');
    $(e.currentTarget).removeClass('is-hovered');
  }  
  
}