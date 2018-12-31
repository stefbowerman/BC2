export default class BaseSection {
  
  constructor(container) {
    this.$container = container instanceof $ ? container : $(container);
    // console.log('constructing!');
    // console.log(this);

    this.$container.on({
      'shopify:section:load': this.onSectionLoad.bind(this),
      'shopify:section:unload': this.onSectionUnload.bind(this),
      'shopify:section:select': this.onSelect.bind(this),
      'shopify:section:deselect': this.onDeselect.bind(this),
      'shopify:section:reorder': this.onReorder.bind(this),
      'shopify:block:select': this.onBlockSelect.bind(this),
      'shopify:block:deselect': this.onBlockDeselect.bind(this)
    });
  }

  onSectionLoad(evt) {

  }

  onSectionUnload(evt) {

  }

  onSelect(evt) {
    console.log('onselect in base section');
  }

  onDeselect(evt) {

  }

  onReorder(evt) {

  }

  onBlockSelect(evt) {

  }

  onBlockDeselect(evt) {

  }

}