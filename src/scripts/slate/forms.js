/**
 * Forms Scripts
 * -----------------------------------------------------------------------------
 * Handles any events associated with forms on the site
 */

slate.forms = (function($) {

  var selectors = {
    formControl: '.form-control',
    formGroup: '.form-group',
    chosen: '.chosen-container'
  };

  var classes = {
   formGroupIsFocused: 'is-focused',
   formGroupHasError: 'has-error'
  };

  var $body = $(document.body);
 
  var initialized = false;

  function onFormControlFocus(e) {
    var $formControl = $(e.currentTarget);
    var $formGroup   = $formControl.parents(selectors.formGroup);

    $formGroup.addClass(classes.formGroupIsFocused);
  }

  function onFormControlBlur(e) {
    var $formControl = $(e.currentTarget);
    var $formGroup   = $formControl.parents(selectors.formGroup);

    $formGroup.removeClass(classes.formGroupIsFocused);    
  }

  function removeFormControlErrorState(e) {
    var $formControl = $(e.currentTarget);
    var $formGroup   = $formControl.parents(selectors.formGroup);

    $formGroup.removeClass(classes.formGroupHasError);
  }

  function onChosenShowingDropdown(e) {
    onFormControlFocus(e);
  }

  function onChosenHidingDropdown(e) {
    onFormControlBlur(e);
  }

  function initialize() {
    if(initialized) return;

    $body.on('focus', selectors.formControl, onFormControlFocus);
    $body.on('blur',  selectors.formControl, onFormControlBlur);
    $body.on('change keydown', selectors.formControl, removeFormControlErrorState);
    $body.on('chosen:showing_dropdown', selectors.formControl, onChosenShowingDropdown);
    $body.on('chosen:hiding_dropdown', selectors.formControl, onChosenHidingDropdown);

    initialized = true;
    
    return initialized;
  }

  return {
    initialize: initialize
  };

}(jQuery));