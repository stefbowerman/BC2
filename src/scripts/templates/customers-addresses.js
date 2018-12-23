/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  var selectors = {
    addressNewToggle: '[data-address-new-toggle]',
    addressEditToggle: '[data-address-edit-toggle][data-form-id]',
    addressDelete: '[data-address-delete][data-form-id]'
  };

  // Toggle new/edit address forms
  $(selectors.addressNewToggle).on('click', function(e) {
    e.preventDefault();
    $newAddressForm.toggleClass('hide');
  });

  $(selectors.addressEditToggle).on('click', function(e) {
    e.preventDefault();
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $(selectors.addressDelete).on('click', function(e) {
    e.preventDefault();
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();
