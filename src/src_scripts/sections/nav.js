import BaseSection from './base';

const selectors = {
  mainMenu: '.main-menu',
  menuLink: '[data-menu-link]',
  submenu: '[data-submenu]',
  submenuTrigger: 'a[data-submenu-trigger]'
};

const classes  = {
  menuLinkActive: 'is-active',
  menuLinkNotHovered: 'is-not-hovered',
  submenuActive: 'is-active'
};

export default class NavSection extends BaseSection {
  constructor(container) {
    super(container, 'nav');
    
    this.$menu = $(selectors.mainMenu, this.$container);
    this.$menuLinks = $(selectors.menuLink, this.$container);
    this.$submenuTriggers = $(selectors.submenuTrigger, this.$container);
    this.$submenus = $(selectors.submenu, this.$container);

    if (Modernizr && Modernizr.touchevents) {
      this.$menu.on('click', selectors.submenuTrigger, this.onSubmenuTriggerClick.bind(this));
    }
    else {
      this.$menuLinks.on('mouseenter', this.onMenuLinkMouseenter.bind(this));
      this.$menu.on('mouseleave', this.onMenuMouseleave.bind(this));
    }
  }

  activateMenuLinkForUrl(url) {
    this.$menu.find('a').each((i, el) => {
      const $el = $(el);
      const href = $el.attr('href');
      // if (href == url || url.indexOf(href) > -1) {
      if (href == url) {
        $el.addClass(classes.menuLinkActive);
      }
      else {
       $el.removeClass(classes.menuLinkActive); 
      }
    });
  }

  deactivateMenuLinks() {
    this.$menu.find(`.${classes.menuLinkActive}`).removeClass(classes.menuLinkActive);
  }

  activateSubmenu(id) {
    this.$submenus.filter('#' + id).addClass(classes.submenuActive);
  }

  onSubmenuTriggerClick(e) {
    e.preventDefault();
    // is active ? deactive : activate
    this.$submenus.filter('#' + $(e.currentTarget).data('submenu-trigger')).toggleClass(classes.submenuActive);
  }

  onMenuMouseleave(e) {
    this.$submenus.removeClass('is-active');
    this.$menuLinks.removeClass(classes.menuLinkNotHovered);
  }

  onMenuLinkMouseenter(e) {
    const $link = $(e.currentTarget);
    this.$submenus.removeClass(classes.submenuActive);
    if ($link.is(selectors.submenuTrigger)) {
      this.activateSubmenu($link.data('submenu-trigger'));
    }
    this.$menuLinks.removeClass(classes.menuLinkNotHovered);
    this.$menuLinks.not($link).addClass(classes.menuLinkNotHovered);
    // store the active submenu in a variable so we can check if the trigger is for that menu
  }
}
