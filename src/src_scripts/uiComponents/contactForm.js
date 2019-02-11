const selectors = {
  form: 'form#contact_form',
  inputEmail: '[data-input-email]',
  inputMessage: '[data-input-message]',
  formGroup: '.form-group',
  formControl: '.form-control'
};

const classes = {
  formGroupError: 'has-error'
};

export default class ContactForm {
  constructor(form) {
    this.$form = $(form);

    if(!this.$form.is(selectors.form)) {
      console.warn('Valid form element required to initialize');
      return;
    }

    this.setInstanceVars();
    this.bindEvents();
  }

  setInstanceVars() {
    this.$inputEmail   = this.$form.find(selectors.inputEmail);
    this.$inputMessage = this.$form.find(selectors.inputMessage);
  }

  bindEvents(e) {
    this.$form.on('submit', this.onSubmit.bind(this))
    this.$form.on('focus keydown', selectors.formControl, (e) => {
      $(e.currentTarget).parents(selectors.formGroup).removeClass(classes.formGroupError);
    });
  }  

  onSubmit(e) {
    e.preventDefault();

    let valid = true;

    if(this.$inputEmail.val().trim().length == 0) {
      this.$inputEmail.parents(selectors.formGroup).addClass(classes.formGroupError);
      valid = false;
    }

    if(this.$inputMessage.val().trim().length == 0) {
      this.$inputMessage.parents(selectors.formGroup).addClass(classes.formGroupError);
      valid = false;
    }

    if(valid == false) {
      return;
    }

    const url  = this.$form.attr('action');
    const data = this.$form.serialize();    

    $.ajax({
       type: "POST",
       url: url,
       data: data
    })
    .done((AJAXResponse) => {
      const $responseHtml = $(document.createElement("html"));

      $responseHtml.get(0).innerHTML = AJAXResponse;

      const $responseHead = $responseHtml.find('head');
      const $responseBody = $responseHtml.find('body');
      const $form = $responseBody.find(selectors.form);        

      this.$form.fadeTo(300, 0, () => {
        this.$form.replaceWith($form);
        this.$form = $form;

        this.setInstanceVars();
        this.bindEvents();
        // Fade it back in
        this.$form.fadeTo(300, 1);  
      });
      
    })
    .fail(() => {
      // Something went wrong, just submit the form as normal in that case
      this.$form.off('submit');
      this.$form.submit();
    });
  }
}