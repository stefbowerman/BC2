/**
 * Model - Collection Filters - Desktop + Mobile
 * ------------------------------------------------------------------------------
 *
 * @namespace - models.collectionFilters
 */

slate.models = slate.models || {}; 

slate.models.CollectionFilters = (function(){

  var $body = $(document.body);
  
  var selectors = {
    filterSelect: '[data-filters-type][data-filters-type-select]',
    mobileFilterGroup: '[data-mobile-filter-group]',
    mobileFilterTag: '[data-mobile-filter-tag][data-mobile-filter-type]',
    mobileFilterApply: '[data-mobile-filter-apply]'    
  };

  var classes = {
    mobileFilterTagSelected: 'is-selected'
  };  

  /**
   * CollectionFilters constructor
   *
   * @param {HTMLElement} container - Container element used for scoping any element selection
   * @param {Object} collectionData - see the bottom of `sections/collection.liquid`
   */
  function CollectionFilters(container, collectionData) {
    this.$container = $(container);

    this.name = 'collectionFilters';
    this.namespace = '.'+this.name;

    // Stop parsing if we don't have the collection data
    if (!collectionData) {
      return;
    }

    this.collectionData = collectionData;

    this.$filterSelects    = $(selectors.filterSelect, this.$container);
    this.$mobileFilterTags = $(selectors.mobileFilterTag, this.$container);

    this.$container.on('change', selectors.filterSelect, this.onFilterSelectChange.bind(this));
    this.$container.on('click',  selectors.mobileFilterTag, this.onMobileFilterTagClick.bind(this));
    this.$container.on('click',  selectors.mobileFilterApply, this.onMobileFilterApplyClick.bind(this));

    this._sortFilters();
  }

  CollectionFilters.prototype = $.extend({}, CollectionFilters.prototype, {

    /**
     * Returns a url for the current collection with selected tags
     *
     * @return {string} - url
     */
    _getCollectionUrlWithTags: function(tags) {
      var collectionUrl = this.collectionData.url;
      
      tags = tags || [];

      tags = tags.map(function (str) {
        return str
          .toLowerCase()
          .replace(/[^\w\u00C0-\u024f]+/g, "-")
          .replace(/^-+|-+$/g, "");
      });

      return tags.length ? collectionUrl + '/' + tags.join('+') : collectionUrl;
    },

    _getSelectedTags: function() {
      return $.map(this.$filterSelects.find('option:selected'), function(opt, i) {
        // Make sure we don't push empty strings
        if($(opt).val()) {
          return $(opt).val();
        }
      });
    },

    _getSelectedMobileTags: function() {
      return $.map(this.$mobileFilterTags, function(tag, i) {
        if($(tag).hasClass(classes.mobileFilterTagSelected)) {
          return $(tag).data('mobile-filter-tag');
        }
      });
    },

    _sortingFunctions: {

      /**
       * Sorts sizes based on a predefined order
       *
       * @param (string) a
       * @param (string) b
       * @return (int)
       */
      size: function(a, b) {
        console.warn('[collectionFilters] - _sortingFunctions.size - This method hasn\'t been implemented yet.');
        // Implement this so sizes show up how we expect them to? small, med, large..
      }
    },

    /**
     * Sorts the filter options inside each select tag if there is an applicable sort function available
     */
    _sortFilters: function() {
      var self = this;

      this.$filterSelects.each(function(){
        var $select = $(this);
        var $toSort = $select.find('option');
        var sortingFunction = self._sortingFunctions[ $select.data('filters-type') ];

        if(sortingFunction){
          $toSort.sort(function(a, b) {
            return sortingFunction($(a).val(), $(b).val());
          });
        }
      });
    },

    /**
     * Redirects the browser to the passed in URL while mainting the query string
     *
     * @param (string) url
     */
    redirect: function(url) {
      window.location.href = url + slate.utils.getQueryString();
    },

    /**
     * Redirects the browser to the collection page without any filters applied
     */
    clear: function() {
      window.location.href = this.collectionData.url + slate.utils.getQueryString();
    },   

    /**
     * Applies the selected filter options
     * Looks for selected options and creates a URL for them, then redirects the browser
     *
     * @param (event) e - click event
     */
    onFilterSelectChange: function(e) {

      var selectedTags = this._getSelectedTags();
      var url = this._getCollectionUrlWithTags(selectedTags);

      this.redirect(url);      
    },

    /**
     * Toggles the selected class for the clicked on filter tag while removing the selected class from other filter tags in the same group
     *
     * @param (event) e - click event
     */
    onMobileFilterTagClick: function(e) {
      e.preventDefault();

      var $tag = $(e.currentTarget);
      var tagIsSelected = $tag.hasClass(classes.mobileFilterTagSelected);
      
      $tag.parents(selectors.mobileFilterGroup).find(selectors.mobileFilterTag).removeClass(classes.mobileFilterTagSelected);

      if(!tagIsSelected) {
        $tag.addClass(classes.mobileFilterTagSelected);  
      }
      
    },

    /**
     * Applies the selected mobile filter tags.
     * Looks for selected tags and creates a URL for them, then redirects the browser
     *
     * @param (event) e - click event
     */
    onMobileFilterApplyClick: function(e) {
      e.preventDefault();

      var selectedTags = this._getSelectedMobileTags();
      var url = this._getCollectionUrlWithTags(selectedTags);

      this.redirect(url);
    }    
  });

  return CollectionFilters;
})();