/**
 * Collection Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Collection template.
 *
 * @namespace collection
 */

 theme.Collection = (function(slate) {

  var selectors = {
  };
  
  function Collection(container) {
    this.$container = $(container);

    this.name = 'collection';
    this.namespace = '.'+this.name;
  }

  Collection.prototype = $.extend({}, Collection.prototype, {

  });

  return Collection;

 })(slate);
 