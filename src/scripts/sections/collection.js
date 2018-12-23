/**
 * Collection Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Collection template.
 *
 * @namespace collection
 */

 theme.Collection = (function(slate) {

  var selectors = {
    collectionJson: '[data-collection-json]'
  };
  
  function Collection(container) {
    this.$container = $(container);

    this.name = 'collection';
    this.namespace = '.'+this.name;

    // Stop parsing if we don't have the collection json script tag
    if (!$(selectors.collectionJson, this.$container).html()) {
      console.warn('['+this.name+'] - Element matching ' + selectors.collectionJson + ' required.');
      return;
    }

    this.collectionData = JSON.parse($(selectors.collectionJson, this.$container).html());

    this.filters = new slate.models.CollectionFilters( container, this.collectionData );
    this.sort    = new slate.models.CollectionSort( container, this.collectionData );

  }

  Collection.prototype = $.extend({}, Collection.prototype, {

  });

  return Collection;

 })(slate);
 