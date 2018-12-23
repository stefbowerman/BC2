/**
 * Header Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - header
 */

theme.Header = (function($) {

  var $window = $(window);
  var $body   = $(document.body);

  var selectors = {
    header: '[data-header]',
    dropdownTrigger: '[data-dropdown-trigger][data-block]',
  };

  var classes = {
    headerFixed: 'is-fixed',
    siteHasFixedHeader: 'site-fixed-header'
  };

  function Header(container) {

    var _this = this;

    this.$container = $(container);
    this.$el = $(selectors.header, this.$container);
    this.name = 'header';
    this.namespace = '.'+this.name;
    this.dropdownManager = new slate.models.DropdownManager();

    this.events = {
      SCROLL: 'scroll' + this.namespace
    };    

    // Register each dropdown trigger
    $(selectors.dropdownTrigger, this.$container).each(function(i, trigger) {
      _this.dropdownManager.register( $(trigger) );
    });

    this.$container.on('pointerenter mouseenter', this.onMouseEnter.bind(this));
    this.$container.on('pointerleave mouseleave', this.onMouseLeave.bind(this));

    // We pass in the fixed behavior as a class on the body of the site
    if($body.hasClass(classes.siteHasFixedHeader)) {
      $window.on(this.events.SCROLL, $.throttle(20, this.onScroll.bind(this)));
      this.onScroll(); // hit this one time on init to make sure everything is good 
    }

  }

  Header.prototype = $.extend({}, Header.prototype, {

    scrollCheck: function() {
      // Do measurements outside of rAF.
      var scrollTop = $window.scrollTop();
      var actualOffset = this.$container.offset()['top'] - this.$el.outerHeight();

      // Do DOM updates inside.
      requestAnimationFrame(function() {
        if( scrollTop < actualOffset ){
          this.$el.removeClass( classes.headerFixed );
        }
        else {
          this.$el.addClass( classes.headerFixed );
        }
      }.bind(this));

    },    

    onScroll: function() {
      this.scrollCheck();
    },    

    onMouseEnter: function() {

    },

    onMouseLeave: function() {
      this.dropdownManager.closeAllDropdowns();
    },    

    /**
     * Theme Editor section events below
     */

    onBlockSelect: function(e) {
      var dropdown = this.dropdownManager.getDropdownByBlockId( e.detail.blockId );

      // Bypass dropdown manager since we're inside the theme editor
      if(dropdown) {
        dropdown.forceOpen();
      }
    },

    onBlockDeselect: function(e) {
      var dropdown = this.dropdownManager.getDropdownByBlockId( e.detail.blockId );

      // Bypass dropdown manager since we're inside the theme editor
      if(dropdown) {
        dropdown.forceClose();
      }
    }    
  });

  return Header;
})(jQuery);
