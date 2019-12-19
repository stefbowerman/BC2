import { throttle } from 'throttle-debounce';

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
  let w;

  if (_breakpointMinWidths.hasOwnProperty(key)) {
    w = _breakpointMinWidths[key];
  }

  return w;
}

/**
* Gets the key for one of the breakpoint widths, whichever is closest but smaller to the passed in width
* So if we pass in a width between 'sm' and 'md', this will return 'sm'
*
* @param {int} w - width
* @return {undefined|string} foundKey
*/
function getBreakpointMinWidthKeyForWidth(w) {
  w = w !== undefined ? w : $window.width();
  
  let foundKey;

  $.each(_breakpointMinWidths, (k, bpMinWidth) => {
    if (w >= bpMinWidth) {
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
  const newWindowWidth = $window.width();

  $.each(_breakpointMinWidths, (k, bpMinWidth) => {
    if ((newWindowWidth >= bpMinWidth && cachedWindowWidth < bpMinWidth) || (cachedWindowWidth >= bpMinWidth && newWindowWidth < bpMinWidth)) {
      const bpMinWidthKey = getBreakpointMinWidthKeyForWidth(newWindowWidth);
      const e = $.Event(events.BREAKPOINT_CHANGE, { bpMinWidthKey });
      
      $window.trigger(e);

      return false;
    }

    return true;
  });

  cachedWindowWidth = $window.width();

  return true;
}

$(() => {
  $window.on('resize', throttle(50, onResize));
});

export {
  getBreakpointMinWidth,
  getBreakpointMinWidthKeyForWidth
};
