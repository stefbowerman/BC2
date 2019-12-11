import BaseSection from './base';
import AJAXMailchimpForm from '../ajaxMailchimpForm';
import Utils from '../utils';
import analytics from '../analytics';

const selectors = {
  footerJson: '[data-footer-json]',
  formContents: '[data-form-contents]',
  formInputs: '[data-form-inputs]',
  formMessage: '[data-form-message]'
};

const classes = {
  showMessage: 'show-message',
  contentsGoAway: 'go-away',
  formActive: 'form-active',
  textDanger: 'text-danger'
};

export default class FooterSection extends BaseSection {
  constructor(container) {
    super(container, 'footer');
    
    this.transitionEndEvent = Utils.whichTransitionEnd();
    this.settings           = JSON.parse($(selectors.footerJson, this.$container).html());
    this.formSubmitting     = false;
    this.inputActive        = false;

    this.$subscribeForm  = this.$container.find('form');
    this.$formContents   = $(selectors.formContents, this.$container);
    this.$formInputs     = $(selectors.formInputs, this.$container);
    this.$formMessage    = $(selectors.formMessage, this.$container);
    this.$formEmailInput = this.$subscribeForm.find('input[type="email"]');

    this.$subscribeForm.on('focus', 'input, button[type="submit"]', this.onFormInputFocus.bind(this))
    this.$subscribeForm.on('blur', 'input, button[type="submit"]', this.onFormInputBlur.bind(this))
    this.$formInputs.on('mouseenter', this.onFormInputsMouseenter.bind(this));
    this.$formInputs.on('mouseleave', this.onFormInputsMouseleave.bind(this));

    this.AJAXMailchimpForm = new AJAXMailchimpForm(this.$subscribeForm, {
      onBeforeSend: () => {
        this.formSubmitting = true;
      },
      onSubscribeAlways: () => {
        this.formSubmitting = false;
      },
      onSubscribeFail: (msg) => {
        if (msg.match(/already subscribed/)) {
          this.$formMessage.text(this.settings.messages.subscribe_already_subscribed);
          this.$formMessage.addClass(classes.textDanger);
        }
        else {
          this.$formMessage.text(this.settings.messages.subscribe_fail);
          this.$formMessage.addClass(classes.textDanger);
        }
        
        this.$formContents.addClass(classes.showMessage);
        setTimeout(() => {
          this.$formContents.removeClass(classes.showMessage);
          this.$formContents.one(this.transitionEndEvent, () => {
            this.$formEmailInput.focus();
            this.$formMessage.text('');
            this.$formMessage.removeClass(classes.textDanger);
          });
        }, 4000);
      },
      onSubscribeSuccess: () => {
        console.log('success')
        console.log(this.settings)
        this.$formMessage.text(this.settings.messages.subscribe_success);
        this.$formContents.addClass(classes.showMessage);

        setTimeout(() => {
          this.$formContents.addClass(classes.contentsGoAway);
          this.$formContents.removeClass(classes.showMessage);
        }, 4000);

        analytics.trackEvent({
          category: 'Mailing List',
          action: 'Subscribe Success',
          label: 'footer'
        });
      }
    });
  }

  onFormInputFocus(e) {
    this.inputActive = true;
    this.$container.addClass(classes.formActive);
  }

  onFormInputBlur(e) {
    this.inputActive = false;
    
    if(this.formSubmitting) return

    this.$container.removeClass(classes.formActive);
  }

  onFormInputsMouseenter(e) {
    this.$container.addClass(classes.formActive);
  }

  onFormInputsMouseleave(e) {
    if(this.inputActive == false) {
      this.$container.removeClass(classes.formActive);
    }
  }
}
