/**
 * Quantity Adjuster Scripts
 * -----------------------------------------------------------------------------
 * Handles any events associated with the quantity adjuster component
 *
 *  [data-quantity-adjuster]
 *    [data-increment]
 *    input[type="number"]
 *    [data-decrement]
 *
 */

slate.quantityAdjuster = (function() {

  var selectors = {
    adjuster: '[data-quantity-adjuster]',
    increment: '[data-increment]',
    decrement: '[data-decrement]',
    input: 'input[type="number"]'
  };

  var classes = {

  };

  /**
   * Quantity Adjuster Constructor
   *
   * @param {HTMLElement | jQuery} el - element, either matching selectors.adjuster or a child element
   */
  function QuantityAdjuster(el) {

    this.name = 'quantityAdjuster',
    this.namespace = '.'+this.name;

    this.$el = $(el).is(selectors.adjuster) ? $(el) : $(el).parents(selectors.adjuster);

    if(!this.$el) {
      console.warn('['+this.name+'] - Element required to initialize');
      return;
    }

    this.$increment = $(selectors.increment, this.$el);
    this.$decrement = $(selectors.decrement, this.$el);
    this.$input     = $(selectors.input, this.$el);

    this.$increment.on('click', this.onIncrementClick.bind(this));
    this.$decrement.on('click', this.onDecrementClick.bind(this));
    this.$input.on('change', this.onInputChange.bind(this));

    this._addMutationObserver(this.$input.get(0));

    this._updateDisabledState();
  }

  QuantityAdjuster.prototype = {

    _getMin: function() {
      return parseInt(this.$input.attr('min')) || 0;
    },

    _getMax: function() {
      return parseInt(this.$input.attr('max')) || 999;
    },

    _addMutationObserver: function(el) {
      if(!el) return;

      var observer;
      var config = { attributes: true };
      var self = this;

      observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if(mutation.type == "attributes") {
            if(mutation.attributeName == "max" || mutation.attributeName == "min") {
              self.onMinMaxAttributeChange();
            }
            else if(mutation.attributeName == "disabled") {
              self.onDisabledAttributeChange();
            }
          }
        });
      });

      observer.observe(el, config);
    },

    _updateDisabledState: function() {
      var val = parseInt(this.$input.val());

      if(this.$input.is(':disabled')) {
        this.$increment.prop('disabled', true);
        this.$decrement.prop('disabled', true);
      }
      else {
        if (val == this._getMax() && val == this._getMin()) {
          this.$increment.prop('disabled', true);
          this.$decrement.prop('disabled', true);
        }
        else if(val >= this._getMax()) {
          this.$increment.prop('disabled', true);
          this.$decrement.prop('disabled', false);
        }
        else if(val <= this._getMin()) {
          this.$increment.prop('disabled', false);
          this.$decrement.prop('disabled', true);
        }
        else {
          this.$increment.prop('disabled', false);
          this.$decrement.prop('disabled', false);
        }
      }
    },

    _changeValue: function(amount) {

      if(this.$input.is(':disabled') || typeof amount == "undefined") return;

      amount = parseInt(amount);

      var val = parseInt(this.$input.val());
      var newVal = val + amount;

      // Don't change if the value is the same or invalid
      if(newVal == val || newVal > this._getMax() || newVal < this._getMin()) return;

      this.$input.val(newVal);
      this.$input.trigger('change');
    },

    _clampInputVal: function() {
      var currVal = parseInt(this.$input.val());
      var max = this._getMax();
      var min = this._getMin();

      if(currVal > max) {
        this.$input.val(max);
      }
      else if(currVal < min) {
        this.$input.val(min);
      }
    },

    onDisabledAttributeChange: function() {
      this._updateDisabledState();
    },

    onMinMaxAttributeChange: function() {
      this._clampInputVal();
      this._updateDisabledState();
    },

    onInputChange: function() {
      this._clampInputVal();
      this._updateDisabledState();
    },

    onIncrementClick: function(e) {
      e.preventDefault();
      this._changeValue(1);
    },

    onDecrementClick: function(e) {
      e.preventDefault();
      this._changeValue(-1);
    }
  };

  // End prototype

  // QA DATA-API
  // ===========

  var dataKey = 'quantity-adjuster';

  function ensureQuantityAdjuster(el) {
    var $el =  $(el);

    if(!$el.is(selectors.adjuster)) {
      $el = $el.parents(selectors.adjuster);
    }

    var data = $el.data(dataKey);

    if(!data) {
      $el.data(dataKey, (data = new QuantityAdjuster($el)));
    }

    return data;
  }

  // Check all adjuster elements on the page and initialize them if necessary
  function refresh() {
    $(selectors.adjuster).each(function(i, el) {
      ensureQuantityAdjuster(el);
    });
  }

  $(function() {

    refresh();

    $(document)
      .on('shopify:section:load', refresh)
      .on('shopify:section:unload', refresh)
      .on('shopify:section:select', refresh)
      .on('shopify:section:deselect', refresh)
      .on('shopify:section:reorder', refresh)
      .on('shopify:block:select', refresh)
      .on('shopify:block:deselect', refresh);
  });

  return {
    refresh: refresh
  };

}());
