import BaseSection from "./base";
import ContactForm from "../uiComponents/contactForm";

const selectors = {
  form: 'form#contact_form'
};

const classes = {

};

export default class ContactSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'cart';
    this.namespace = `.${this.name}`;

    this.form = new ContactForm($(selectors.form, this.$container).first());
  }
  
}