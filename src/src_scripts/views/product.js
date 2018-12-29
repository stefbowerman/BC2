import BaseView from "./base";

export default class ProductView extends BaseView {
  
  constructor() {
    super();
  }

  destroy() {
    console.log('calling destroy from the product view');
  }
}