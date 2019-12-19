import BaseSection from './base';
import SubscribeForm from '../uiComponents/subscribeForm';
import Utils from '../utils';

const selectors = {
  formSuccess: '[data-form-success]'
};

const classes = {
  hasError: 'has-error',
  showSuccess: 'show-success',
  messageVisible: 'is-visible'
};

export default class SubscribeSection extends BaseSection {
  constructor(container) {
    super(container, 'subscribe');

    this.transitionEndEvent = Utils.whichTransitionEnd();

    this.$formSuccess = $(selectors.formSuccess, this.$container);

    // This UI component is *really* meant for a minimal input box but we're repurposing for a normal form
    this.subscribeForm = new SubscribeForm(this.$container, {
      eventLabel: 'page',
      runAnimations: false,
      onSubscribeFail: this.onSubscribeFail.bind(this),
      onSubscribeSuccess: this.onSubscribeSuccess.bind(this)
    });

    this.$form       = this.subscribeForm.$form;
    this.$input      = this.subscribeForm.$emailInput;
    this.$inputGroup = this.$input.parents('.form-group');
    this.$message    = this.subscribeForm.$message;

    this.$input.on('keydown focus', () => {
      this.$inputGroup.removeClass(classes.hasError);
      this.$message.removeClass(classes.messageVisible);
    });

    this.$input.focus();
  }

  onSubscribeFail() {
    this.$inputGroup.addClass(classes.hasError);
    this.$message.addClass(classes.messageVisible);
  }

  onSubscribeSuccess() {
    this.$form.addClass(classes.showSuccess);

    this.$formSuccess.one(this.transitionEndEvent, () => {
      this.$input.val('');
      this.$message.text('');

      setTimeout(() => {
        this.$form.removeClass(classes.showSuccess);
      }, 5000);
    });
  }
}
