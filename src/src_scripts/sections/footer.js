import BaseSection from './base';
import AJAXMailchimpForm from '../ajaxMailchimpForm';
import Utils from '../utils';

const selectors = {
  formContents: '[data-form-contents]',
  formInputs: '[data-form-inputs]',
  formMessage: '[data-form-message]'
};

const classes = {
  showMessage: 'show-message',
  contentsGoAway: 'go-away'
}

export default class FooterSection extends BaseSection {

  constructor(container) {
    super(container, 'footer');
    
    this.transitionEndEvent = Utils.whichTransitionEnd();

    this.$subscribeForm = this.$container.find('form');
    this.$formContents  = $(selectors.formContents, this.$container);
    this.$formInputs    = $(selectors.formInputs, this.$container);
    this.$formMessage   = $(selectors.formMessage, this.$container);

    this.AJAXMailchimpForm = new AJAXMailchimpForm(this.$subscribeForm, {
      onSubscribeFail: (msg) => {
        if(msg.match(/already subscribed/)) {
          this.$formMessage.text('This email address is already subscribed');  
        }
        else {
          this.$formMessage.text('Check your email address and try again');   
        }
        
        this.$formContents.addClass(classes.showMessage);
        setTimeout(() => {
          this.$formContents.removeClass(classes.showMessage);
          this.$formContents.one(this.transitionEndEvent, () => {
            this.$formMessage.text('');
          });
        }, 4000);
      },
      onSubscribeSuccess: () => {
        this.$formMessage.text('Thank you for subscribing');
        this.$formContents.addClass(classes.showMessage);
        setTimeout(() => {
          this.$formContents.addClass(classes.contentsGoAway);         
        }, 4000);
      }
    });
  }
  
}