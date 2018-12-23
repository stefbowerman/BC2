/**
 * Subscription Slideup Section Script
 * ------------------------------------------------------------------------------
 *
 * Requires:
 *  - slate.utils
 *  - slate.user
 *  - slate.models.Slideup
 *
 * Details are dependent on:
 *  - Mailing list provider (See settings_schema.json)
 *  - 3rd party ajax / validation scripts
 *
 * @namespace - subscriptionSlideup
 */

theme.SubscriptionSlideup = (function($, slate) {

  var selectors = {
    slideup: '[data-subscription-slideup]',
    formContent: '[data-subscription-slideup-form-content]',
    formMessage: '[data-subscription-slideup-form-message]'
  };

  var classes = {
    showMessage: 'show-message'
  };

  /**
   * Subscription Slideup section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function SubscriptionSlideup(container) {
    this.$container = $(container);

    this.name = 'subscriptionSlideup';
    this.namespace = '.'+this.name;

    this.settings = {
      enabled        : this.$container.data('enabled'),
      delay          : !isNaN(parseInt( this.$container.data('delay')) ) ? (parseInt( this.$container.data('delay') )*1000) : 3000, // delay before showing the modal on pageload,
      seenExpiration : !isNaN(parseInt( this.$container.data('seen-expiration')) ) ? parseInt( this.$container.data('seen-expiration') ) : 30 // days before showing the modal again
    };

    // if seenExpiration is set to 0, set it to 1 year (very far into the future)
    if(this.settings.seenExpiration == 0) {
      this.settings.seenExpiration = 365;
    }

    // DOM elements we'll need
    this.$el          = $(selectors.slideup, this.$container);
    this.$formContent = $(selectors.formContent, this.$container);
    this.$formMessage = $(selectors.formMessage, this.$container);

    this.slideup = new slate.models.Slideup(this.$el);
    
    // Hook up the form to an ESP here
    // this.ajaxKlaviyoForm = new slate....

    /**
     * These are the cookies that we'll use to keep track of how much the user has seen / interacted with the slideup
     */
    this.cookies = {};

    this.cookies.seen = slate.user.generateCookie('subscriptionSlideupSeen');
    this.cookies.seen.value = slate.utils.hashFromString(this.$el.text()).toString(); // Set the cookie value based on the content
    this.cookies.seen.expiration = this.settings.seenExpiration;

    this.cookies.emailCollected = slate.user.generateCookie('emailCollected');
    this.cookies.emailCollected.expiration = this.settings.seenExpiration;

    /**
     * Attach event handlers
     */
    this.$el.on('hide.slideup',   this.onHide.bind(this));
    this.$el.on('hidden.slideup', this.onHidden.bind(this));

    /**
     * Checks the show logic and displays the popup if everything checks out
     */
    if(this.shouldShow()) {
      setTimeout(function(){
        this.slideup.show();
      }.bind(this), this.settings.delay);
    }

  }

  SubscriptionSlideup.prototype = $.extend({}, SubscriptionSlideup.prototype, {

    /**
     * Resets everything to it's initial state.  Only call when slideup isn't visible.
     */
    reset: function() {
      this.$formContent.find('input[type="email"]').val('');
      this.$formMessage.html('');
      this.$formContent.removeClass(classes.showMessage);
    },

    onSubscribeSuccess: function() {
      this.$formMessage.html( this.$formMessage.data('message-success') );
      this.$formContent.addClass(classes.showMessage);
      
      if(!slate.utils.isThemeEditor()) {
        slate.user.setCookie(this.cookies.emailCollected);
      }      
    },

    onSubmitFail: function() {
      this.$formMessage.html( this.$formMessage.data('message-fail') );     
      this.$formContent.addClass(classes.showMessage);
      setTimeout(function(){
        this.$formContent.removeClass(classes.showMessage);
      }.bind(this), 5000);
    },

    shouldShow: function() {

      // Checks should be done in this order!

      if(slate.utils.isThemeEditor() || !this.settings.enabled) {
        return false;
      }

      if(slate.user.hasCookie(this.cookies.emailCollected.name)) {
        return false;
      }

      if( slate.user.hasCookie(this.cookies.seen.name) && slate.user.getCookieValue(this.cookies.seen.name) == this.cookies.seen.value) {
        return false;
      }

      return true;
    },

    onHide: function() {
      if(!slate.utils.isThemeEditor()) {
        slate.user.setCookie(this.cookies.seen);
      }
    },

    onHidden: function() {
      this.reset();
    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      this.slideup.show();
    },

    onDeselect: function() {
      this.slideup.hide();
    }
  });

  return SubscriptionSlideup;
})(jQuery, slate);
