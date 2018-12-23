/**
 * Model - Dropdown
 * -----------------------------------------------------------------------------
 * Dropdowns are just elements that respond to a visibility class in order to hide and show
 *
 * @namespace models.dropdown
 */

 slate.models = slate.models || {};

 slate.models.Dropdown = (function($) {

  var classes = {
    open: 'is-open',
    forcedOpen: 'is-forced-open'
  };  

  /**
   * Dropdown - Exposes methods for opening and closing the dropdown.  All logic is handled externally
   *
   * @constructor
   * @param {jQuery} $trigger - Element with attributes 'data-dropdown-trigger' and 'data-block'
   */
  function Dropdown($trigger) {
    this.$trigger = $trigger;
    this.$el      = $( this.$trigger.data('dropdown-trigger') );
    this.blockId  = this.$trigger.data('block').toString();
  }

  Dropdown.prototype = {

    isOpen: function() {
      return this.$el.hasClass( classes.open );
    },

    open: function() {
      this.$el.addClass( classes.open );
    },

    close: function() {
      this.$el.removeClass( classes.open );
    },

    /**
     * Dropdown manager doesn't use the forced open class
     * So we can use it in conjunction with the theme editor to ensure dropdowns are open while editing
     */
    forceOpen: function() {
      this.$el.addClass( classes.forcedOpen );
    },

    forceClose: function() {
      this.$el.removeClass( classes.forcedOpen );
    }
        
  };

  return Dropdown;

 }(jQuery));