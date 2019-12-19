import AJAXMailchimpForm from '../ajaxMailchimpForm';
import analytics from '../analytics';
import Utils from '../utils';

const selectors = {
  form: 'form[data-subscribe-form]',
  formContents: '[data-form-contents]',
  formMessage: '[data-form-message]'
};

const classes = {
  showMessage: 'show-message',
  textDanger: 'text-danger'
};

class SubscribeForm {
  constructor(el, options = {}) {
    const defaults = {
      eventLabel: '',
      runAnimations: true, // Don't do the timeout stuff, you gotta do your own clean up
      onSubscribeSuccess: () => {},
      onSubscribeFail: () => {},
      onSuccessAnimationComplete: () => {}
    };

    this.transitionEndEvent = Utils.whichTransitionEnd();
    this.settings = $.extend({}, defaults, options);

    const $el        = $(el);
    this.$form       = $el.is(selectors.form) ? $el : $el.find(selectors.form).first();
    this.$contents   = $(selectors.formContents, this.$form);
    this.$message    = $(selectors.formMessage, this.$form);
    this.$emailInput = $('input[type="email"]', this.$form);

    if (this.$form.length === 0) {
      console.warn('Valid form element required to initialize');
      return;
    }

    this.ajaxMailchimpForm = new AJAXMailchimpForm(this.$form, {
      onSubscribeFail: this.onSubscribeFail.bind(this),
      onSubscribeSuccess: this.onSubscribeSuccess.bind(this)
    });
  }

  onSubscribeFail(msg = '') {
    const displayMsg = msg.match(/already subscribed/) ? window.theme.strings.subscribeAlreadySubscribed : window.theme.strings.subscribeFail;

    this.$message.text(displayMsg);
    this.$message.addClass(classes.textDanger);
    this.$contents.addClass(classes.showMessage);
    
    if (this.settings.runAnimations) {
      setTimeout(() => {
        this.$contents.removeClass(classes.showMessage);
        this.$contents.one(this.transitionEndEvent, () => {
          this.$emailInput.focus();
          this.$message.text('');
          this.$message.removeClass(classes.textDanger);
        });
      }, 4000);
    }

    this.settings.onSubscribeFail();
  }

  onSubscribeSuccess() {
    this.$message.text(window.theme.strings.subscribeSuccess);
    this.$contents.addClass(classes.showMessage);

    if (this.settings.runAnimations) {
      setTimeout(() => {
        this.$contents.removeClass(classes.showMessage);
        this.$emailInput.val('');
        setTimeout(this.settings.onSuccessAnimationComplete, 300); // 300 is the animation delay on the form inputs for removing showMessage
      }, 4000);
    }

    analytics.trackEvent({
      category: 'Mailing List',
      action: 'Subscribe Success',
      label: this.settings.eventLabel
    });

    this.settings.onSubscribeSuccess();
  }
}

export default SubscribeForm;
