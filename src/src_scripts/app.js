import Utils from './utils';
import AppRouter from './appRouter';

// Sections
// import SectionManager  from './sectionManager';
import HeaderSection     from './sections/header';
import FooterSection     from './sections/footer';
import AJAXCartSection   from './sections/ajaxCart';
import MobileMenuSection from './sections/mobileMenu';


(($) => {

  // console.log(`I have 8 ${Utils.pluralize(8, 'dog', 'dogs')}`);

  // Sections Stuff 
  // window.sectionManager = new SectionManager();

  // sectionManager.register('header', HeaderSection);
  // sectionManager.register('footer', FooterSection);
  // sectionManager.register('product', ProductSection);
  // sectionManager.register('cart', CartSection);

  const sections = {};

  sections.header     = new HeaderSection(   $('[data-section-type="header"]')    );
  sections.footer     = new FooterSection(   $('[data-section-type="footer"]')    );
  sections.ajaxCart   = new AJAXCartSection( $('[data-section-type="ajax-cart"]') );
  sections.mobileMenu = new MobileMenuSection( $('[data-section-type="mobile-menu"]') );
  
  const appRouter = new AppRouter({
    onRouteStart: (url) => {
      sections.ajaxCart.ajaxCart.close();  // Run this immediately in case it's open
    },
    onViewTransitionOutDone: (url) => {
      // Update the menu immediately or wait?
      sections.header.deactivateMenuLinks();
      sections.header.activateMenuLinkForUrl(url); 
    },
    onViewChangeDOMUpdatesComplete: () => {
      window.scrollTop = 0;
    }
  });
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
    appRouter.navigate(url);
  });  

})(jQuery);