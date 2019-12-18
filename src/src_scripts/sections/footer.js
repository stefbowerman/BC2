import BaseSection from './base';
import AJAXMailchimpForm from '../ajaxMailchimpForm';
import Utils from '../utils';
import analytics from '../analytics';

const selectors = {
  formContents: '[data-form-contents]',
  formMessage: '[data-form-message]'
};

const classes = {
  showMessage: 'show-message',
  contentsGoAway: 'go-away',
  formActive: 'form-active',
  textDanger: 'text-danger',
  showHelperText: 'show-helper-text'
};

export default class FooterSection extends BaseSection {
  constructor(container) {
    super(container, 'footer');
    
    this.transitionEndEvent = Utils.whichTransitionEnd();
    this.formSubmitting     = false;

    this.$subscribeForm  = this.$container.find('form');
    this.$formContents   = $(selectors.formContents, this.$container);
    this.$formMessage    = $(selectors.formMessage, this.$container);
    this.$formEmailInput = this.$subscribeForm.find('input[type="email"]');

    this.$subscribeForm.on('focus', 'input, button[type="submit"]', this.onFormInputFocus.bind(this));
    this.$subscribeForm.on('blur', 'input, button[type="submit"]', this.onFormInputBlur.bind(this));
    this.$container.on('mouseenter', this.showHelperText.bind(this));
    this.$container.on('mouseleave', this.hideHelperText.bind(this));

    this.AJAXMailchimpForm = new AJAXMailchimpForm(this.$subscribeForm, {
      onBeforeSend: () => {
        this.formSubmitting = true;
      },
      onSubscribeAlways: () => {
        this.formSubmitting = false;
      },
      onSubscribeFail: (msg) => {
        if (msg.match(/already subscribed/)) {
          this.$formMessage.text(window.theme.strings.subscribeAlreadySubscribed);
        }
        else {
          this.$formMessage.text(window.theme.strings.subscribeFail);
        }

        this.$formMessage.addClass(classes.textDanger);
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
        this.$formMessage.text(window.theme.strings.subscribeSuccess);
        this.$formContents.addClass(classes.showMessage);
        this.hideHelperText();
        this.deactivateForm();

        setTimeout(() => {
          // this.$formContents.addClass(classes.contentsGoAway);
          this.$formContents.removeClass(classes.showMessage);
          this.$formEmailInput.val('');
        }, 4000);

        analytics.trackEvent({
          category: 'Mailing List',
          action: 'Subscribe Success',
          label: 'footer'
        });
      }
    });
  }

  showHelperText() {
    this.$container.addClass(classes.showHelperText);
  }

  hideHelperText() {
    this.$container.removeClass(classes.showHelperText);
  }

  activateForm() {
    this.$container.addClass(classes.formActive);
  }

  deactivateForm() {
    this.$container.removeClass(classes.formActive);
  }

  onFormInputFocus(e) {
    this.activateForm();
    this.showHelperText();
  }

  onFormInputBlur(e) {    
    if(this.formSubmitting) return

    this.deactivateForm();
  }
}
