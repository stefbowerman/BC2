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
  contentsGoAway: 'go-away',
  textDanger: 'text-danger'
};

class SubscribeForm {
  constructor(el, eventLabel = '') {
    const $el = $(el);
    this.$form = $el.is(selectors.form) ? $el : $el.find(selectors.form).first()

    if (this.$form.length === 0) {
      console.warn('Valid form element required to initialize');
      return;
    }

    this.transitionEndEvent = Utils.whichTransitionEnd();
    this.eventLabel         = eventLabel;

    this.$contents   = $(selectors.formContents, this.$form);
    this.$message    = $(selectors.formMessage, this.$form);
    this.$emailInput = $('input[type="email"]', this.$form);

    this.ajaxMailchimpForm = new AJAXMailchimpForm(this.$form, {
      // onBeforeSend: () => {
      //   this.onSubscribeSuccess();
      //   return false;
      // },
      onSubscribeFail: this.onSubscribeFail.bind(this),
      onSubscribeSuccess: this.onSubscribeSuccess.bind(this),
    });
  }

  onSubscribeFail(msg) {
    if (msg.match(/already subscribed/)) {
      this.$message.text(window.theme.strings.subscribeAlreadySubscribed);
    }
    else {
      this.$message.text(window.theme.strings.subscribeFail);
    }

    this.$message.addClass(classes.textDanger);
    this.$contents.addClass(classes.showMessage);
    
    setTimeout(() => {
      this.$contents.removeClass(classes.showMessage);
      this.$contents.one(this.transitionEndEvent, () => {
        this.$emailInput.focus();
        this.$message.text('');
        this.$message.removeClass(classes.textDanger);
      });
    }, 4000);
  }

  onSubscribeSuccess() {
    this.$message.text(window.theme.strings.subscribeSuccess);
    this.$contents.addClass(classes.showMessage);

    setTimeout(() => {
      this.$contents.removeClass(classes.showMessage);
      this.$emailInput.val('');
    }, 4000);

    analytics.trackEvent({
      category: 'Mailing List',
      action: 'Subscribe Success',
      label: this.eventLabel
    });
  }
}

export default SubscribeForm
