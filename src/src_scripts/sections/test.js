import BaseSection from "./base";

export default class TestSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'test';
    this.namespace = `.${this.name}`;

    this.$container.append(new Date());
     
  }
  
}