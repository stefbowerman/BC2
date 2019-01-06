import 'navigo';

// Views
import BaseView       from './views/base';
import IndexView      from './views/index';
import ProductView    from './views/product';
import CollectionView from './views/collection';
import CartView       from './views/cart';

// TODO - Move the loader and main content bits to variables that get passed in
const $body = $(document.body);
const $mainContent = $('#MainContent');
const $loader = $('#loader');
const TEMPLATE_REGEX = /(^|\s)template-\S+/g;
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
      this.doRoute(`/products/${params.slug}`, 'product');
    });

    // Product within collection
    this.router.on('/collections/:slug/products/:handle', (params, query) => {
      this.doRoute(`/collections/${params.slug}/products/${params.handle}`, 'product');
    });    

    this.router.on('/collections/:slug', (params, query) => {
      var url = `/collections/${params.slug}`;
      if(query) {
        url += `?${query}`;
      }
      this.doRoute(url, 'collection');
    });

    this.router.on('/collections', () => {
      this.doRoute('/collections', 'list-collections');
    });

    this.router.on('/products', () => {
      this.doRoute('/products', 'list-collections');
    });    

    this.router.on('/cart', (params) => {
      this.doRoute('/cart');
    });

    this.router.on('/pages/:slug', (params) => {
      this.doRoute(`/pages/${params.slug}`, 'page');
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

    const $responseHtml = $(document.createElement("html"));
    
    $responseHtml.get(0).innerHTML = AJAXResponse;

    const $responseHead = $responseHtml.find('head');
    const $responseBody = $responseHtml.find('body');

    const $dom  = $responseBody.find('#MainContent .layout-main-content');

    // Do DOM updates
    document.title = $responseHead.find('title').text();
    $mainContent.find('.layout-main-content').replaceWith($dom);
    $body.removeClass((i, classname) => {
      return (classname.match(TEMPLATE_REGEX) || []).join(' ');
    });

    const responseBodyClasses = $responseBody.attr('class').split(' ');
    $body.addClass((i, classname) => {
      const addClasses = responseBodyClasses.map((classname) => {
        return classname.match(TEMPLATE_REGEX);
      }).join(' ');

      return addClasses;
    });
    // Finish DOM updates

    this.settings.onViewChangeDOMUpdatesComplete($responseHead, $responseBody);

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