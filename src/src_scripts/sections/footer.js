import BaseSection from "./base";
import AJAXMailchimpForm from "../ajaxMailchimpForm";

const selectors = {};

export default class FooterSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'footer';
    this.namespace = `.${this.name}`;
    this.$subscribeForm = this.$container.find('form');

    this.AJAXMailchimpForm = new AJAXMailchimpForm(this.$subscribeForm, {
      onInit: () => {
        // console.log('init footer subscribe!');
      },
      onSubscribeFail: (msg) => {
        console.log('subscribed fail - ' + msg);
      },
      onSubscribeSuccess: () => {
        console.log('subscribed successfully');
      }
    });
  }
  
}