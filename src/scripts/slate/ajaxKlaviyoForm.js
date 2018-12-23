/**
 * AJAX Klaviyo Library
 * -----------------------------------------------------------------------------
 * Handles AJAX form submission and callback event
 *
 * Usage:
 *
 *   var $form = $('form');
 *   var listId = $form.data('list-id');
 *   var source = $form.data('source');
 *
 *   var options = {
 *     listId: listId,
 *     source: source,
 *     onSubscribeSuccess: function() { .. },
 *     onSubmitFail: function(){ .. }
 *   };
 *
 *   var ajaxKlaviyoForm = new slate.AjaxKlaviyoForm($form, options);
 *
 * @namespace ajaxKlaviyoForm
 */


slate.AjaxKlaviyoForm = (function($) {

 /**
  * AJAX Klaviyo Form Constructor
  *
  * @param {HTMLElement | jQuery} form - Form element
  * @param {Object} options
  * @param {String} options.listId - Klaviyo List ID
  * @param {String} options.source - Klaviyo custom $source property
  * @param {Function} options.onInit
  * @param {Function} options.onBeforeSend - Prevent AJAX submission by returning false here
  * @param {Function} options.onSubmitFail  
  * @param {Function} options.onSubscribeSuccess
  * @param {Function} options.onSubscribeFail
  * @return {self}
  */
  function AjaxKlaviyoForm(form, options) {

    this.name = 'ajaxKlaviyoForm';
    this.namespace = '.' + this.name;
    this.events = {
      SUBMIT: 'submit' + this.namespace
    };

    var _this = this;
    var defaults = {
      source: "Shopify Form",
      onInit: $.noop,
      onBeforeSend: $.noop,
      onSubmitFail: $.noop,
      onSubscribeSuccess: $.noop,
      onSubscribeFail: $.noop
    };

    if (form.length === 0) {
      return false;
    }

    this.$form    = form instanceof jQuery ? form : $(form);
    this.$input   = this.$form.find('input[type="email"]');
    this.$submit  = this.$form.find('[type="submit"]');
    this.settings = $.extend({}, defaults, options);

    if(!this.settings.listId) {
      console.warn('['+this.name+'] - Valid Klaviyo List ID required to initialize');
      return;
    }

    this.$form.on(this.events.SUBMIT, this.onFormSubmit.bind(_this));

    this.settings.onInit();

    return this;
  }

  AjaxKlaviyoForm.prototype = $.extend({}, AjaxKlaviyoForm.prototype, {
    logErrors: function(errors) {
      if(Array.isArray(errors) && errors.length) {
        for (var i = errors.length - 1; i >= 0; i--) {
          console.warn('['+this.name+'] - onSubmitFail error: "' + errors[i] + '"');
        }
      }
    },    
    onBeforeSend: function() {
      
      if(this.settings.onBeforeSend() == false) {
        return false;
      }

      if (this.$input.val() && this.$input.val().length) {
        this.$submit.prop('disabled', true);
        return true;
      } else {
        this.$input.parents('.form-group').addClass('alert-info');
      }

      return false;
    },
    onSubmitDone: function(response) {

      this.$submit.prop('disabled', false);

      if(response.success) {
        this.settings.onSubscribeSuccess(response);
      }
      else {
        this.logErrors(response.errors);
        this.settings.onSubscribeFail(response);
      }
    },
    onSubmitFail: function(errors) {

      this.$submit.prop('disabled', false);

      this.logErrors(errors);
      this.settings.onSubmitFail(errors);
    },
    onFormSubmit: function(e) {
      e.preventDefault();
      var _this = this;

      $.ajax({
          async: true,
          crossDomain: true,
          url: "//manage.kmail-lists.com/ajax/subscriptions/subscribe",
          method: "POST",
          headers: {
              "content-type": "application/x-www-form-urlencoded",
              "cache-control": "no-cache"
          },
          data: {
              "g": this.settings.listId,
              "$fields": "$source",
              "email": this.$input.val(),
              "$source": this.settings.source
          },
          beforeSend: _this.onBeforeSend.bind(_this)
        })
        .done(function(response) {
          _this.onSubmitDone(response);
        })
        .fail(function(jqXHR, textStatus) {        
          var errors = [];
          if(jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.hasOwnProperty('errors')) {
            errors = jqXHR.responseJSON.errors;
          }

          _this.onSubmitFail(errors);
        });

      return false;
    }
  });

  return AjaxKlaviyoForm;
})(jQuery);
