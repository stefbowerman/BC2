/**
 * Model - DropdownManager
 * -----------------------------------------------------------------------------
 *
 * Requires:
 *  - slate.models.Dropdown
 *  - slate.utils
 *
 * @namespace models.DropdownManager
 */

 slate.models = slate.models || {};

 slate.models.DropdownManager = (function($) {

  /**
   * DropdownManager - Manages opening / closing of all dropdowns.  Makes sure only one shows at a time.
   *
   * @constructor
   * @param {function} dropdownConstructor
   */
  function DropdownManager() {

    this.closeDropdownTimeout = null;
    this.closeDropdownTimeoutDuration = 80;
    this.dropdowns = [];
    this.activeDropdown = undefined;

    this.events = window.PointerEvent ? {
                  end:   "pointerup",
                  enter: "pointerenter",
                  leave: "pointerleave"
                } : {
                  end: "touchend",
                  enter: "mouseenter",
                  leave: "mouseleave"
                };

  }

  DropdownManager.prototype = {
    register: function($trigger) {
      var dd = new slate.models.Dropdown($trigger);

      // Trigger events - the link that you interact with to display the dropdown
      dd.$trigger.on(this.events.enter,  this.onTriggerMouseEnter.bind(this, dd));
      dd.$trigger.on(this.events.leave,  this.onTriggerMouseLeave.bind(this, dd));
      dd.$trigger.on(this.events.end,    this.onTriggerTouchEnd.bind(this, dd));

      // Dropdown events - what happens when you interact with the dropdown itself
      dd.$el.on(this.events.leave, this.onDropdownMouseLeave.bind(this, dd));
      dd.$el.on(this.events.enter, this.onDropdownMouseEnter.bind(this, dd));
      dd.$el.on(this.events.end,   this.onDropdownTouchEnd.bind(this, dd));

      this.dropdowns.push(dd);
    },    
    getDropdownByBlockId: function(id) {
      return slate.utils.findInstance(this.dropdowns, 'blockId', id);
    },
    onTriggerMouseEnter: function(dd, e) {
      if(e.pointerType != "touch") {
        this.stopCloseTimeout();
        this.openDropdown(dd);
      }
    },
    onTriggerMouseLeave: function(dd, e) {
      if(e.pointerType != "touch") {
        this.startCloseTimeout(dd);
      }
    },
    onTriggerTouchEnd: function(dd, e) {
      e.preventDefault();
      e.stopPropagation();
      this.toggleDropdown(dd);
    },
    onDropdownMouseEnter: function(dd, e) {
      if(e.pointerType != "touch") {
        this.stopCloseTimeout();
      }
    },
    onDropdownMouseLeave: function(dd, e) {
      if(e.pointerType != "touch") {
        this.startCloseTimeout(dd);
      }
    },
    onDropdownTouchEnd: function(dd, e) {
      e.stopPropagation();
    },
    toggleDropdown: function(dd) {
      return this.activeDropdown == dd ? this.closeDropdown(dd) : this.openDropdown(dd);
    },
    openDropdown: function(dd) {
      if(this.activeDropdown !== dd) {
        this.activeDropdown = dd;
        this.closeAllDropdowns();
        dd.open();
      }
    },
    closeDropdown: function(dd) {
      dd.close();

      if(this.activeDropdown == dd) {
        this.activeDropdown = undefined;
      }
    },
    closeAllDropdowns: function() {
      $.each(this.dropdowns, function(i, dd) {
        if(dd.isOpen()) {
          dd.close();
        }
      });
      this.activeDropdown = undefined;
    },
    startCloseTimeout: function(dd) {
      this.closeDropdownTimeout = setTimeout(this.closeDropdown.bind(this, dd), this.closeDropdownTimeoutDuration);
    },
    stopCloseTimeout: function() {
      clearTimeout(this.closeDropdownTimeout);
    }
  };

  return DropdownManager;

 }(jQuery));