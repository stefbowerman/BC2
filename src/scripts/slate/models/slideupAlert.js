/**
 * Slideup Alert
 * ------------------------------------------------------------------------------
 *
 * Requires:
 *  - snippets/slideup-template.liquid
 *
 * @namespace - models.SlideupAlert
*/

slate.models = slate.models || {};

slate.models.SlideupAlert = (function($) {

  var $body = $(document.body);

  var selectors = {
    template: 'script[data-slideup-template]'
  };  

 /**
  * Slideup Alert constructor
  *
  * @param {Object} options
  * @param {String} options.title - Title text of the slideup
  * @param {String} options.text - Body text of the slideup
  * @param {Integer} options.timeoutDuration - How long to display the alert before closing automatically (in ms)
  */
  function SlideupAlert(options) {

    this.name = 'slideupAlert';
    this.namespace = '.'+this.name;

    if(!$(selectors.template).length){
      console.warn('['+this.name+'] - Handlebars template required to initialize');
      return;
    }

    var template = Handlebars.compile($(selectors.template).html());
    var defaults = {
      title: null,
      text: null,
      timeoutDuration: 5000
    };
    
    this.settings = $.extend({}, defaults, options);
    this.interactionTimeout = false;

    this.$el = $(template(this.settings));

    this.$el.appendTo($body);

    this.$el.on('shown.slideup', this.onShown.bind(this));
    this.$el.on('hidden.slideup', this.onHidden.bind(this));
    this.$el.on('mouseenter', this.onMouseenter.bind(this));
    this.$el.on('mouseleave', this.onMouseleave.bind(this));    

    this.slideup = new slate.models.Slideup(this.$el);

    setTimeout(function() {
      this.slideup.show();
    }.bind(this), 10);

  }

  SlideupAlert.prototype = $.extend({}, SlideupAlert.prototype, {
    
    setInteractionTimeout: function() {
      this.interactionTimeout = setTimeout(function() {
        this.slideup.hide();
      }.bind(this), this.settings.timeoutDuration);
    },

    clearInteractionTimeout: function() {
      clearTimeout(this.interactionTimeout);
    },

    onMouseenter: function() {
      this.clearInteractionTimeout();
    },

    onMouseleave: function() {
      this.setInteractionTimeout();
    },

    onHidden: function() {
      this.clearInteractionTimeout();
      this.$el.remove();
    },

    onShown: function() {
      this.setInteractionTimeout();
    }

  });

  return SlideupAlert;
}(jQuery));
