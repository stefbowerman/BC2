import 'navigo';
import Utils from './utils';

// Sections
// import SectionManager  from './sectionManager';
import HeaderSection   from './sections/header';
import FooterSection   from './sections/footer';
import AJAXCartSection from './sections/ajaxCart';

// Views
import BaseView    from './views/base';
import ProductView from './views/product';
import CartView    from './views/cart';

(($, Navigo) => {

  // console.log(`I have 8 ${Utils.pluralize(8, 'dog', 'dogs')}`);

  // Sections Stuff 
  // window.sectionManager = new SectionManager();

  // sectionManager.register('header', HeaderSection);
  // sectionManager.register('footer', FooterSection);
  // sectionManager.register('product', ProductSection);
  // sectionManager.register('cart', CartSection);

  const sections = {};

  sections.header   = new HeaderSection(   $('[data-section-type="header"]')    );
  sections.footer   = new FooterSection(   $('[data-section-type="footer"]')    );
  sections.ajaxCart = new AJAXCartSection( $('[data-section-type="ajax-cart"]') );
  
  console.log(sections);

  // Misc Stuff

  // Chosen JS plugin for select boxes
  Utils.chosenSelects();

  // Apply UA classes to the document
  Utils.userAgentBodyClass();    

  // Apply a specific class to the html element for browser support of cookies.
  if (Utils.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
  // END Misc Stuff

  // Test router
  const $mainContent = $('#MainContent');
  const $loader = $('#loader');
  const root = window.location.origin;
  const useHash = false; // Defaults to: false
  const hash = '#!'; // Defaults to: '#'
  let firstRoute = true;
  let currentView = null;

  const viewContructors = {
    'product': ProductView,
    'cart': CartView
  }

  const doPageChange = function(url, type) {
    
    const viewContructor = viewContructors[type] || BaseView;

    if(firstRoute) {
      currentView = new viewContructor($mainContent);   
      firstRoute = false;
      return;
    }

    let t = null; // Add a timeout to do a basic redirect to the url if the request takes longer than a few seconds
    const transitionDeferred = $.Deferred();
    const ajaxDeferred       = $.Deferred();

    const callBack = function(response) {
      // Kill the current view
      currentView.destroy();

      const $html = $(response);
      const title = $html.filter('title').text();
      const $dom  = $html.find('#MainContent .layout-main-content');


      // Do DOM updates
      document.title = title;
      $mainContent.find('.layout-main-content').replaceWith($dom);
      // Finish DOM updates

      window.scrollTop = 0;

      console.log('instantiate new view for ' + type);
      currentView = new viewContructor($mainContent);

      $mainContent.imagesLoaded(function() {
        $loader.removeClass('is-visible');
        currentView.transitionIn();
      });
    };

    t = setTimeout(() => {
      window.location = url;
    }, 4000);

    $.get(url, function(response) {
      clearTimeout(t);
      ajaxDeferred.resolve(response);
    });

    // Let the current view do it's 'out' transition and then apply the loading state
    currentView.transitionOut(() => {
      $loader.addClass('is-visible');
      $loader.on('transitionend', function() {      
        transitionDeferred.resolve();
      });
    });

    // Once AJAX *and* css animations are done, trigger the callback
    $.when(ajaxDeferred, transitionDeferred).done(function(response) {
      callBack(response);
    });    
  }


  window.router = new Navigo(root, useHash, '#!');

  router.on('/products/:slug', (params) => {
    doPageChange('/products/' + params.slug, 'product');
  })
  .on('/collections/:slug', (params, query) => {
    var url = '/collections/' + params.slug;
    if(query) {
      url += '?' + query;
    }
    doPageChange(url, 'collection');
  })
  router.on('/cart', (params) => {
    doPageChange('/cart');
  })
  router.on('/pages/:slug', (params) => {
    doPageChange('/pages/' + params.slug, 'page');
  })  
  .on('/', () => {
    doPageChange('/', 'home');
  });

  router.notFound((params) => {
    // called when there is path specified but
    // there is no route matching
    console.log(params);
  });

  router.resolve();

  // Stop here...no AJAX navigation inside the theme editor
  if(Shopify && Shopify.designMode) {
    return;
  }  

  const host = window.location.host;

  $(document.body).on('click', 'a', (e) => {
    if(e.isDefaultPrevented()) return;
    const url = e.currentTarget.getAttribute('href');
    const testAnchor = document.createElement('a');
          testAnchor.href = url;

    if(testAnchor.host != window.location.host) return;

    e.preventDefault();
    router.navigate(url);
  });  

})(jQuery, Navigo);