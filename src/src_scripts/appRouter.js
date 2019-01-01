import 'navigo';

// Views
import BaseView    from './views/base';
import IndexView    from './views/index';
import ProductView from './views/product';
import CollectionView from './views/collection';
import CartView    from './views/cart';

// TODO - Move the loader and main content bits to variables that get passed in
const $mainContent = $('#MainContent');
const $loader = $('#loader');
let firstRoute = true;

export default class AppRouter {
  constructor(options = {}) {

    const defaults = {
      onRouteStart: $.noop,
      onViewTransitionOutDone: $.noop,
      onViewChangeDOMUpdatesComplete: $.noop
    };

    this.viewConstructors = {
      'index': IndexView,
      'product': ProductView,
      'collection': CollectionView,
      'cart': CartView
    }

    this.router = new Navigo(window.location.origin, false, '#!');
    this.currentView = null;
    this.settings = $.extend({}, defaults, options);

    // Add Routes
    this.router.on('/products/:slug', (params) => {
      this.doRoute('/products/' + params.slug, 'product');
    });

    this.router.on('/collections/:slug', (params, query) => {
      var url = '/collections/' + params.slug;
      if(query) {
        url += `?${query}`;
      }
      this.doRoute(url, 'collection');
    });

    this.router.on('/cart', (params) => {
      this.doRoute('/cart');
    });

    this.router.on('/pages/:slug', (params) => {
      this.doRoute('/pages/' + params.slug, 'page');
    })

    this.router.on('/', () => {
      this.doRoute('/', 'index');
    });

    this.router.notFound((params) => {
      // called when there is path specified but
      // there is no route matching
      console.log(params);
    });

    this.router.resolve();    
  }

  doRoute(url, type) {
    const self = this;
    const viewConstructor = this.viewConstructors[type] || BaseView;

    if(firstRoute) {
      this.currentView = new viewConstructor($mainContent);   
      firstRoute = false;
      return;
    }

    const transitionDeferred = $.Deferred();
    const ajaxDeferred       = $.Deferred();

    // Add a timeout to do a basic redirect to the url if the request takes longer than a few seconds
    const t = setTimeout(() => {
      window.location = url;
    }, 4000);

    $.get(url, function(response) {
      clearTimeout(t);
      ajaxDeferred.resolve(response);
    });

    this.settings.onRouteStart(url);

    // Let the current view do it's 'out' transition and then apply the loading state
    this.currentView.transitionOut(() => {

      this.settings.onViewTransitionOutDone(url);

      $loader.addClass('is-visible');
      $loader.on('transitionend', function() {      
        transitionDeferred.resolve();
      });
    });

    // Once AJAX *and* css animations are done, trigger the callback
    $.when(ajaxDeferred, transitionDeferred).done((response) => {
      this.doViewChange(response, viewConstructor);
    }); 
  }

  doViewChange(AJAXResponse, viewConstructor) {
    // Kill the current view
    this.currentView.destroy();

    const $html = $(AJAXResponse);
    const title = $html.filter('title').text();
    const $dom  = $html.find('#MainContent .layout-main-content');

    // Do DOM updates
    document.title = title;
    $mainContent.find('.layout-main-content').replaceWith($dom);
    // Finish DOM updates

    this.settings.onViewChangeDOMUpdatesComplete();

    this.currentView = new viewConstructor($mainContent);

    $mainContent.imagesLoaded(() => {
      $loader.removeClass('is-visible');
      this.currentView.transitionIn();
    });
  }

  navigate(url) {
    this.router.navigate(url);
  }

}