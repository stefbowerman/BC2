# JavaScript - Slate

Slate attaches a handful of objects to the `window.slate` namespace.  These objects have already been documented by the Slate team on [their website](https://shopify.github.io/slate/js-examples/), which you should have a look at before moving on.

In keeping with their code convention, any module scripts that are independent of specific templates or sections should be attached to `window.slate` for consumption by theme code.  In building this, we have added and modified several properties of this namespace which are documented below.

## Modules

We have added (or added to) the following modules:

- [Ajax Cart](#ajax-cart)
- [Ajax MailChimp Form](#ajax-mailchimp-form)
- [Ajax Klaviyo Form](#ajax-klaviyo-form)
- [Animations](#animations)
- [Breakpoints](#breakpoints)
- [Collection Filters](#collection-filters)
- [Collection Sort](#collection-sort)
- [Currency](#currency)
- [Drawer](#drawer)
- [Forms](#forms)
- [Slideshow](#slideshow)
- [Slideup](#slideup)
- [Slideup Alert](#slideup-alert)
- [User](#user)
- [Utilities](#utilities)

### Ajax Cart

Create an initialize the Ajax Cart inside the Ajax Cart Section

```javascript
this.ajaxCart = new slate.AjaxCart();
this.ajaxCart.init({options});
```

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `disableAjaxCart`  | boolean | Quick way to disable the ajax cart |

The ajaxCart comes with public methods that allow you to control it from other parts of the application.

| Command        | Usage          | Description   |
| :----------------- | :------------ | :------------ |
| `open`  | `slate.AjaxCart.open()`  | Shows the cart |
| `close` | `slate.AjaxCart.close()` | Hides the cart |

### Ajax MailChimp Form

Included is a stripped down version of the [AjaxChimp jQuery](https://github.com/scdoshi/jquery-ajaxchimp) plugin.  It handles form submission for Mailchimp form URLs and provides basic validation and error handling.

To use, create a new instance and pass in the form element and a plain object of settings anywhere you need an AJAX enabled subscription form.  See `scripts/slate/ajaxMailChimpForm.js` for the full list of options.

```javascript
var $form = $('form');
var ajaxForm = new slate.AjaxMailChimpForm($form, {
  onInit: function() {
    // ...
  },
  onSubmitDone: function() {
    // ...
  }
});
```

### Ajax Klaviyo Form

Class that handles form submission for Klaviyo.

To use, create a new instance and pass in the form element and a plain object of settings anywhere you need an AJAX enabled subscription form.  See `scripts/slate/ajaxKlaviyoForm.js` for the full list of options.

```javascript
var $form = $('form');
var listId = $form.data('list-id');
var source = $form.data('source');
var options = {
  listId: listId,
  source: source,
  onSubscribeSuccess: function() { .. },
  onSubmitFail: function(){ .. }
};
var ajaxKlaviyoForm = new slate.AjaxKlaviyoForm($form, options);
```

### Animations

Attaches a single method to `slate.animations` to make working with animations in javascript easier.  Adds easing functions to `$.easing` and stores a dictionary of timing durations that should match those defined as SCSS variables.  Useful for times when CSS transitions won't do the job but you still want to keep things consistent.

##### `slate.animations.getTransitionTimingDuration`

Returns the timing durations (in ms) for the specified key

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `key`  | string | Key mapping to a timing duration (base, fast, slow..) |

##### `slate.animations.getTransitionTimingFunction`

Returns the css timing function for the specified key

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `key`  | string | Key mapping to a timing function (base, in, out..) 

### Breakpoints

Functions attached to `slate.breakpoints` to make working with breakpoints in javascript easier.  Also triggers a window event anytime a breakpoint is crossed.

##### `slate.breakpoints.getBreakpointMinWidth`

Returns the minimum pixel width for the specified key

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `key`  | string | Key mapping to a screen size (sm, md, ..) |

```javascript
slate.breakpoints.getBreakpointMinWidth('md'); // outputs - 992
```

##### `slate.breakpoints.getBreakpointMinWidthKeyForWidth`

Returns the breakpoint name for the specified pixel width.

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `w`  | integer | pixel value |

```javascript
slate.breakpoints.getBreakpointMinWidthKeyForWidth(1000); // outputs - md
```


### Collection Filters

The contents of the filters are sorted alphabetically by default but if you need an alternative sorting (like size), add a function to the `slate.models.CollectionFilters.Prototype._sortingFunctions` object.  The key that you use to add your sort function _must_ match the `data-filters-type` property of the element containing the options to sort.

To use, create a new instance and pass in an HTMLElement containing elements required by the selectors and a plain object of data about the collection that is being filtered.

```javascript
var filtering = new slate.models.CollectionFilters( container, collectionData );
```

### Collection Sort

Controls collection sorting, requires a containing element and a select tag with sorting options that get turned into a query string on the collection page.

To use, create a new instance and pass in an HTMLElement containing elements required by the selectors and a plain object of data about the collection that is being sorted.

```javascript
var sorting = new slate.models.CollectionSort( container, collectionData );
``` 

### Currency

##### `slate.currency.stripZeroCents`

```javascript

slate.utils.stripZeroCents('$120.00'); // outputs - '$120'
```

### Drawer
Element that hides off screen and animates in.  This class provides a simple way to open and close the drawer as well as lifecycle events.

```javascript
var $el = $('[data-drawer]');
var drawer = new slate.models.Drawer( $el );

// Later...

$el.on('shown.drawer', function() {
  console.log('Drawer is now visible');
});

drawer.hide();
```

Note:  This class also includes a data attribute based API to use drawers without writing javascript.  See the components page for reference.

| Event Type         | Description   |
| :----------------- | :------------ |
| `hide.drawer`      | This event is fired immediately when the hide instance method has been called. |
| `hidden.drawer`    | This event is fired when the drawer has finished being hidden from the user (will wait for CSS transitions to complete). |
| `show.drawer`      | This event fires immediately when the show instance method is called. |
| `shown.drawer`     | This event is fired when the drawer has been made visible to the user (will wait for CSS transitions to complete). |

### Forms
Single method that initializes event handlers for form input events.  Removes input validation states on blur.  Does _not_ apply validation states itself, that has to be done through other JS.  

### Slideshow
Wrapper around slideshow library to make initialization and consistency much simpler.  Allows us to swap out the library at any time while mainting the API.  Exposes methods to simplify working with slideshows and theme section events.

```javascript
var $slideshow = $('[data-slideshow]');
var options = { arrows: true };
var slideshow = new slate.models.Slideshow( $slideshow, options);
```

To set options on the slideshow, you can either pass an object into the constructor or use data attributes on the slideshow element.  Data attribute options with take precedent over those passed into the constructor.  The list of available data-attributes is listed below.

| Attribute         | Type          | Default          | Description   |
| :---------------- | :------------ | :--------------- | :------------ |
| `data-fade` | boolean | true | If true, the slideshow will fade slides in and out instead of sliding them |
| `data-slides-to-show` | integer | 1 | How many slides are visible at a time |
| `data-slides-to-scroll` | integer | 1 | How many slides to scroll at a time |
| `data-autoplay` | boolean | false | Should the slideshow play automatically |
| `data-autoplay-speed` | integer | 5000 | Slideshow speed in ms |


### Slideup
Full width element that is fixed to the bottom of the screen.  This class provides a simple way to open and close the slideup as well as lifecycle events.

```javascript
var $el = $('[data-slideup]');
var options = { closeSelector: '.close-me' };
var slideup = new slate.models.Slideup( $el, options);

// Later...

$el.on('hidden.slideup', function() {
  console.log('Slideup hidden');
});

slideup.hide();
```

| Event Type         | Description   |
| :----------------- | :------------ |
| `hide.slideup`      | This event is fired immediately when the hide instance method has been called. |
| `hidden.slideup`    | This event is fired when the slideup has finished being hidden from the user (will wait for CSS transitions to complete). |
| `show.slideup`      | This event fires immediately when the show instance method is called. |
| `shown.slideup`     | This event is fired when the slideup has been made visible to the user (will wait for CSS transitions to complete). |

### Slideup Alert
One time use instance of Slideup.  Displays on creation and uses a javascript timeout to hide and remove it from the DOM.

```javascript
new slate.models.SlideupAlert({
  title: 'Slideup title',
  text: 'Alert message here'
});
```

### User

A singleton object that handles logic related to the user's session.  It has several methods for setting, retrieving, and checking for the existence of browser cookies.

### Utilities

##### `slate.utils.getQueryParams`

Use this to retrieve an object of key / value pairs out of the parameters of the query string.

```javascript
// example.com/?mySearchTerm=blue+jeans

slate.utils.getQueryParams(); // outputs - { mySearchTerm: "blue+jeans" }
```

##### `slate.utils.getUrlWithUpdatedQueryStringParameter`

Use this to update a parameter in a uri query string.

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `key`  | string | Parameter key |
| `value`  | string | Parameter value |
| `uri`  | string | URI to update (defaults to `window.location.href`) |

```javascript
// example.com/?mySearchTerm=blue+jeans

slate.utils.getUrlWithUpdatedQueryStringParameter('mySearchTerm', 'red+shirt'); // outputs - example.com/?mySearchTerm=red+shirt
```

##### `slate.utils.getUrlWithRemovedQueryStringParameter`

Use this to update a parameter in a uri query string.

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `parameterKeyToRemove`  | string | Parameter key |
| `uri`  | string | URI to update (defaults to `window.location.href`) |

```javascript
// example.com/?mySearchTerm=blue+jeans&myFilter=color

slate.utils.getUrlWithRemovedQueryStringParameter('mySearchTerm'); // outputs - example.com/?myFilter=color
```

##### `slate.utils.isThemeEditor`

Returns *`true`* if the site is being viewed inside the shopify theme editor.

##### `slate.utils.whichTransitionEnd`

Get the correct name of the `transitionend` event for the browser being used.

##### `slate.utils.userAgentBodyClass`

Call this to apply user agent specific classes to the body tag to use as css / js hooks.

##### `slate.utils.hashFromString`

Call this to turn a string into a 32 bit integer.  Useful for hashing content into a some-what unique identifier to use for cookies.

##### `slate.utils.pluralize`

```javascript
var quantity = 1;
slate.utils.pluralize(quantity, 'story', 'stories'); // outputs - 'story'

var quantity = 10
slate.utils.pluralize(quantity, 'story', 'stories'); // outputs - 'stories'
```
