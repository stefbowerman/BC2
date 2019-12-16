import 'navigo';
import BaseView from './views/base';

const $body = $(document.body);
const TEMPLATE_REGEX = /(^|\s)template-\S+/g;
let firstRoute = true;

export default class AppRouter {
  constructor(options = {}) {
    const defaults = {
      viewContainerSelector: '#view-container',
      viewContentSelector: '#view-content',
      viewConstructors: {},
      onRouteStart: () => {},
      onViewTransitionOutDone: (url, d) => { d.resolve(); },
      onViewChangeStart: () => {},
      onViewChangeDOMUpdatesComplete: () => {},
      redirectTimeout: 5000
    };

    this.router = new Navigo(window.location.origin, false, '#!'); // eslint-disable-line no-undef
    this.isTransitioning = false;
    this.currentView = null;
    this.settings = $.extend({}, defaults, options);

    this.$viewContainer = $(this.settings.viewContainerSelector);

    // Add Routes
    this.router.on('/products/:slug', (params) => {
      this.doRoute(`/products/${params.slug}`, 'product');
    });

    // Product preview - This is an important route otherwise the admin product preview functionality won't work!
    this.router.on('/products_preview', (params, query) => {
      this.doRoute(`/products_preview?${query}`, 'product');
    });

    // Product within collection
    this.router.on('/collections/:slug/products/:handle', (params, query) => {
      this.doRoute(`/collections/${params.slug}/products/${params.handle}`, 'product');
    });    

    this.router.on('/collections/:slug', (params, query) => {
      let url = `/collections/${params.slug}`;

      if (query) {
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
      this.doRoute('/cart', 'cart');
    });

    this.router.on('/pages/:slug', (params) => {
      const slug = params.slug;

      // @TODO - What to do about this hmmm
      if (slug.indexOf('contact') > -1) {
        this.doRoute(`/pages/${slug}`, 'contact');
      }
      else if (slug.indexOf('stockists') > -1) {
        this.doRoute(`/pages/${slug}`, 'stockists');
      }
      else {
        this.doRoute(`/pages/${slug}`, 'page');
      }
    })

    this.router.on('/', () => {
      this.doRoute('/', 'index');
    });

    this.router.on('/challenge', () => {
      this.doRoute('/challenge');
    });

    this.router.notFound((params) => {
      // called when there is path specified but
      // there is no route matching
      // console.log(params);
      this.router.navigate('/'); // Just go back home
    });

    this.router.resolve();
  }

  doRoute(url, type) {
    const ViewConstructor = this.settings.viewConstructors[type] || BaseView;

    if (firstRoute) {
      this.currentView = new ViewConstructor(this.$viewContainer);   
      firstRoute = false;
      return;
    }

    this.isTransitioning = true;

    const transitionDeferred = $.Deferred();
    const ajaxDeferred       = $.Deferred();

    // Add a timeout to do a basic redirect to the url if the request takes longer than a few seconds
    const t = setTimeout(() => {
      window.location = url;
    }, this.settings.redirectTimeout);

    $.get(url, (response) => {
      clearTimeout(t);
      ajaxDeferred.resolve(response);
    });

    this.settings.onRouteStart(url);

    // Let the current view do it's 'out' transition and then apply the loading state
    this.currentView.transitionOut(() => {
      this.settings.onViewTransitionOutDone(url, transitionDeferred);
    });

    // Once AJAX *and* css animations are done, trigger the callback
    $.when(ajaxDeferred, transitionDeferred).done((response) => {
      this.doViewChange(response, ViewConstructor, url);
    }); 
  }

  doViewChange(AJAXResponse, ViewConstructor, url) {
    this.settings.onViewChangeStart(url)

    this.currentView.destroy(); // Kill the current view

    const $responseHtml = $(document.createElement('html'));
    
    $responseHtml.get(0).innerHTML = AJAXResponse;

    const $responseHead = $responseHtml.find('head');
    const $responseBody = $responseHtml.find('body');

    const $dom  = $responseBody.find(this.settings.viewContentSelector);

    // Do DOM updates
    document.title = $responseHead.find('title').text();
    this.$viewContainer.find(this.settings.viewContentSelector).replaceWith($dom);
    $body.removeClass((i, classname) => {
      return (classname.match(TEMPLATE_REGEX) || []).join(' ');
    });

    $body.addClass(() => {
      return $responseBody.attr('class').split(' ').map((classname) => {
        return classname.match(TEMPLATE_REGEX);
      }).join(' ');
    });

    // Finish DOM updates
    this.settings.onViewChangeDOMUpdatesComplete($responseHead, $responseBody);

    this.currentView = new ViewConstructor(this.$viewContainer);

    this.$viewContainer.imagesLoaded(() => {
      this.settings.onViewReady(this.currentView);
      this.currentView.transitionIn();
    });

    this.isTransitioning = false;
  }

  navigate(url) {
    this.router.navigate(url);
  }
}
