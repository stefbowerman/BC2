# JavaScript

All javascript builds on the pre-existing javascript structure provided to us by Slate.  This structure allows us to easily add functionality in an organized way that focuses on re-usability of modules and share-ability of utilities.

- [Structure](#structure)
- [JavaScript Conventions](#javascript-conventions)
- [Adding JavaScript](#adding-javascript)
- [Adding A Section](#adding-a-section)
- [Removing A Section](#removing-a-section)
- [Adding Vendor Libraries](#adding-vendor-libraries)

## Structure

The site javascript is built off of the main `theme.js` file which relies on two global objects - `window.slate` and `window.theme`.  Slate code is imported first followed by theme code which consumes it.  All files should attach plain objects, constructors or instances (whichever makes the most sense) to the appropriate global object.  All initialization should be done inside `theme.js` or handled through the `slate.section` instance (see [Adding A Section](#adding-a-section)).

#### `window.slate`

This global object contains helper methods and module code that is independent of any section or page.  Files that attach things to this object should be placed only in the `slate` directory.  By attaching to `slate` as opposed to `theme`, the idea is that these scripts could be used independently on other projects and are not tied into any theme specific files or code structure.

#### `window.theme`

This global object contains code specific to pages, templates, and sections of the theme.  Files that attach to this object should be placed in either the `sections` or `templates` directory.

#### `theme.js`

The main file that imports all the theme javascript dependencies, wires theme up and initializes them.

#### Official Docs

Now that you understand the javascript architecture, please take a minute to look through the official [Slate JavaScript documentation](https://shopify.github.io/slate/js-examples/) to get an idea of the functionality that they provide and how to make use of it.  Pay close attention to the part on [section events](https://shopify.github.io/slate/js-examples/#section-events) as that is the most important (and potentially confusing) feature of Slate.

##### Note On Section Events

Section events aren't covered very clearly in the official documentation.  If you browse the [Shopify documentation on sections](https://help.shopify.com/themes/development/theme-editor/section) and scroll all the way to the bottom, you'll see a section about how the Theme Editor API works.

> When merchants customize sections, the HTML of those sections is dynamically added, removed, or re-rendered directly onto the existing DOM without reloading the entire page.
> JavaScript that runs when the page loads will not run again when a section is re-rendered or added to the page.

To make sure your theme sections don't break when the user is customizing the theme, the editor fires events that your code can respond to. The events listed in the Shopify docs are the raw events as fired by the theme editor.

The __Section__ object that Slate provides acts as an abstraction layer to make it easier to interact with these events.  It takes care of attaching event listeners and calling the appropriate handlers.  As long as you follow the javascript pattern that Slate has created for sections (see [Adding A Section](#adding-a-section)), all you need to do is attach specially named methods to the constructor's prototype and the __Section__ object will handle the rest.  The full list of named methods that you can use are listed at the bottom of the [Slate JavaScript documentation](https://shopify.github.io/slate/js-examples/) and duplicated below.

| Methods      | Description |
| :-------------- | :-------------- |
| `onUnload()`        | A section has been deleted or is being re-rendered. |
| `onSelect()`        | User has selected the section in the editor's sidebar. |
| `onDeselect()`          | User has deselected the section in the editor's sidebar. |
| `onReorder()`          | User has changed the section's order in the editor's sidebar. |
| `onBlockSelect()`        | User has selected the block in the editor's sidebar. |
| `onBlockDeselect()`        | User has deselected the block in the editor's sidebar. |


## JavaScript Conventions  

When adding javascript code to the theme, please keep the following code conventions in mind.

- All code should be camelcased except constructors which should be Pascal cased.

  ```javascript
  // Pascal cased constructor
  var MyConstructorFunction = function() {}

  // Camel case everywhere else
  var myNewInstance = new MyConstructorFunction();
  ```

- Utilities use plain objects
- Declare your dependencies via injection by passing them into the function scope.

  ```javascript
  theme.module = (function(dependency) {

    // Module code here

  })(dependency);
  ```
- Selectors use `data-*` attributes and should be defined outside any constructors.
- Document your code as neccessary, this includes following [JSDocs](http://usejsdoc.org/) guidelines to define function signatures if they accept arguments, return values, or both.
- Prefix any private methods with an underscore.
- Revealing module pattern is OK.
- For consistency, when querying the DOM with a scoping element, pass it to the $ constructor as the second argument.

  ```javascript
  // Do this
  var $el = $(selector, $parentScope);

  // Not this
  var $el = $parentScope.find(selector);
  ```

## Adding JavasScript

When adding javascript to the theme, you need to determine the purpose of the script and how it will be used, this will determine where it should live.

- If building a module that may exist on multiple pages (i.e. dropdown, popup, etc), you should build it entirely contained in it's own file to be consumed by the appropriate larger file (`theme.js` or a section).
- If writing something specific to a page or template, follow the pattern of files inside `scripts/templates`.
- If writing something specific to a section, add it to the appropriate file in `scripts/sections` or create a new one, following the guidelines in the section below.
- If writing something global that is independent of a module, then write it inside of `theme.js`.  Examples of this could be scrolling effects, analytics, user cookies, etc..

## Adding A Section

When adding a new section to the site, there are a couple things that you must do to get it working properly.  The javascript structure requires specific naming conventions for any section code you write.  Any time you build a new section, there are 3 files that you must create or modify.

For the sake of the following example code, lets assume we're building a section for an **About Us** page.

##### Section Template

The template that you create for your section can have whatever you want inside of it.  The only thing that must be present for your section code to run properly is a wrapper element with a `data-section-type` attribute.  The value should match the name of the liquid file.  Make note of it because you will need it to register your section in `theme.js` (see below).

```liquid
<!-- sections/about-us.liquid -->

<div data-section-type="about-us">
  <!-- Section liquid code here -->
</div>
```

##### Section Script

When adding section javascript, take extra care to make sure that it is fully compatible with the theme editor API.  The following guidelines will help you build your section javascript correctly.  For reference, see [the following slate documentation](https://shopify.github.io/slate/js-examples/#section-events).  

- The code structure requires that you attach a constructor to `window.theme` which can then be passed into `slate.Sections`.
- You should declare any selectors needed by that section outside of the constructor.
- Attach all methods to the object's prototype (unless they need private variable access).
- The constructor and object key should both be Pascal Cased.  
- The constructor *must* accept an `HTMLElement` as it's only argument to be compatible with `slate.Sections`.  Make sure you look through the source code for this object, especially the `register` method as that is the on that we'll be using to intialize our section.

A simple example would look like:

```javascript
// scripts/sections/aboutUs.js

// Pascal Case the name of your section constructor and attach it to the global `theme` variable.
theme.AboutUs = (function() {

  // Place all selectors at the top of this file
  // These should almost always be data-attributes (to keep css classes strictly presentational) that describe the elements they select
  var selectors = {
    aboutButton: '[data-about-button]',
    listItem: '[data-list-item]'
  };

  // Place all css classes at the top of this file that get used in functions down below.
  // These are typically used to represent the different element states
  var classes = {
    isActive: 'is-active'
  };

  // Constructor Function - This should also be Pascal Cased.
  // @param {HTMLElement} container - Wrapper element from the section liquid file, it scopes all other DOM elements.
  function AboutUs(container) {
    this.$container = $(container);

    this.name = 'aboutUs'; // namespaces should be camelCased.
    this.namespace = '.'+this.name; // namespaces are useful if you need to fire events that are section specific

    // For any DOM elements that can be cached (don't change over the life of the page or there's a small number of them)
    // set them as instance variables
    this.$aboutButton = $(selectors.aboutButton, this.$container);

    // Handler functions should be named " 'on' + selectorName + eventName "
    // Cached elements get bound directly
    // Non-cached elements get bound using delegated handlers - see below for usage
    this.$aboutButton.on('click', this.onAboutButtonClick.bind(this));
    this.$container.on('click', selectors.listItem, this.onListItemClick.bind(this));
  }

  // Add prototype methods
  AboutUs.prototype = $.extend({}, AboutUs.prototype, {

    _privateFunction: function() {
      //
    },

    onAboutButtonClick: function(e) {
      e.preventDefault();
      // 
    },

    onListItemClick: function(e) {
      var $listItem = $(e.currentTarget);

      // Use the clicked on $listItem here
    },    

    // Any methods that apply *only* to the theme editor should go at the bottom of the file
    onSelect: function() {
      //
    }

  });

  return AboutUs; // return the constructor
})();
```

##### Theme Script

```javascript
// scripts/theme.js

// Add the require directive under the heading for sections

/*================ Sections ================*/
// =require sections/aboutUs.js


// Register your section after all the other calls to sections.register

sections.register('about-us', theme.AboutUs);
```

## Removing A Section

If you remove a section from your theme, be sure to remove the file and all the javascript associated with it.  Continuing with our **About Us** page example:

- Remove `sections/about-us.liquid`
- Remove `scripts/sections/aboutUs.js`
- Remove the related lines in `theme.js`

  ```javascript
  // Remove this line
  // =require sections/aboutUs.js

  // And this one
  sections.register('about-us-section', theme.AboutUs);
  ```

## Adding Vendor Libraries

All javascript dependencies should be included in one of two vendor files.  While both files are included in the head of the site, `vendor.js` is included with a `defer` attribute whereas `vendor-head.js` is included without one.  If your dependency is required in the body of the page or *must* be loaded before parsing of the body tag begins then include it in `vendor-head.js`, otherwise include it in `vendor.js`.

By default, Slate provides you with a way to add vendor scripts to your project by adding them to the vendor directory and then importing them in the appropriate vendor file.  Since this project already uses node for task running, we can use NPM to manage vendor dependencies and import them from the `node_modules` directory.  To do this, install your dependency, and then reference the javascript file like so.

```javascript
// scripts/vendor.js

// Dependency from the vendor directory
// =require /vendor/dependency.js

// Node Module dependency
// =require /../../node_modules/dependency/dependency.js
``` 