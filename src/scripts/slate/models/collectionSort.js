/**
 * Model - Collection Sort
 * ------------------------------------------------------------------------------
 *
 * Dependencies
 *  - slate.utils
 *
 * @namespace - models.collectionSort
 */

 slate.models.CollectionSort = (function(){

  var $body = $(document.body);
  
  var selectors = {
    sortSelect: '[data-sort-select]'
  };

  /**
   * CollectionSort constructor
   *
   * @param {HTMLElement} container - Container element used for scoping any element selection
   * @param {Object} collectionData - see the bottom of `sections/collection.liquid`
   */
  function CollectionSort(container, collectionData) {
    this.$container = $(container);

    this.name = 'collectionSort';
    this.namespace = '.'+this.name;

    // Stop parsing if we don't have the collection data
    if (!collectionData) {
      return;
    }

    this.collectionData = collectionData;

    this.$container.on('change', selectors.sortSelect, this.applySort.bind(this));
  }

  CollectionSort.prototype = $.extend({}, CollectionSort.prototype, {
    applySort: function() {
      var sortBy = $(selectors.sortSelect, this.container).find('option:selected').val();
      var queryParams = slate.utils.getQueryParams();

      if(sortBy !== this.collectionData.sortDefault) {
        queryParams.sort_by = sortBy;
      }
      else {
        delete queryParams.sort_by;
      }

      location.search = $.param(queryParams);
    }
  });

  return CollectionSort;
})();