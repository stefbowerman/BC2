import BaseView from "./base";

export default class CollectionView extends BaseView {
  
  constructor($el) {
    super($el);
  }

  transitionOut(callback) {
    $("html, body").animate({ scrollTop: 0 }, 300);
    setTimeout(callback, 150);
  }
}