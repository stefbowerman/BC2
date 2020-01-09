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
 * handlebars v4.0.10
 */
// =require vendor/handlebars-v4.0.10.js

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */
 // =require vendor/bootstrap.transition.js
 // =require vendor/bootstrap.modal.js
 // =require vendor/bootstrap.collapse.js

/*!
 * ImagesLoaded
 */
 // =require /../../node_modules/imagesloaded/imagesloaded.pkgd.min.js

 /*!
 * Navigo
 */
 // =require /../../node_modules/navigo/lib/navigo.min.js
