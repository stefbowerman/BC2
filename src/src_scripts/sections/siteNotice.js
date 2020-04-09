import Cookies from 'js-cookie';
import BaseSection from './base';
import Utils from '../utils';

export default class SiteNoticeSection extends BaseSection {
  constructor(container) {
    super(container, 'site-notice');

    this.enabled = this.$container.data('enabled');
    this.themeEditor = Utils.isThemeEditor();
    this.cookiesEnabled = Utils.cookiesEnabled();

    this.$modal = $('.modal', this.$container);
    this.$modalBody = $('.modal-body', this.$container);
    
    this.cookie = {
      name: this.name.replace('-', '_'),
      value: Math.abs(Utils.hashFromString(this.$modalBody.text())), // Creates a unique hash any time we change the contents of the modal
      expires: 7 // days
    };

    this.$modal.on('hidden.bs.modal', this.onModalHidden.bind(this));
  }

  showIfNeeded() {
    const userHasCookie = Cookies.get(this.cookie.name) !== undefined;

    if (this.cookiesEnabled && this.enabled && !userHasCookie && !this.themeEditor) {
      this.$modal.modal('show');
    }
  }

  onModalHidden() {
    if (this.themeEditor) {
      return;
    }

    Cookies.remove(this.cookie.name);
    Cookies.set(this.cookie.name, this.cookie.value, { expires: this.cookie.expires });
  }

  onSelect() {
    if (this.enabled) {
      this.$modal.modal('show');
    }
  }

  onDeselect() {
    this.$modal.modal('hide');
  }

  onUnload() {
    this.$modal.modal('hide');
    $('.modal-backdrop').remove();
  }
}
