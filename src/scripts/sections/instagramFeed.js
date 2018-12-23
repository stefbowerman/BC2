/**
 * Instagram Feed Section Script
 * ------------------------------------------------------------------------------
 * 
 * Uses Instafeed.js to interact with Instagram API
 *   - See instafeedjs.com for documentation
 *   - See scripts/vendor directory for source file
 *
 * @namespace - instagramFeed
 */

theme.InstagramFeed = (function($, Instafeed) {

  var selectors = {
    target: '[data-instagram-feed-target]',
    template: 'script[data-instagram-media-template]'
  };

  var classes = {

  };

  /**
   * Instagram Feed section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function InstagramFeed(container) {
    this.$container = $(container);

    this.name = 'instagramFeed';
    this.namespace = '.'+this.name;

    this.$target = $(selectors.target, this.$container);

    // Compile this once during initialization
    this.template = Handlebars.compile($(selectors.template).html());    

    this.settings = {
      accessToken: this.$container.attr('data-access-token'),
      get: 'user',
      mock: true,
      success: this.onInstafeedMockSuccess.bind(this),
      limit: this.$container.attr('data-limit') || 8
    };

    if(!this.settings.accessToken) {
      console.warn('[InstagramFeed] - An access token is required to interact with the Instagram API');
      return;
    }

    this.init();
  }

  InstagramFeed.prototype = $.extend({}, InstagramFeed.prototype, {

    /**
     * Kick off the network requests.  Retrieve the user profile from the API and then fire up the feed.
     *
     */
    init: function() {
      $.ajax({
        type: 'GET',
        url: 'https://api.instagram.com/v1/users/self?access_token=' + this.settings.accessToken,
        dataType: 'jsonp'
      })
      .then(function(response){
        
        // Handle invalid response
        if(response.meta.hasOwnProperty('error_message')){
          console.warn('['+this.name+'] - ' + response.meta.error_message);
          return;
        }

        this.settings.userId = response.data.id;

        /*
         *  Use this space to make any adjustments to the section now that you have access to the user profile object
         */

        this.feed = new Instafeed(this.settings);
        this.feed.run();
      }.bind(this));
    },

  /**
   * Callback that runs after Instafeed.run() if the 'mock' setting is set to true
   * Use this function to sort through images, select proper resolution, and construct a gallery of images to insert into the DOM
   *
   * @param {Object} feed - object returned from Instagram API
   * @param {Array} feed.data - Array of feed data objects containing images + info
   */
    onInstafeedMockSuccess: function(feed) {
      
      var self = this;

      feed.data.forEach(function(photo){

        var data = {
          url: photo.link,
          src: photo.images && photo.images.standard_resolution && photo.images.standard_resolution.url,
          caption: photo.caption && photo.caption.text || ''
        };

        self.$target.append(self.template(data));
      });

    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      console.log('['+this.name+'] - section:select');
    },

    onShow: function() {
      console.log('['+this.name+'] - section:show');
    },

    onLoad: function() {
      console.log('['+this.name+'] - section::load');
    },

    onUnload: function() {
      console.log('['+this.name+'] - section::unload');
    }
  });

  return InstagramFeed;
})(jQuery, Instafeed);
