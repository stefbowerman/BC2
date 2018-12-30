import BaseSection from "./base";

const selectors = {};

export default class FooterSection extends BaseSection {

  constructor(container) {
    super(container);

    this.name = 'footer';
    this.namespace = `.${this.name}`;
  }
  
}