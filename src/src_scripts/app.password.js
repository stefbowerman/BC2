import Utils from './utils';
import PasswordSection from './sections/password';
import credits from './credits';

const $body = $(document.body);

(($) => {
  // Sections Stuff 
  const passwordSection = new PasswordSection($('[data-section-type="password"]'));

  // Apply UA classes to the document
  Utils.userAgentBodyClass();

  // Apply a specific class to the html elemfent for browser support of cookies.
  if (Utils.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
  // END Misc Stuff

  $body.addClass('is-loaded').removeClass('is-loading');

  // Add "development mode" class for CSS hook
  if (window.location.hostname === 'localhost') {
    $body.addClass('development-mode');
  }

  credits();
})(jQuery);
