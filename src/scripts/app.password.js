!function s(r,a,c){function u(t,e){if(!a[t]){if(!r[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(l)return l(t,!0);var o=new Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}var i=a[t]={exports:{}};r[t][0].call(i.exports,function(e){return u(r[t][1][e]||e)},i,i.exports,s,r,a,c)}return a[t].exports}for(var l="function"==typeof require&&require,e=0;e<c.length;e++)u(c[e]);return u}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s={error:{1:/Please enter a value/,2:/An email address must contain a single @/,3:/The domain portion of the email address is invalid \(the portion after the @: (.+)\)/,4:/The username portion of the email address is invalid \(the portion before the @: (.+)\)/,5:/This email address looks fake or invalid. Please enter a real email address/,6:/.+\#6592.+/,7:/(.+@.+) is already subscribed to list (.+)\..+<a href.+/}},r={success:"Thank you for subscribing!",error:{1:"Please enter an email address",2:"There was a problem with your entry. Please check the address and try again.",3:"There was a problem with your entry. Please check the address and try again.",4:"There was a problem with your entry. Please check the address and try again.",5:"There was a problem with your entry. Please check the address and try again.",6:"Too many subscribe attempts for this email address. Please try again in about 5 minutes.",7:"You're already subscribed. Thank you!"}},o=function(){function n(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),this.name="ajaxMailChimpForm",this.namespace="."+this.name,this.events={SUBMIT:"submit"+this.namespace};return 0!==e.length&&(this.$form=e instanceof jQuery?e:$(e),this.$input=this.$form.find('input[type="email"]'),this.$submit=this.$form.find('[type="submit"]'),this.settings=$.extend({},{onInit:function(){},onDestroy:function(){},onBeforeSend:function(){},onSubmitFail:function(){},onSubmitAlways:function(){},onSubscribeSuccess:function(){},onSubscribeFail:function(){}},t),this.isSubmitting=!1,"EMAIL"!==this.$input.attr("name")&&console.warn("["+this.name+'] - Email input *must* have attribute [name="EMAIL"]'),this.$form.on(this.events.SUBMIT,this.onFormSubmit.bind(this)),this.settings.onInit(),this)}return n.prototype.getRegexMatch=function(n,e){var t=s[e],o=void 0;return $.each(t,function(e,t){if(null!==n.match(t))return o=e,!1}),o},n.prototype.getMessageForResponse=function(t){var n=void 0;if("success"===t.result)n=r.success;else{try{var e=t.msg.split(" - ",2);n=void 0===e[1]?t.msg:e[1]}catch(e){n=t.msg}var o=s.error,i=this.getRegexMatch(n,"error");if(i&&o[i]&&r.error[i])return n.replace(o[i],r.error[i])}return n},n.prototype.destroy=function(){this.$form.off(this.events.SUBMIT),this.settings.onDestroy()},n.prototype.onBeforeSend=function(){return!1!==this.settings.onBeforeSend()&&(!(!this.$input.val()||!this.$input.val().length)&&(this.$submit.prop("disabled",!0),!0))},n.prototype.onSubmitDone=function(e){var t=this.getMessageForResponse(e);"success"===e.result?this.settings.onSubscribeSuccess(t):this.settings.onSubscribeFail(t)},n.prototype.onSubmitFail=function(e){this.settings.onSubmitFail(e)},n.prototype.onSubmitAlways=function(e){this.$submit.prop("disabled",!1),this.settings.onSubmitAlways(e)},n.prototype.onFormSubmit=function(e){var t=this;if(e.preventDefault(),this.isSubmitting)return!1;var n=this.$form,o={};return $.each(n.serializeArray(),function(e,t){o[t.name]=t.value}),$.ajax({url:n.attr("action").replace("/post?","/post-json?").concat("&c=?"),dataType:"jsonp",data:o,beforeSend:function(){return t.isSubmitting=!0,t.onBeforeSend()}}).done(function(e){t.onSubmitDone(e)}).fail(function(e){t.onSubmitFail(e)}).always(function(e){t.isSubmitting=!1,t.onSubmitAlways(e)}),!1},n}();n.default=o},{}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return e.prototype.gaLoaded=function(){return void 0!==window.ga},e.prototype.trackEvent=function(e){var t=e.category,n=e.action,o=e.label,i=e.value,s=e.nonInteraction,r={hitType:"event",eventCategory:t,eventAction:n,eventLabel:o};"number"==typeof i&&(r.eventValue=i),void 0!==s&&(r.nonInteraction=s),window.ga&&window.ga("send",r)},e.prototype.trackEventWithRetry=function(t){var n=this,o=0;!function e(){n.gaLoaded()?n.trackEvent(t):o<6&&setTimeout(e,1e3),o++}()},e.prototype.trackPageView=function(e){this.gaLoaded()&&(window.ga("set","page",e),window.ga("send","pageview"))},e}();n.default=new o},{}],3:[function(e,t,n){"use strict";var o=r(e("./utils")),i=r(e("./sections/password")),s=r(e("./credits"));function r(e){return e&&e.__esModule?e:{default:e}}var a,c=$(document.body);a=jQuery,new i.default(a('[data-section-type="password"]')),o.default.userAgentBodyClass(),o.default.cookiesEnabled()&&(document.documentElement.className=document.documentElement.className.replace("supports-no-cookies","supports-cookies")),c.addClass("is-loaded").removeClass("is-loading"),"localhost"===window.location.hostname&&c.addClass("development-mode"),(0,s.default)()},{"./credits":4,"./sections/password":6,"./utils":8}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){window&&window.location&&"localhost"!==window.location.hostname&&console.log("%cBianca Chandôn - design + development → stefanbowerman.com","font-family: Helvetica; font-size: 11px; color: #111; text-transform: uppercase; background-color: #FFF; padding: 3px 10px;")}},{}],5:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=["shopify:section:unload","shopify:section:select","shopify:section:deselect","shopify:section:reorder","shopify:block:select","shopify:block:deselect"],i=function(){function n(e,t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),this.$container=e instanceof $?e:$(e),this.id=this.$container.data("section-id"),this.type=this.$container.data("section-type"),this.name=t,this.namespace="."+this.name,this.onShopifyEvent=this.onShopifyEvent.bind(this),$(document).on(o.join(" "),this.onShopifyEvent)}return n.prototype.onShopifyEvent=function(e){if(e.detail.sectionId===this.id.toString())switch(e.type){case"shopify:section:unload":this.onUnload(e);break;case"shopify:section:select":this.onSelect(e);break;case"shopify:section:deselect":this.onDeselect(e);break;case"shopify:section:reorder":this.onReorder(e);break;case"shopify:block:select":this.onBlockSelect(e);break;case"shopify:block:deselect":this.onBlockDeselect(e)}},n.prototype.onUnload=function(e){$(document).off(o.join(" "),this.onShopifyEvent)},n.prototype.onSelect=function(e){},n.prototype.onDeselect=function(e){},n.prototype.onReorder=function(e){},n.prototype.onBlockSelect=function(e){},n.prototype.onBlockDeselect=function(e){},n}();n.default=i},{}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=s(e("./base")),i=s(e("../uiComponents/subscribeForm"));function s(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):function(e,t){for(var n=Object.getOwnPropertyNames(t),o=0;o<n.length;o++){var i=n[o],s=Object.getOwnPropertyDescriptor(t,i);s&&s.configurable&&void 0===e[i]&&Object.defineProperty(e,i,s)}}(e,t))}var a=function(n){function o(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o);var t=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,n.call(this,e,"password"));return t.subscribeForm=new i.default(t.$container,{eventLabel:"password page"}),-1<window.location.search.indexOf("password")&&(document.getElementById("Login").style.display="block"),t}return r(o,n),o}(o.default);n.default=a},{"../uiComponents/subscribeForm":7,"./base":5}],7:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=o(e("../ajaxMailchimpForm")),s=o(e("../analytics")),r=o(e("../utils"));function o(e){return e&&e.__esModule?e:{default:e}}var a="form[data-subscribe-form]",c="[data-form-contents]",u="[data-form-message]",l="show-message",f="text-danger",d=function(){function o(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o);this.transitionEndEvent=r.default.whichTransitionEnd(),this.settings=$.extend({},{eventLabel:"",runAnimations:!0,onSubscribeSuccess:function(){},onSubscribeFail:function(){},onSuccessAnimationComplete:function(){}},t);var n=$(e);this.$form=n.is(a)?n:n.find(a).first(),this.$contents=$(c,this.$form),this.$message=$(u,this.$form),this.$emailInput=$('input[type="email"]',this.$form),0!==this.$form.length?this.ajaxMailchimpForm=new i.default(this.$form,{onSubscribeFail:this.onSubscribeFail.bind(this),onSubscribeSuccess:this.onSubscribeSuccess.bind(this)}):console.warn("Valid form element required to initialize")}return o.prototype.onSubscribeFail=function(){var e=this,t=(0<arguments.length&&void 0!==arguments[0]?arguments[0]:"").match(/already subscribed/)?window.theme.strings.subscribeAlreadySubscribed:window.theme.strings.subscribeFail;this.$message.text(t),this.$message.addClass(f),this.$contents.addClass(l),this.settings.runAnimations&&setTimeout(function(){e.$contents.removeClass(l),e.$contents.one(e.transitionEndEvent,function(){e.$emailInput.focus(),e.$message.text(""),e.$message.removeClass(f)})},4e3),this.settings.onSubscribeFail()},o.prototype.onSubscribeSuccess=function(){var e=this;this.$message.text(window.theme.strings.subscribeSuccess),this.$contents.addClass(l),this.settings.runAnimations&&setTimeout(function(){e.$contents.removeClass(l),e.$emailInput.val(""),setTimeout(e.settings.onSuccessAnimationComplete,300)},4e3),s.default.trackEvent({category:"Mailing List",action:"Subscribe Success",label:this.settings.eventLabel}),this.settings.onSubscribeSuccess()},o}();n.default=d},{"../ajaxMailchimpForm":1,"../analytics":2,"../utils":8}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={findInstance:function(e,t,n){for(var o=0;o<e.length;o++)if(e[o][t]===n)return e[o]},removeInstance:function(e,t,n){for(var o=e.length;o--;)if(e[o][t]===n){e.splice(o,1);break}return e},compact:function(e){for(var t=-1,n=null==e?0:e.length,o=0,i=[];++t<n;){var s=e[t];s&&(i[o++]=s)}return i},defaultTo:function(e,t){return null==e||e!=e?t:e},getQueryParams:function(){var e=location.search&&location.search.substr(1)||"",n={};return e.split("&").filter(function(e){return e.length}).forEach(function(e){var t=e.split("=");1<t.length?n[t[0]]=t[1]:n[t[0]]=!0}),n},getQueryString:function(){var e=location.search&&location.search.substr(1)||"";return e.length&&(e="?"+e),e},getUrlWithUpdatedQueryStringParameter:function(e,t,n){var o=(n=n||window.location.href).indexOf("#"),i=-1===o?"":n.substr(o);n=-1===o?n:n.substr(0,o);var s=new RegExp("([?&])"+e+"=.*?(&|$)","i"),r=-1!==n.indexOf("?")?"&":"?";return t?n=n.match(s)?n.replace(s,"$1"+e+"="+t+"$2"):n+r+e+"="+t:("?"===(n=n.replace(new RegExp("([?&]?)"+e+"=[^&]*","i"),"")).slice(-1)&&(n=n.slice(0,-1)),-1===n.indexOf("?")&&(n=n.replace(/&/,"?"))),n+i},getUrlWithRemovedQueryStringParameter:function(e,t){var n=(t=t||window.location.href).split("?")[0],o=[],i=-1!==t.indexOf("?")?t.split("?")[1]:"";if(""!==i){for(var s=(o=i.split("&")).length-1;0<=s;s-=1)o[s].split("=")[0]===e&&o.splice(s,1);0<o.length&&(n=n+"?"+o.join("&"))}return n},isThemeEditor:function(){return null!==location.href.match(/myshopify.com/)&&null!==location.href.match(/theme_id/)},whichTransitionEnd:function(){var t=document.createElement("fakeelement"),n={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"},o=n.transition;return Object.keys(n).forEach(function(e){void 0===t.style.transition&&void 0!==t.style[e]&&(o=n[e])}),o},userAgentBodyClass:function(){var e,t=navigator.userAgent,n=document.documentElement,o=n.className;/iPad|iPhone|iPod/.test(t)&&!window.MSStream&&(o+=" ua-ios",(e=t.match(/((\d+_?){2,3})\slike\sMac\sOS\sX/))&&(o+=" ua-ios-"+e[1]),/Twitter/.test(t)&&(o+=" ua-ios-twitter"),/CriOS/.test(t)&&(o+=" ua-ios-chrome")),/Android/.test(t)&&(o+=(e=t.match(/Android\s([0-9\.]*)/))?" ua-aos ua-aos-"+e[1].replace(/\./g,"_"):" ua-aos"),/webOS|hpwOS/.test(t)&&(o+=" ua-webos"),/SamsungBrowser/.test(t)&&(o+=" ua-samsung"),n.className=o},hashFromString:function(e){var t,n=0;if(0===e.length)return n;for(t=0;t<e.length;t++)n=(n<<5)-n+e.charCodeAt(t),n|=0;return n},cookiesEnabled:function(){var e=navigator.cookieEnabled;return e||(document.cookie="testcookie",e=-1!==document.cookie.indexOf("testcookie")),e},pluralize:function(e,t,n){var o="";return 1==(e=parseInt(e))?o=t:void 0===(o=n)&&(o=t+"s"),o},isExternal:function(e){var t=e.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);return"string"==typeof t[1]&&0<t[1].length&&t[1].toLowerCase()!==location.protocol||"string"==typeof t[2]&&0<t[2].length&&t[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"),"")!==location.host}}},{}]},{},[3]);