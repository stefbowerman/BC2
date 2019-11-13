import BaseSection from './base';
import Drawer from '../uiComponents/drawer';
import * as Breakpoints from '../breakpoints';

const selectors = {
  toggle: '[data-mobile-menu-toggle]',
  menu: '[data-mobile-menu]'
};

const classes = {
  toggleActive: 'is-active',
  bodyMenuOpen: 'mobile-menu-open'
};

const $window = $(window);
const $body   = $(document.body);

export default class MobileMenuSection extends BaseSection {
  constructor(container) {
    super(container, 'mobileMenu');

    this.$el     = $(selectors.menu, this.$container);
    this.$toggle = $(selectors.toggle); // Don't scope to this.$container
    this.hideMobileMenuMinWidth = Breakpoints.getBreakpointMinWidth('xs');

    this.drawer  = new Drawer(this.$el);

    this.$toggle.on('click', this.onToggleClick.bind(this));
    this.$el.on('click', 'a', (e) => {
      if(!e.isDefaultPrevented()) {
        this.drawer.hide();
      }
    });
    this.$el.on('show.drawer', () => {
      this.$toggle.addClass(classes.toggleActive);
      $body.addClass(classes.bodyMenuOpen);
    });
    this.$el.on('hide.drawer', () => {
      this.$toggle.removeClass(classes.toggleActive);
      $body.removeClass(classes.bodyMenuOpen);
    });

    $window.on('resize', this.onResize.bind(this));
  }

  onToggleClick(e) {
    e.preventDefault();
    this.drawer.toggle();
  }

  onResize(e) {
    if(window.innerWidth >= this.hideMobileMenuMinWidth) {
      this.drawer.hide();
    }
  }

  /**
   * Theme Editor section events below
   */
  onSelect() {
    this.drawer.show();
  }

  onDeselect() {
    this.drawer.hide();
  }

  onUnload() {
    this.drawer.$backdrop && this.drawer.$backdrop.remove();
  }
}
