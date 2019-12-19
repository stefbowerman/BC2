import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import Utils from './utils';
import AppRouter from './appRouter';
import analytics from './analytics';
import credits from './credits';

// Views - Views are based on template names
import IndexView      from './views/index';
import ProductView    from './views/product';
import CollectionView from './views/collection';
import CartView       from './views/cart';
import PageView       from './views/page';

// Sections
import HeaderSection     from './sections/header';
import NavSection        from './sections/nav';
import FooterSection     from './sections/footer';
import AJAXCartSection   from './sections/ajaxCart';
import MobileMenuSection from './sections/mobileMenu';

(($) => {
  const $body   = $(document.body);
  const $loader = $('#loader');
  const $title  = $('#title');

  const transitionEndEvent = Utils.whichTransitionEnd();
  const sections = {};

  sections.header     = new HeaderSection($('[data-section-type="header"]'));
  sections.nav        = new NavSection($('[data-section-type="nav"]'));
  sections.footer     = new FooterSection($('[data-section-type="footer"]'));
  sections.ajaxCart   = new AJAXCartSection($('[data-section-type="ajax-cart"]'));
  sections.mobileMenu = new MobileMenuSection($('[data-section-type="mobile-menu"]'));
  
  const appRouter = new AppRouter({
    viewConstructors: {
      index: IndexView,
      product: ProductView,
      collection: CollectionView,
      cart: CartView,
      page: PageView
    },
    onRouteStart: (url) => {
      sections.ajaxCart.ajaxCart.close();  // Run this immediately in case it's open
      sections.mobileMenu.drawer.hide();
    },
    onViewTransitionOutDone: (url, deferred) => {
      sections.nav.deactivateMenuLinks();
      $loader.addClass('is-visible');
      $loader.on(transitionEndEvent, deferred.resolve);
    },
    onViewChangeStart: (url) => {
      sections.nav.activateMenuLinkForUrl(url);
      analytics.trackPageView(window.location.pathname);
    },
    onViewChangeDOMUpdatesComplete: ($responseHead, $responseBody) => {
      $title.text($responseBody.find('#title').text());
    },
    onViewReady: (view) => {
      $loader.removeClass('is-visible');
    }
  });


  // Misc Stuff

  // Apply UA classes to the document
  Utils.userAgentBodyClass();

  // Apply a specific class to the html element for browser support of cookies.
  if (Utils.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
  // END Misc Stuff

  $body.addClass('is-loaded').removeClass('is-loading');

  // Stop here...no AJAX navigation inside the theme editor
  if (window.Shopify && window.Shopify.designMode) {
    return;
  }

  if (window.history && window.history.pushState) {
    $body.on('click', 'a', (e) => {
      if (e.isDefaultPrevented()) return;

      const $link = $(e.currentTarget);
      const url = $link.attr('href');
      
      if (Utils.isExternal(url) || url === '#' || url.indexOf('/checkout') > -1) return;

      if (appRouter.isTransitioning) return false; // eslint-disable-line

      e.preventDefault();
      appRouter.navigate(url);
    });
  }

  // Add "development mode" class for CSS hook
  if (window.location.hostname === 'localhost') {
    $body.addClass('development-mode');
  }

  credits();

  // Return early cause I'm not 100% that prefetching helps...
  // return;

  // Prefetching :)

  // let linkInteractivityTimeout = false;
  // let prefetchCache = {};
  // $body.on('mouseenter', 'a', (e) => {
  //   const url = e.currentTarget.getAttribute('href');
  //   const urlHash = Math.abs(Utils.hashFromString(url));

  //   if (Utils.isExternal(url) || url === '#' || prefetchCache.hasOwnProperty(urlHash)) return;

  //   let linkInteractivityTimeout = setTimeout(() => {
  //     $.get(url, () => {
  //       prefetchCache[urlHash] = true;
  //     });
  //   }, 500);
  // });

  // $body.on('mouseleave', 'a', (e) => {
  //   linkInteractivityTimeout = false;
  // });
})(jQuery);
