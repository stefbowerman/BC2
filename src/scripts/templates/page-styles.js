/**
 * Styleguide Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the styleguide page template.
 *
 * Use this to hook up any JS necessary to show element functionality.
 */

 theme.styleguide = (function() {
  
  var $body = $(document.body);
  
  var selectors = {
    dot: '.dot'
  };

  if( !$body.is('.template-page-styles') ){
    return;
  }

  $body.on('click', selectors.dot, function(){
    $(this).toggleClass('is-active');
  });

  $body.on('click', 'a[href="#"]', function(){
    return false;
  });

})();
