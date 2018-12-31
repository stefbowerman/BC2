import BaseSection from "./base";
import Drawer from "../uiComponents/drawer";

const selectors = {
  toggle: '[data-mobile-menu-toggle]',
  menu: '[data-mobile-menu]'
};

export default class MobileMenuSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'mobileMenu';
    this.namespace = `.${this.name}`;

    this.$el     = $(selectors.menu, this.$container);
    this.$toggle = $(selectors.toggle); // Don't scope to this.$container

    this.drawer  = new Drawer(this.$el);

    this.$toggle.on('click', this.onToggleClick.bind(this));   
  }

  onToggleClick(e) {
    e.preventDefault();
    this.drawer.toggle();
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