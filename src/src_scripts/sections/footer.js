import BaseSection from './base';
import SubscribeForm from '../uiComponents/subscribeForm';

const classes = {
  formActive: 'form-active',
  showHelperText: 'show-helper-text'
};

export default class FooterSection extends BaseSection {
  constructor(container) {
    super(container, 'footer');

    this.subscribeForm = new SubscribeForm(this.$container, {
      eventLabel: 'footer',
      onSubscribeSuccess: () => {
        this.hideHelperText();
      },
      onSuccessAnimationComplete: () => {
        // If they haven't blurred or mouse'd away from the form, show the helper text again
        if (this.$container.hasClass(classes.formActive)) {
          this.showHelperText();
        }
      }
    });

    this.formHovered   = false;
    this.$input        = this.subscribeForm.$emailInput;
    this.$formContents = this.subscribeForm.$contents;

    this.$container.on('mouseenter', this.showHelperText.bind(this));
    this.$container.on('mouseleave', this.hideHelperText.bind(this));

    this.$input.on('focus', this.activateForm.bind(this));
    this.$input.on('blur', () => {
      if (this.formHovered) return;
      this.deactivateForm();
    });

    this.$formContents.on('mouseenter', () => {
      this.formHovered = true;
      this.activateForm();

      this.$formContents.one('mouseleave', () => {
        this.formHovered = false;
        this.deactivateForm();
      });
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
}
