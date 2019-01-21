const selectors = {
  form: 'form#contact_form',
  inputEmail: '[data-input-email]',
  inputMessage: '[data-input-message]'
};

export default class ContactForm {
  constructor(form) {
    this.$form = $(form);

    if(!this.$form.is(selectors.form)) {
      console.warn('Valis form element required to initialize');
      return;
    }

    this.$inputEmail   = this.$form.find(selectors.inputEmail);
    this.$inputMessage = this.$form.find(selectors.inputMessage);

    this.$form.on('submit', this.onSubmit.bind(this));

  }

  onSubmit(e) {
    e.preventDefault();

    if(this.$inputMessage.val().length == 0) {
      console.log('Please enter a message');
      return false;
    }

    if(this.$inputEmail.val().length == 0) {
      console.log('Please enter an email address');
      return false; 
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

      console.log($form);
    })
    .fail(() => {
      console.log('something went wrong, try again later');
    });
  }
}