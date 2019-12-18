import BaseSection from './base';
import AJAXMailchimpForm from '../ajaxMailchimpForm';
import Utils from '../utils';
import analytics from '../analytics';

const selectors = {
  form: 'form',
  formMessage: '[data-form-message]',
  formSuccess: '[data-form-success]'
};

const classes = {
  textDanger: 'text-danger',
  hasError: 'has-error',
  showSuccess: 'show-success',
  messageVisible: 'is-visible'
};

export default class SubscribeSection extends BaseSection {
  constructor(container) {
    super(container, 'subscribe');

    this.transitionEndEvent = Utils.whichTransitionEnd();
    this.messageTimeout = null;

    this.$form = $(selectors.form, this.$container).first();
    this.$formInput = this.$form.find('input[type="email"]');
    this.$formInputGroup = this.$formInput.parents('.form-group');
    this.$formMessage = $(selectors.formMessage, this.$container);
    this.$formSuccess = $(selectors.formSuccess, this.$container);

    this.AJAXMailchimpForm = new AJAXMailchimpForm(this.$form, {
      onSubscribeFail: (msg) => {
        if (msg.match(/already subscribed/)) {
          this.$formMessage.text(window.theme.strings.subscribeAlreadySubscribed);
        }
        else {
          this.$formMessage.text(window.theme.strings.subscribeFail);
        }

        this.$formMessage.addClass(classes.textDanger); 
        this.$formInputGroup.addClass(classes.hasError);
        this.$formMessage.text('This email is already subscribed');
        this.$formMessage.addClass(classes.messageVisible);
      },
      onSubscribeSuccess: () => {
        this.$form.addClass(classes.showSuccess);
        this.$formSuccess.one(this.transitionEndEvent, () => {
          this.$formInput.val('')
          this.$formMessage.text('');

          setTimeout(() => {
            this.$form.removeClass(classes.showSuccess);
          }, 5000);
        });

        analytics.trackEvent({
          category: 'Mailing List',
          action: 'Subscribe Success',
          label: 'page'
        });
      }
    });

    this.$formInput.on('keydown focus', () => {
      this.$formInputGroup.removeClass(classes.hasError);
      this.$formMessage.removeClass(classes.messageVisible);
    });

    this.$formInput.focus();
  }
}
