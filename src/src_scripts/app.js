import 'navigo';
import Utils from './utils';

import ProductView from './views/product';

(($, Navigo) => {

  console.log(`I have 8 ${Utils.pluralize(8, 'dog', 'dogs')}`);

  // Test router
  const $mainContent = $('#MainContent');
  const root = window.location.origin;
  const useHash = false; // Defaults to: false
  const hash = '#!'; // Defaults to: '#'
  let firstRoute = true;
  let currentView = null;

  const viewContructors = {
    'product': ProductView
  }

  const doPageChange = function(url, type) {

    if(firstRoute) {
      if(viewContructors.hasOwnProperty(type)) {
        currentView = new viewContructors[type]($mainContent);
      }        
      firstRoute = false;
      return;
    }


    // Kill the current view
    currentView && currentView.destroy && currentView.destroy();

    // Add a timeout to do a basic redirect to the url if the request takes longer than a few seconds
    var t = setTimeout(function() {
      window.location = url;
    }, 3000);

    $.get(url, function(response) {
      clearTimeout(t);
      var $html = $(response);
      var title = $html.filter('title').text();
      var $dom  = $html.find('#MainContent .layout-main-content');


      $mainContent.find('.layout-main-content').replaceWith($dom);
      document.title = title;

      console.log('instantiate new view for ' + type);
      if(viewContructors.hasOwnProperty(type)) {
        currentView = new viewContructors[type]($mainContent);
      }        

      $mainContent.imagesLoaded(function() {
        window.scrollTop = 0;
        $mainContent.removeClass('go-away');
      });
      console.log('after');
    });
  }

  const beforePageChange = function(done, params) {
    if(firstRoute) {
      // firstRoute = false;
      done();
      return;
    }    
    $mainContent.addClass('go-away');
    setTimeout(function() { done(); }, 500);
  }





  window.router = new Navigo(root, useHash, '#!');

  router.on('/products/:slug', (params) => {
    doPageChange('/products/' + params.slug, 'product');
  })
  .on('/collections/:slug', (params, query) => {
    console.log(params);
    console.log(query);
    var url = '/collections/' + params.slug;
    if(query) {
      url += '?' + query;
    }
    doPageChange(url, 'collection');
  })
  router.on('/cart', (params) => {
    doPageChange('/cart');
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

  $(document.body).on('click', 'a', (e) => {
    if(e.isDefaultPrevented()) return;
    e.preventDefault();
    router.navigate(e.currentTarget.getAttribute('href'));
  });  

})(jQuery, Navigo);