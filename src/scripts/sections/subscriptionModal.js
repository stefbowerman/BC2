/**
 * Subscription Modal Section Script
 * ------------------------------------------------------------------------------
 * 
 * Requires:
 *  - slate.utils
 *  - slate.user
 *  - $.modal (bootstrap modal)
 *
 * Details are dependent on:
 *  - Mailing list provider (See settings_schema.json)
 *  - 3rd party ajax / validation scripts
 *
 * @namespace - subscriptionModal
 */

theme.SubscriptionModal = (function($, slate) {

  var selectors = {
    modal: '[data-subscription-modal]',
    form: '[data-subscription-modal-form]',
    emailInput: '[data-subscription-modal-form] input[type="email"]',
    successMessage: '[data-subscription-modal-success]'
  };

  var classes = {

  };

  /**
   * Subscription Modal section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function SubscriptionModal(container) {
    this.$container = $(container);

    this.name = 'subscriptionModal';
    this.namespace = '.'+this.name;

    this.settings = {
      enabled        : this.$container.data('enabled'),
      delay          : !isNaN(parseInt( this.$container.data('delay') )) ? (parseInt( this.$container.data('delay') )*1000) : 3000, // delay before showing the modal on pageload,
      seenExpiration : !isNaN(parseInt( this.$container.data('seen-expiration') )) ? parseInt( this.$container.data('seen-expiration') ) : 30 // days before showing the modal again
    };

    // if seenExpiration is set to 0, set it to 1 year (very far into the future)
    if(this.settings.seenExpiration == 0) {
      this.settings.seenExpiration = 365;
    }

    // DOM elements we'll need
    this.$modal          = $(selectors.modal, this.$container);
    this.$form           = $(selectors.form, this.$container);
    this.$successMessage = $(selectors.successMessage, this.$container);

    /**
     * These are the cookies that we'll use to keep track of how much the user has seen / interacted with the popup
     */
    this.cookies = {};

    this.cookies.seen = slate.user.generateCookie('subscriptionModalSeen');
    this.cookies.seen.value = slate.utils.hashFromString(this.$modal.text()).toString(); // Set the cookie value based on the content
    this.cookies.seen.expiration = this.settings.seenExpiration;

    this.cookies.emailCollected = slate.user.generateCookie('emailCollected');
    this.cookies.emailCollected.expiration = this.settings.seenExpiration;

    /**
     * Attach event handlers
     */
    this.$modal.on('shown.bs.modal', this.onShown.bind(this));
    this.$modal.on('hidden.bs.modal', this.onHidden.bind(this));
    $(selectors.form, this.$modal).on('submit', this.onFormSubmit.bind(this));

    /**
     * Checks the show logic and displays the popup if everything checks out
     */
    if(this.shouldShow()) {
      setTimeout(this.show.bind(this), this.settings.delay);
    }

  }

  SubscriptionModal.prototype = $.extend({}, SubscriptionModal.prototype, {

    onFormSubmit: function(e) {
      /**
       * STUB METHOD - You need to add implementation details
       */
      e.preventDefault();
      console.log('['+this.name+'] - onFormSubmit');
    },

    onFormSuccess: function() {
      this.$form.hide();
      this.$successMessage.show();
      // setTimeout => this.hide() ?
    },

    hide: function() {
      this.$modal.modal('hide');
      if(!slate.utils.isThemeEditor()) {
        slate.user.setCookie(this.cookies.seen);
      }      
    },

    show: function() {
      this.$modal.modal('show');
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

    onShown: function() {
      // $(selectors.emailInput).focus();
    },

    onHidden: function() {
      if(!slate.utils.isThemeEditor()) {
        slate.user.setCookie(this.cookies.seen);
      }
    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      this.show();
    },

    onDeselect: function() {
      this.hide();
    },

    onUnload: function() {
      $('.modal-backdrop').remove();
    }
  });

  return SubscriptionModal;
})(jQuery, slate);
