import BaseSection from "./base";


export default class CollectionSection extends BaseSection {

  constructor(container) {
    super(container);
    this.name = 'collection';
    this.namespace = `.${this.name}`;
    console.log('constructing collection view');
  }
  
}