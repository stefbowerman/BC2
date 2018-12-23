/**
 * Styleguide Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the components page template.
 *
 * Use this to hook up any JS necessary to show element functionality.
 */

 theme.components = (function() {
  
  var $body = $(document.body);
  
  var selectors = {
    slideupAlertForm: '[data-slideup-alert-form]',
    qaSetMax: '[data-qa-set-max]',
    qaToggleEnabled: '[data-qa-toggle-enabled]',
    qa: '[data-quantity-adjuster]'
  };

  if( !$body.is('.template-page-components') ){
    return;
  }

  $(selectors.slideupAlertForm).on('submit', function(e) {
    e.preventDefault();

    new slate.models.SlideupAlert({
      title: $(this).find('input[name="title"]').val(),
      text: $(this).find('input[name="text"]').val()
    });
  });

  // Quantity Adjuster
  $(selectors.qaSetMax).on('click', function(e) {
    $(selectors.qa).find('input[type="number"]').attr('max', $(e.currentTarget).data('qa-set-max'));
  });

  $(selectors.qaToggleEnabled).on('click', function(e) {
    var $qaInput = $(selectors.qa).find('input[type="number"]');
    $qaInput.attr('disabled', !$qaInput.is(':disabled'));
  });

  $body.on('click', 'a[href="#"]', function(){
    return false;
  });

})();
