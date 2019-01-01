const shopifyEvents = [
  'shopify:section:unload',
  'shopify:section:select',
  'shopify:section:deselect',
  'shopify:section:reorder',
  'shopify:block:select',
  'shopify:block:deselect'
];

export default class BaseSection {
  
  constructor(container) {
    this.$container = container instanceof $ ? container : $(container);
    this.id = this.$container.data('section-id');
    this.type = this.$container.data('section-type');

    $(document).on(shopifyEvents.join(' '), this.onShopifyEvent.bind(this));
  }

  onShopifyEvent(e) {
    if(e.detail.sectionId != this.id.toString()) {
      return;
    }

    switch(e.type) {
      case 'shopify:section:unload':
        this.onUnload(e);
        break;
      case 'shopify:section:select':
        this.onSelect(e);
        break;
      case 'shopify:section:deselect':
        this.onDeselect(e);
        break;
      case 'shopify:section:reorder':
        this.onReorder(e);
        break;
      case 'shopify:block:select':
        this.onBlockSelect(e);
        break;
      case 'shopify:block:deselect':
        this.onBlockDeselect(e);
        break;
    }
  }

  onUnload(e) {
    console.log('[BaseSection] - removing event listeners - onSectionUnload');
    $(document).off(shopifyEvents.join(' '), this.onShopifyEvent.bind(this));
  }

  onSelect(e) {
    console.log('onselect in base section');  
  }

  onDeselect(e) {

  }

  onReorder(e) {

  }

  onBlockSelect(e) {

  }

  onBlockDeselect(e) {

  }

}