const $window = $(window);
let cachedWindowWidth = $window.width(); 

// Match those set in variables.scss
const _breakpointMinWidths = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1480
};

const events = {
  BREAKPOINT_CHANGE: 'breakpointChange',
};

/**
* Get one of the widths stored in the variable defined above
*
* @param {string} key - string matching one of the key names
* @return {int} - pixel width
*/
function getBreakpointMinWidth(key) {
  if(!key) return;

  if(_breakpointMinWidths.hasOwnProperty(key)) {
    return _breakpointMinWidths[key];
  }
}

/**
* Gets the key for one of the breakpoint widths, whichever is closest but smaller to the passed in width
* So if we pass in a width between 'sm' and 'md', this will return 'sm'
*
* @param {int} w - width
* @return {undefined|string} foundKey
*/
function getBreakpointMinWidthKeyForWidth(w) {
  w = w != undefined ? w : $window.width();
  
  var foundKey;

  $.each(_breakpointMinWidths, function(k, bpMinWidth) {
    if(w >= bpMinWidth) {
      foundKey = k;
    }
  });

  return foundKey;
}

/**
* Triggers a window event when a breakpoint is crossed, passing the new minimum breakpoint width key as an event parameter
*
*/
function onResize() {
  var newWindowWidth = $window.width();

  $.each(_breakpointMinWidths, function(k, bpMinWidth) {
    if( (newWindowWidth >= bpMinWidth && cachedWindowWidth < bpMinWidth) || (cachedWindowWidth >= bpMinWidth && newWindowWidth < bpMinWidth) ) {
      
      var bpMinWidthKey = getBreakpointMinWidthKeyForWidth(newWindowWidth);
      var e = $.Event(events.BREAKPOINT_CHANGE, { bpMinWidthKey: bpMinWidthKey });
      $window.trigger(e);
      return false;

    }
  });

  cachedWindowWidth = $window.width();
}


$(() => {
  $window.on('resize', $.throttle(20, onResize) );
});  

export {
  getBreakpointMinWidth as getBreakpointMinWidth,
  getBreakpointMinWidthKeyForWidth as getBreakpointMinWidthKeyForWidth
}