export default class BaseView {
  
  constructor($el) {
    this.$el = $el;
    console.log('contructing view');
  }

  destroy() {
    console.log('calling destroy from the baseview');
  }

  transitionIn() {
    //
    console.log('transition in!');
  }

  transitionOut(callback) {
    callback();
  }
}