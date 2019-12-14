// Attempts to preserve comments that likely contain licensing information,
// even if the comment does not have directives such as `@license` or `/*!`.
//
// Implemented via the [`uglify-save-license`](https://github.com/shinnn/uglify-save-license)
// module, this option preserves a comment if one of the following is true:
//
// 1. The comment is in the *first* line of a file
// 2. A regular expression matches the string of the comment.
//    For example: `MIT`, `@license`, or `Copyright`.
// 3. There is a comment at the *previous* line, and it matches 1, 2, or 3.

/*!
 * jquery.min.js
 */
// =require /../../node_modules/jquery/dist/jquery.min.js

/*!
 * Zoom 1.7.18
 * http://www.jacklmoore.com/zoom
 */
// =require /../../node_modules/jquery-zoom/jquery.zoom.min.js

/*!
 * handlebars v4.0.10
 */
// =require vendor/handlebars-v4.0.10.js

/*!
* js-cookie
*/
// =require /../../node_modules/js-cookie/src/js.cookie.js

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */
 // =require vendor/bootstrap.transition.js
 // =require vendor/bootstrap.modal.js
 // =require vendor/bootstrap.collapse.js

 /**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 */
 // =require vendor/jquery.unveil.js
 
/*!
 * ImagesLoaded
 */
 // =require /../../node_modules/imagesloaded/imagesloaded.pkgd.min.js

 /*!
 * Navigo
 */
 // =require /../../node_modules/navigo/lib/navigo.min.js
