import BaseSection from './base';
import ContactForm from '../uiComponents/contactForm';

const selectors = {
  form: 'form#contact_form'
};

export default class ContactSection extends BaseSection {

  constructor(container) {
    super(container, 'contact');

    this.form = new ContactForm($(selectors.form, this.$container).first());
  }
  
}