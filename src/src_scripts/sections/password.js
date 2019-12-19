import BaseSection from './base';
import SubscribeForm from '../uiComponents/subscribeForm';

export default class PasswordSection extends BaseSection {
  constructor(container) {
    super(container, 'password');

    this.subscribeForm = new SubscribeForm(this.$container, {
      eventLabel: 'password page'
    });

    if (window.location.search.indexOf('password') > -1) {
      document.getElementById('Login').style.display = 'block';
    }
  }
}
