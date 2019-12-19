/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

/**
 * Preloads an image in memory and uses the browsers cache to store it until needed.
 *
 * @param {Array} images - A list of image urls
 * @param {String} size - A shopify image size attribute
 */
// function preload(images, size) {
//   if (typeof images === 'string') {
//     images = [images];
//   }

//   images.forEach((img) => {
//     loadImage(getSizedImageUrl(img, size));
//   });
// }

/**
 * Loads and caches an image in the browsers cache.
 * @param {string} path - An image url
 */
// function loadImage(path) {
//   new Image().src = path;
// }

/**
 * Find the Shopify image attribute size
 *
 * @param {string} src
 * @returns {null}
 */
// function imageSize(src) {
//   const match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

//   if (match) {
//     return match[1];
//   }

//   return null;
// }

function removeProtocol(path) {
  return path.replace(/http(s)?:/, '');
}

/**
 * Adds a Shopify size attribute to a URL
 *
 * @param src
 * @param size
 * @returns {*}
 */
function getSizedImageUrl(src, size) {
  if (size === null) {
    return src;
  }

  if (size === 'master') {
    return removeProtocol(src);
  }

  const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

  if (match) {
    const prefix = src.split(match[0]);
    const suffix = match[0];

    return removeProtocol(prefix[0] + '_' + size + suffix);
  }
  
  return null;
}

export {
  getSizedImageUrl
};
