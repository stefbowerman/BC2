/**
 * AJAX MailChimp Library
 * -----------------------------------------------------------------------------
 * Heavily modified version of the original jQuery plugin - https://github.com/scdoshi/jquery-ajaxchimp
 * Handles AJAX form submission and provides hooks for lifecycle events.
 *
 * Usage:
 *
 *   var $form = $('form');
 *   var ajaxForm = new slate.AjaxMailChimpForm($form, {
 *     onInit: function() {
 *       // ...
 *     }
 *   });
 *
 * @namespace ajaxMailChimpForm
 */


slate.AjaxMailChimpForm = (function($) {

 /**
  * AJAX MailChimp Form Contructor
  *
  * @param {HTMLElement | jQuery} form - Form element
  * @param {Object} options
  * @param {Function} options.onInit
  * @param {Function} options.onDestroy
  * @param {Function} options.onBeforeSend - Prevent AJAX submission by returning false here
  * @param {Function} options.onSubmitFail
  * @param {Function} options.onSubscribeSuccess
  * @param {Function} options.onSubscribeFail
  * @return {self}
  */
  function AjaxMailChimpForm(form, options) {

    this.name = 'ajaxMailChimpForm';
    this.namespace = '.' + this.name;
    this.events = {
      SUBMIT: 'submit' + this.namespace
    };

    var _this = this;
    var defaults = {
      onInit: $.noop,
      onDestroy: $.noop,
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

    if(this.$input.attr('name') != "EMAIL") {
      console.warn('['+this.name+'] - Email input *must* have attribute [name="EMAIL"]');
    }

    this.$form.on(this.events.SUBMIT, this.onFormSubmit.bind(_this));

    this.settings.onInit();

    return this;
  }

  AjaxMailChimpForm.prototype = $.extend({}, AjaxMailChimpForm.prototype, {
    regexes: {
      error: {
        1: /Please enter a value/,
        2: /An email address must contain a single @/,
        3: /The domain portion of the email address is invalid \(the portion after the @: (.+)\)/,
        4: /The username portion of the email address is invalid \(the portion before the @: (.+)\)/,
        5: /This email address looks fake or invalid. Please enter a real email address/,
        6: /.+\#6592.+/,
        7: /(.+@.+) is already subscribed to list (.+)\..+<a href.+/
      }
    },
    responses: {
      success: 'Thank you for subscribing!',
      error: {
        1: 'Please enter an email address',
        2: 'There was a problem with your entry. Please check the address and try again.',
        3: 'There was a problem with your entry. Please check the address and try again.',
        4: 'There was a problem with your entry. Please check the address and try again.',
        5: 'There was a problem with your entry. Please check the address and try again.',
        6: 'Too many subscribe attempts for this email address. Please try again in about 5 minutes.',
        7: 'You\'re already subscribed. Thank you!'
      }
    },
    getRegexMatch: function(string, stringKey) {
      var regexPatterns = this.regexes[stringKey];
      var matchedId;
      $.each(regexPatterns, function(id, regexPattern) {
        if (string.match(regexPattern) !== null) {
          matchedId = id;
          return false;
        }
      });
      return matchedId;
    },
    getMessageForResponse: function(response) {
      var msg;
      if (response.result === 'success') {
        msg = this.responses.success;
      } else {
        var index = -1;
        try {
          var parts = response.msg.split(' - ', 2);
          if (parts[1] === undefined) {
            msg = response.msg;
          } else {
            msg = parts[1];
          }
        } catch (e) {
          msg = response.msg;
        }

        // Now that we have the relevant part of the message, lets get the actual string for it
        var regexPattern = this.regexes.error;
        var matchedId = this.getRegexMatch(msg, 'error');
        if (matchedId && regexPattern[matchedId] && this.responses.error[matchedId]) {
          return msg.replace(regexPattern[matchedId], this.responses.error[matchedId]);
        }
      }

      return msg;
    },
    destroy: function() {
      this.$form.off(this.events.SUBMIT);
      this.settings.onDestroy();
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
      var rspMsg = this.getMessageForResponse(response);
      this.$submit.prop('disabled', false);
      response.result === 'success' ? this.settings.onSubscribeSuccess(rspMsg) : this.settings.onSubscribeFail(rspMsg);
    },
    onSubmitFail: function(response) {
      this.settings.onSubmitFail();
    },
    onFormSubmit: function(e) {
      e.preventDefault();
      var _this = this;
      var $form = this.$form;
      var data = {};
      var dataArray = $form.serializeArray();

      // See - https://github.com/scdoshi/jquery-ajaxchimp/blob/master/jquery.ajaxchimp.js
      $.each(dataArray, function(index, item) {
        data[item.name] = item.value;
      });

      $.ajax({
          url: $form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
          dataType: 'jsonp',
          data: data,
          beforeSend: _this.onBeforeSend.bind(_this)
        })
        .done(function(response) {
          _this.onSubmitDone(response);
        })
        .fail(function(response) {
          _this.onSubmitFail(response);
        });

      return false;
    }
  });

  return AjaxMailChimpForm;
})(jQuery);
