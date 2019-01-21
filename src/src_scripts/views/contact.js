import BaseView from "./base";
import ContactSection from '../sections/contact';

export default class ContactView extends BaseView {
  
  constructor($el) {
    super($el);

    this.contactSection = new ContactSection($el.find('[data-section-type="contact"]'));

    this.sections.push(this.contactSection);
  }
}