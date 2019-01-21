(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*! iScroll v5.2.0 ~ (c) 2008-2016 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, document, Math) {
var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };

var utils = (function () {
	var me = {};

	var _elementStyle = document.createElement('div').style;
	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransform';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}

		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}

	me.getTime = Date.now || function getTime () { return new Date().getTime(); };

	me.extend = function (target, obj) {
		for ( var i in obj ) {
			target[i] = obj[i];
		}
	};

	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);
	};

	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};

	me.prefixPointerEvent = function (pointerEvent) {
		return window.MSPointerEvent ?
			'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8):
			pointerEvent;
	};

	me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	/*
	This should find all Android browsers lower than build 535.19 (both stock browser and webview)
	- galaxy S2 is ok
    - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
    - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S3 is badAndroid (stock brower, webview)
     `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S4 is badAndroid (stock brower, webview)
     `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S5 is OK
     `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
   - galaxy S6 is OK
     `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
  */
	me.isBadAndroid = (function() {
		var appVersion = window.navigator.appVersion;
		// Android browser is not a chrome browser.
		if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
			var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
			if(safariVersion && typeof safariVersion === "object" && safariVersion.length >= 2) {
				return parseFloat(safariVersion[1]) < 535.19;
			} else {
				return true;
			}
		} else {
			return false;
		}
	})();

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transitionDelay: _prefixStyle('transitionDelay'),
		transformOrigin: _prefixStyle('transformOrigin')
	});

	me.hasClass = function (e, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
		return re.test(e.className);
	};

	me.addClass = function (e, c) {
		if ( me.hasClass(e, c) ) {
			return;
		}

		var newclass = e.className.split(' ');
		newclass.push(c);
		e.className = newclass.join(' ');
	};

	me.removeClass = function (e, c) {
		if ( !me.hasClass(e, c) ) {
			return;
		}

		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
		e.className = e.className.replace(re, ' ');
	};

	me.offset = function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		// jshint -W084
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		// jshint +W084

		return {
			left: left,
			top: top
		};
	};

	me.preventDefaultException = function (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}

		return false;
	};

	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		pointerdown: 3,
		pointermove: 3,
		pointerup: 3,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});

	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function (k) {
				if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function (k) {
				var f = 0.22,
					e = 0.4;

				if ( k === 0 ) { return 0; }
				if ( k == 1 ) { return 1; }

				return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
			ev;

		if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
			ev = document.createEvent('MouseEvents');
			ev.initMouseEvent('click', true, true, e.view, 1,
				target.screenX, target.screenY, target.clientX, target.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				0, null);

			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	return me;
})();
function IScroll (el, options) {
	this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.scrollerStyle = this.scroller.style;		// cache style for better performance

	this.options = {

		zoomMin: 1,
		zoomMax: 4, startZoom: 1,

		resizeScrollbars: true,

		mouseWheelSpeed: 20,

		snapThreshold: 0.334,

// INSERT POINT: OPTIONS
		disablePointer : !utils.hasPointer,
		disableTouch : utils.hasPointer || !utils.hasTouch,
		disableMouse : utils.hasPointer || utils.hasTouch,
		startX: 0,
		startY: 0,
		scrollY: true,
		directionLockThreshold: 5,
		momentum: true,

		bounce: true,
		bounceTime: 600,
		bounceEasing: '',

		preventDefault: true,
		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

		HWCompositing: true,
		useTransition: true,
		useTransform: true,
		bindToWrapper: typeof window.onmousedown === "undefined"
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	// Normalize options
	this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;

	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if ( this.options.tap === true ) {
		this.options.tap = 'tap';
	}

	if ( this.options.shrinkScrollbars == 'scale' ) {
		this.options.useTransition = false;
	}

	this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

// INSERT POINT: NORMALIZATION

	// Some defaults
	this.x = 0;
	this.y = 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

	this.scale = Math.min(Math.max(this.options.startZoom, this.options.zoomMin), this.options.zoomMax);

// INSERT POINT: DEFAULTS

	this._init();
	this.refresh();

	this.scrollTo(this.options.startX, this.options.startY);
	this.enable();
}

IScroll.prototype = {
	version: '5.2.0',

	_init: function () {
		this._initEvents();

		if ( this.options.zoom ) {
			this._initZoom();
		}

		if ( this.options.scrollbars || this.options.indicators ) {
			this._initIndicators();
		}

		if ( this.options.mouseWheel ) {
			this._initWheel();
		}

		if ( this.options.snap ) {
			this._initSnap();
		}

		if ( this.options.keyBindings ) {
			this._initKeys();
		}

// INSERT POINT: _init

	},

	destroy: function () {
		this._initEvents(true);
		clearTimeout(this.resizeTimeout);
 		this.resizeTimeout = null;
		this._execEvent('destroy');
	},

	_transitionEnd: function (e) {
		if ( e.target != this.scroller || !this.isInTransition ) {
			return;
		}

		this._transitionTime();
		if ( !this.resetPosition(this.options.bounceTime) ) {
			this.isInTransition = false;
			this._execEvent('scrollEnd');
		}
	},

	_start: function (e) {
		// React to left mouse button only
		if ( utils.eventType[e.type] != 1 ) {
		  // for button property
		  // http://unixpapa.com/js/mouse.html
		  var button;
	    if (!e.which) {
	      /* IE case */
	      button = (e.button < 2) ? 0 :
	               ((e.button == 4) ? 1 : 2);
	    } else {
	      /* All others */
	      button = e.button;
	    }
			if ( button !== 0 ) {
				return;
			}
		}

		if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
			return;
		}

		if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,
			pos;

		this.initiated	= utils.eventType[e.type];
		this.moved		= false;
		this.distX		= 0;
		this.distY		= 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this.startTime = utils.getTime();

		if ( this.options.useTransition && this.isInTransition ) {
			this._transitionTime();
			this.isInTransition = false;
			pos = this.getComputedPosition();
			this._translate(Math.round(pos.x), Math.round(pos.y));
			this._execEvent('scrollEnd');
		} else if ( !this.options.useTransition && this.isAnimating ) {
			this.isAnimating = false;
			this._execEvent('scrollEnd');
		}

		this.startX    = this.x;
		this.startY    = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX    = point.pageX;
		this.pointY    = point.pageY;

		this._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault ) {	// increases performance on Android? TODO: check!
			e.preventDefault();
		}

		var point		= e.touches ? e.touches[0] : e,
			deltaX		= point.pageX - this.pointX,
			deltaY		= point.pageY - this.pointY,
			timestamp	= utils.getTime(),
			newX, newY,
			absDistX, absDistY;

		this.pointX		= point.pageX;
		this.pointY		= point.pageY;

		this.distX		+= deltaX;
		this.distY		+= deltaY;
		absDistX		= Math.abs(this.distX);
		absDistY		= Math.abs(this.distY);

		// We need to move at least 10 pixels for the scrolling to initiate
		if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// If you are scrolling in one direction lock the other
		if ( !this.directionLocked && !this.options.freeScroll ) {
			if ( absDistX > absDistY + this.options.directionLockThreshold ) {
				this.directionLocked = 'h';		// lock horizontally
			} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
				this.directionLocked = 'v';		// lock vertically
			} else {
				this.directionLocked = 'n';		// no lock
			}
		}

		if ( this.directionLocked == 'h' ) {
			if ( this.options.eventPassthrough == 'vertical' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'horizontal' ) {
				this.initiated = false;
				return;
			}

			deltaY = 0;
		} else if ( this.directionLocked == 'v' ) {
			if ( this.options.eventPassthrough == 'horizontal' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'vertical' ) {
				this.initiated = false;
				return;
			}

			deltaX = 0;
		}

		deltaX = this.hasHorizontalScroll ? deltaX : 0;
		deltaY = this.hasVerticalScroll ? deltaY : 0;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries
		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if ( !this.moved ) {
			this._execEvent('scrollStart');
		}

		this.moved = true;

		this._translate(newX, newY);

/* REPLACE START: _move */

		if ( timestamp - this.startTime > 300 ) {
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}

/* REPLACE END: _move */

	},

	_end: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.changedTouches ? e.changedTouches[0] : e,
			momentumX,
			momentumY,
			duration = utils.getTime() - this.startTime,
			newX = Math.round(this.x),
			newY = Math.round(this.y),
			distanceX = Math.abs(newX - this.startX),
			distanceY = Math.abs(newY - this.startY),
			time = 0,
			easing = '';

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();

		// reset if we are outside of the boundaries
		if ( this.resetPosition(this.options.bounceTime) ) {
			return;
		}

		this.scrollTo(newX, newY);	// ensures that the last position is rounded

		// we scrolled less than 10 pixels
		if ( !this.moved ) {
			if ( this.options.tap ) {
				utils.tap(e, this.options.tap);
			}

			if ( this.options.click ) {
				utils.click(e);
			}

			this._execEvent('scrollCancel');
			return;
		}

		if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
			this._execEvent('flick');
			return;
		}

		// start momentum animation if needed
		if ( this.options.momentum && duration < 300 ) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}


		if ( this.options.snap ) {
			var snap = this._nearestSnap(newX, newY);
			this.currentPage = snap;
			time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(newX - snap.x), 1000),
						Math.min(Math.abs(newY - snap.y), 1000)
					), 300);
			newX = snap.x;
			newY = snap.y;

			this.directionX = 0;
			this.directionY = 0;
			easing = this.options.bounceEasing;
		}

// INSERT POINT: _end

		if ( newX != this.x || newY != this.y ) {
			// change easing function when scroller goes out of the boundaries
			if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
				easing = utils.ease.quadratic;
			}

			this.scrollTo(newX, newY, time, easing);
			return;
		}

		this._execEvent('scrollEnd');
	},

	_resize: function () {
		var that = this;

		clearTimeout(this.resizeTimeout);

		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},

	resetPosition: function (time) {
		var x = this.x,
			y = this.y;

		time = time || 0;

		if ( !this.hasHorizontalScroll || this.x > 0 ) {
			x = 0;
		} else if ( this.x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( !this.hasVerticalScroll || this.y > 0 ) {
			y = 0;
		} else if ( this.y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		if ( x == this.x && y == this.y ) {
			return false;
		}

		this.scrollTo(x, y, time, this.options.bounceEasing);

		return true;
	},

	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},

	refresh: function () {
		var rf = this.wrapper.offsetHeight;		// Force reflow

		this.wrapperWidth	= this.wrapper.clientWidth;
		this.wrapperHeight	= this.wrapper.clientHeight;

/* REPLACE START: refresh */
	this.scrollerWidth	= Math.round(this.scroller.offsetWidth * this.scale);
	this.scrollerHeight	= Math.round(this.scroller.offsetHeight * this.scale);

	this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
	this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;
/* REPLACE END: refresh */

		this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

		if ( !this.hasHorizontalScroll ) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if ( !this.hasVerticalScroll ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		this.wrapperOffset = utils.offset(this.wrapper);

		this._execEvent('refresh');

		this.resetPosition();

// INSERT POINT: _refresh

	},

	on: function (type, fn) {
		if ( !this._events[type] ) {
			this._events[type] = [];
		}

		this._events[type].push(fn);
	},

	off: function (type, fn) {
		if ( !this._events[type] ) {
			return;
		}

		var index = this._events[type].indexOf(fn);

		if ( index > -1 ) {
			this._events[type].splice(index, 1);
		}
	},

	_execEvent: function (type) {
		if ( !this._events[type] ) {
			return;
		}

		var i = 0,
			l = this._events[type].length;

		if ( !l ) {
			return;
		}

		for ( ; i < l; i++ ) {
			this._events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	},

	scrollBy: function (x, y, time, easing) {
		x = this.x + x;
		y = this.y + y;
		time = time || 0;

		this.scrollTo(x, y, time, easing);
	},

	scrollTo: function (x, y, time, easing) {
		easing = easing || utils.ease.circular;

		this.isInTransition = this.options.useTransition && time > 0;
		var transitionType = this.options.useTransition && easing.style;
		if ( !time || transitionType ) {
				if(transitionType) {
					this._transitionTimingFunction(easing.style);
					this._transitionTime(time);
				}
			this._translate(x, y);
		} else {
			this._animate(x, y, time, easing.fn);
		}
	},

	scrollToElement: function (el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if ( !el ) {
			return;
		}

		var pos = utils.offset(el);

		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		if ( offsetX === true ) {
			offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
		}

		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;

		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},

	_transitionTime: function (time) {
		time = time || 0;

		var durationProp = utils.style.transitionDuration;
		this.scrollerStyle[durationProp] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.scrollerStyle[durationProp] = '0.0001ms';
			// remove 0.0001ms
			var self = this;
			rAF(function() {
				if(self.scrollerStyle[durationProp] === '0.0001ms') {
					self.scrollerStyle[durationProp] = '0s';
				}
			});
		}


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].transitionTime(time);
			}
		}


// INSERT POINT: _transitionTime

	},

	_transitionTimingFunction: function (easing) {
		this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].transitionTimingFunction(easing);
			}
		}


// INSERT POINT: _transitionTimingFunction

	},

	_translate: function (x, y) {
		if ( this.options.useTransform ) {

/* REPLACE START: _translate */			this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ') ' + this.translateZ;/* REPLACE END: _translate */

		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}

		this.x = x;
		this.y = y;


	if ( this.indicators ) {
		for ( var i = this.indicators.length; i--; ) {
			this.indicators[i].updatePosition();
		}
	}


// INSERT POINT: _translate

	},

	_initEvents: function (remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
			target = this.options.bindToWrapper ? this.wrapper : window;

		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if ( this.options.click ) {
			eventType(this.wrapper, 'click', this, true);
		}

		if ( !this.options.disableMouse ) {
			eventType(this.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if ( utils.hasPointer && !this.options.disablePointer ) {
			eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
			eventType(target, utils.prefixPointerEvent('pointermove'), this);
			eventType(target, utils.prefixPointerEvent('pointercancel'), this);
			eventType(target, utils.prefixPointerEvent('pointerup'), this);
		}

		if ( utils.hasTouch && !this.options.disableTouch ) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);
	},

	getComputedPosition: function () {
		var matrix = window.getComputedStyle(this.scroller, null),
			x, y;

		if ( this.options.useTransform ) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	},
	_initIndicators: function () {
		var interactive = this.options.interactiveScrollbars,
			customStyle = typeof this.options.scrollbars != 'string',
			indicators = [],
			indicator;

		var that = this;

		this.indicators = [];

		if ( this.options.scrollbars ) {
			// Vertical scrollbar
			if ( this.options.scrollY ) {
				indicator = {
					el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenX: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			// Horizontal scrollbar
			if ( this.options.scrollX ) {
				indicator = {
					el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenY: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}
		}

		if ( this.options.indicators ) {
			// TODO: check concat compatibility
			indicators = indicators.concat(this.options.indicators);
		}

		for ( var i = indicators.length; i--; ) {
			this.indicators.push( new Indicator(this, indicators[i]) );
		}

		// TODO: check if we can use array.map (wide compatibility and performance issues)
		function _indicatorsMap (fn) {
			if (that.indicators) {
				for ( var i = that.indicators.length; i--; ) {
					fn.call(that.indicators[i]);
				}
			}
		}

		if ( this.options.fadeScrollbars ) {
			this.on('scrollEnd', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollCancel', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1);
				});
			});

			this.on('beforeScrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1, true);
				});
			});
		}


		this.on('refresh', function () {
			_indicatorsMap(function () {
				this.refresh();
			});
		});

		this.on('destroy', function () {
			_indicatorsMap(function () {
				this.destroy();
			});

			delete this.indicators;
		});
	},

	_initZoom: function () {
		this.scrollerStyle[utils.style.transformOrigin] = '0 0';
	},

	_zoomStart: function (e) {
		var c1 = Math.abs( e.touches[0].pageX - e.touches[1].pageX ),
			c2 = Math.abs( e.touches[0].pageY - e.touches[1].pageY );

		this.touchesDistanceStart = Math.sqrt(c1 * c1 + c2 * c2);
		this.startScale = this.scale;

		this.originX = Math.abs(e.touches[0].pageX + e.touches[1].pageX) / 2 + this.wrapperOffset.left - this.x;
		this.originY = Math.abs(e.touches[0].pageY + e.touches[1].pageY) / 2 + this.wrapperOffset.top - this.y;

		this._execEvent('zoomStart');
	},

	_zoom: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault ) {
			e.preventDefault();
		}

		var c1 = Math.abs( e.touches[0].pageX - e.touches[1].pageX ),
			c2 = Math.abs( e.touches[0].pageY - e.touches[1].pageY ),
			distance = Math.sqrt( c1 * c1 + c2 * c2 ),
			scale = 1 / this.touchesDistanceStart * distance * this.startScale,
			lastScale,
			x, y;

		this.scaled = true;

		if ( scale < this.options.zoomMin ) {
			scale = 0.5 * this.options.zoomMin * Math.pow(2.0, scale / this.options.zoomMin);
		} else if ( scale > this.options.zoomMax ) {
			scale = 2.0 * this.options.zoomMax * Math.pow(0.5, this.options.zoomMax / scale);
		}

		lastScale = scale / this.startScale;
		x = this.originX - this.originX * lastScale + this.startX;
		y = this.originY - this.originY * lastScale + this.startY;

		this.scale = scale;

		this.scrollTo(x, y, 0);
	},

	_zoomEnd: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault ) {
			e.preventDefault();
		}

		var newX, newY,
			lastScale;

		this.isInTransition = 0;
		this.initiated = 0;

		if ( this.scale > this.options.zoomMax ) {
			this.scale = this.options.zoomMax;
		} else if ( this.scale < this.options.zoomMin ) {
			this.scale = this.options.zoomMin;
		}

		// Update boundaries
		this.refresh();

		lastScale = this.scale / this.startScale;

		newX = this.originX - this.originX * lastScale + this.startX;
		newY = this.originY - this.originY * lastScale + this.startY;

		if ( newX > 0 ) {
			newX = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
		}

		if ( newY > 0 ) {
			newY = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
		}

		if ( this.x != newX || this.y != newY ) {
			this.scrollTo(newX, newY, this.options.bounceTime);
		}

		this.scaled = false;

		this._execEvent('zoomEnd');
	},

	zoom: function (scale, x, y, time) {
		if ( scale < this.options.zoomMin ) {
			scale = this.options.zoomMin;
		} else if ( scale > this.options.zoomMax ) {
			scale = this.options.zoomMax;
		}

		if ( scale == this.scale ) {
			return;
		}

		var relScale = scale / this.scale;

		x = x === undefined ? this.wrapperWidth / 2 : x;
		y = y === undefined ? this.wrapperHeight / 2 : y;
		time = time === undefined ? 300 : time;

		x = x + this.wrapperOffset.left - this.x;
		y = y + this.wrapperOffset.top - this.y;

		x = x - x * relScale + this.x;
		y = y - y * relScale + this.y;

		this.scale = scale;

		this.refresh();		// update boundaries

		if ( x > 0 ) {
			x = 0;
		} else if ( x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( y > 0 ) {
			y = 0;
		} else if ( y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		this.scrollTo(x, y, time);
	},

	_wheelZoom: function (e) {
		var wheelDeltaY,
			deltaScale,
			that = this;

		// Execute the zoomEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(function () {
			that._execEvent('zoomEnd');
		}, 400);

		if ( 'deltaX' in e ) {
			wheelDeltaY = -e.deltaY / Math.abs(e.deltaY);
		} else if ('wheelDeltaX' in e) {
			wheelDeltaY = e.wheelDeltaY / Math.abs(e.wheelDeltaY);
		} else if('wheelDelta' in e) {
			wheelDeltaY = e.wheelDelta / Math.abs(e.wheelDelta);
		} else if ('detail' in e) {
			wheelDeltaY = -e.detail / Math.abs(e.wheelDelta);
		} else {
			return;
		}

		deltaScale = this.scale + wheelDeltaY / 5;

		this.zoom(deltaScale, e.pageX, e.pageY, 0);
	},

	_initWheel: function () {
		utils.addEvent(this.wrapper, 'wheel', this);
		utils.addEvent(this.wrapper, 'mousewheel', this);
		utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

		this.on('destroy', function () {
			clearTimeout(this.wheelTimeout);
			this.wheelTimeout = null;
			utils.removeEvent(this.wrapper, 'wheel', this);
			utils.removeEvent(this.wrapper, 'mousewheel', this);
			utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
		});
	},

	_wheel: function (e) {
		if ( !this.enabled ) {
			return;
		}

		e.preventDefault();

		var wheelDeltaX, wheelDeltaY,
			newX, newY,
			that = this;

		if ( this.wheelTimeout === undefined ) {
			that._execEvent('scrollStart');
		}

		// Execute the scrollEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(function () {
			if(!that.options.snap) {
				that._execEvent('scrollEnd');
			}
			that.wheelTimeout = undefined;
		}, 400);

		if ( 'deltaX' in e ) {
			if (e.deltaMode === 1) {
				wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
				wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
			} else {
				wheelDeltaX = -e.deltaX;
				wheelDeltaY = -e.deltaY;
			}
		} else if ( 'wheelDeltaX' in e ) {
			wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
			wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
		} else if ( 'wheelDelta' in e ) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
		} else if ( 'detail' in e ) {
			wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
		} else {
			return;
		}

		wheelDeltaX *= this.options.invertWheelDirection;
		wheelDeltaY *= this.options.invertWheelDirection;

		if ( !this.hasVerticalScroll ) {
			wheelDeltaX = wheelDeltaY;
			wheelDeltaY = 0;
		}

		if ( this.options.snap ) {
			newX = this.currentPage.pageX;
			newY = this.currentPage.pageY;

			if ( wheelDeltaX > 0 ) {
				newX--;
			} else if ( wheelDeltaX < 0 ) {
				newX++;
			}

			if ( wheelDeltaY > 0 ) {
				newY--;
			} else if ( wheelDeltaY < 0 ) {
				newY++;
			}

			this.goToPage(newX, newY);

			return;
		}

		newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
		newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

		this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
		this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;

		if ( newX > 0 ) {
			newX = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
		}

		if ( newY > 0 ) {
			newY = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
		}

		this.scrollTo(newX, newY, 0);

// INSERT POINT: _wheel
	},

	_initSnap: function () {
		this.currentPage = {};

		if ( typeof this.options.snap == 'string' ) {
			this.options.snap = this.scroller.querySelectorAll(this.options.snap);
		}

		this.on('refresh', function () {
			var i = 0, l,
				m = 0, n,
				cx, cy,
				x = 0, y,
				stepX = this.options.snapStepX || this.wrapperWidth,
				stepY = this.options.snapStepY || this.wrapperHeight,
				el;

			this.pages = [];

			if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
				return;
			}

			if ( this.options.snap === true ) {
				cx = Math.round( stepX / 2 );
				cy = Math.round( stepY / 2 );

				while ( x > -this.scrollerWidth ) {
					this.pages[i] = [];
					l = 0;
					y = 0;

					while ( y > -this.scrollerHeight ) {
						this.pages[i][l] = {
							x: Math.max(x, this.maxScrollX),
							y: Math.max(y, this.maxScrollY),
							width: stepX,
							height: stepY,
							cx: x - cx,
							cy: y - cy
						};

						y -= stepY;
						l++;
					}

					x -= stepX;
					i++;
				}
			} else {
				el = this.options.snap;
				l = el.length;
				n = -1;

				for ( ; i < l; i++ ) {
					if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
						m = 0;
						n++;
					}

					if ( !this.pages[m] ) {
						this.pages[m] = [];
					}

					x = Math.max(-el[i].offsetLeft, this.maxScrollX);
					y = Math.max(-el[i].offsetTop, this.maxScrollY);
					cx = x - Math.round(el[i].offsetWidth / 2);
					cy = y - Math.round(el[i].offsetHeight / 2);

					this.pages[m][n] = {
						x: x,
						y: y,
						width: el[i].offsetWidth,
						height: el[i].offsetHeight,
						cx: cx,
						cy: cy
					};

					if ( x > this.maxScrollX ) {
						m++;
					}
				}
			}

			this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

			// Update snap threshold if needed
			if ( this.options.snapThreshold % 1 === 0 ) {
				this.snapThresholdX = this.options.snapThreshold;
				this.snapThresholdY = this.options.snapThreshold;
			} else {
				this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
				this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
			}
		});

		this.on('flick', function () {
			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.x - this.startX), 1000),
						Math.min(Math.abs(this.y - this.startY), 1000)
					), 300);

			this.goToPage(
				this.currentPage.pageX + this.directionX,
				this.currentPage.pageY + this.directionY,
				time
			);
		});
	},

	_nearestSnap: function (x, y) {
		if ( !this.pages.length ) {
			return { x: 0, y: 0, pageX: 0, pageY: 0 };
		}

		var i = 0,
			l = this.pages.length,
			m = 0;

		// Check if we exceeded the snap threshold
		if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
			Math.abs(y - this.absStartY) < this.snapThresholdY ) {
			return this.currentPage;
		}

		if ( x > 0 ) {
			x = 0;
		} else if ( x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( y > 0 ) {
			y = 0;
		} else if ( y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		for ( ; i < l; i++ ) {
			if ( x >= this.pages[i][0].cx ) {
				x = this.pages[i][0].x;
				break;
			}
		}

		l = this.pages[i].length;

		for ( ; m < l; m++ ) {
			if ( y >= this.pages[0][m].cy ) {
				y = this.pages[0][m].y;
				break;
			}
		}

		if ( i == this.currentPage.pageX ) {
			i += this.directionX;

			if ( i < 0 ) {
				i = 0;
			} else if ( i >= this.pages.length ) {
				i = this.pages.length - 1;
			}

			x = this.pages[i][0].x;
		}

		if ( m == this.currentPage.pageY ) {
			m += this.directionY;

			if ( m < 0 ) {
				m = 0;
			} else if ( m >= this.pages[0].length ) {
				m = this.pages[0].length - 1;
			}

			y = this.pages[0][m].y;
		}

		return {
			x: x,
			y: y,
			pageX: i,
			pageY: m
		};
	},

	goToPage: function (x, y, time, easing) {
		easing = easing || this.options.bounceEasing;

		if ( x >= this.pages.length ) {
			x = this.pages.length - 1;
		} else if ( x < 0 ) {
			x = 0;
		}

		if ( y >= this.pages[x].length ) {
			y = this.pages[x].length - 1;
		} else if ( y < 0 ) {
			y = 0;
		}

		var posX = this.pages[x][y].x,
			posY = this.pages[x][y].y;

		time = time === undefined ? this.options.snapSpeed || Math.max(
			Math.max(
				Math.min(Math.abs(posX - this.x), 1000),
				Math.min(Math.abs(posY - this.y), 1000)
			), 300) : time;

		this.currentPage = {
			x: posX,
			y: posY,
			pageX: x,
			pageY: y
		};

		this.scrollTo(posX, posY, time, easing);
	},

	next: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x++;

		if ( x >= this.pages.length && this.hasVerticalScroll ) {
			x = 0;
			y++;
		}

		this.goToPage(x, y, time, easing);
	},

	prev: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x--;

		if ( x < 0 && this.hasVerticalScroll ) {
			x = 0;
			y--;
		}

		this.goToPage(x, y, time, easing);
	},

	_initKeys: function (e) {
		// default key bindings
		var keys = {
			pageUp: 33,
			pageDown: 34,
			end: 35,
			home: 36,
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		var i;

		// if you give me characters I give you keycode
		if ( typeof this.options.keyBindings == 'object' ) {
			for ( i in this.options.keyBindings ) {
				if ( typeof this.options.keyBindings[i] == 'string' ) {
					this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
				}
			}
		} else {
			this.options.keyBindings = {};
		}

		for ( i in keys ) {
			this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
		}

		utils.addEvent(window, 'keydown', this);

		this.on('destroy', function () {
			utils.removeEvent(window, 'keydown', this);
		});
	},

	_key: function (e) {
		if ( !this.enabled ) {
			return;
		}

		var snap = this.options.snap,	// we are using this alot, better to cache it
			newX = snap ? this.currentPage.pageX : this.x,
			newY = snap ? this.currentPage.pageY : this.y,
			now = utils.getTime(),
			prevTime = this.keyTime || 0,
			acceleration = 0.250,
			pos;

		if ( this.options.useTransition && this.isInTransition ) {
			pos = this.getComputedPosition();

			this._translate(Math.round(pos.x), Math.round(pos.y));
			this.isInTransition = false;
		}

		this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

		switch ( e.keyCode ) {
			case this.options.keyBindings.pageUp:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX += snap ? 1 : this.wrapperWidth;
				} else {
					newY += snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.pageDown:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX -= snap ? 1 : this.wrapperWidth;
				} else {
					newY -= snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.end:
				newX = snap ? this.pages.length-1 : this.maxScrollX;
				newY = snap ? this.pages[0].length-1 : this.maxScrollY;
				break;
			case this.options.keyBindings.home:
				newX = 0;
				newY = 0;
				break;
			case this.options.keyBindings.left:
				newX += snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.up:
				newY += snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.right:
				newX -= snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.down:
				newY -= snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			default:
				return;
		}

		if ( snap ) {
			this.goToPage(newX, newY);
			return;
		}

		if ( newX > 0 ) {
			newX = 0;
			this.keyAcceleration = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
			this.keyAcceleration = 0;
		}

		if ( newY > 0 ) {
			newY = 0;
			this.keyAcceleration = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
			this.keyAcceleration = 0;
		}

		this.scrollTo(newX, newY, 0);

		this.keyTime = now;
	},

	_animate: function (destX, destY, duration, easingFn) {
		var that = this,
			startX = this.x,
			startY = this.y,
			startTime = utils.getTime(),
			destTime = startTime + duration;

		function step () {
			var now = utils.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if ( !that.resetPosition(that.options.bounceTime) ) {
					that._execEvent('scrollEnd');
				}

				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that._translate(newX, newY);

			if ( that.isAnimating ) {
				rAF(step);
			}
		}

		this.isAnimating = true;
		step();
	},
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);

				if ( this.options.zoom && e.touches && e.touches.length > 1 ) {
					this._zoomStart(e);
				}
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				if ( this.options.zoom && e.touches && e.touches[1] ) {
					this._zoom(e);
					return;
				}
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				if ( this.scaled ) {
					this._zoomEnd(e);
					return;
				}
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				if ( this.options.wheelAction == 'zoom' ) {
					this._wheelZoom(e);
					return;	
				}
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
		}
	}

};
function createDefaultScrollbar (direction, interactive, type) {
	var scrollbar = document.createElement('div'),
		indicator = document.createElement('div');

	if ( type === true ) {
		scrollbar.style.cssText = 'position:absolute;z-index:9999';
		indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
	}

	indicator.className = 'iScrollIndicator';

	if ( direction == 'h' ) {
		if ( type === true ) {
			scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
			indicator.style.height = '100%';
		}
		scrollbar.className = 'iScrollHorizontalScrollbar';
	} else {
		if ( type === true ) {
			scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
			indicator.style.width = '100%';
		}
		scrollbar.className = 'iScrollVerticalScrollbar';
	}

	scrollbar.style.cssText += ';overflow:hidden';

	if ( !interactive ) {
		scrollbar.style.pointerEvents = 'none';
	}

	scrollbar.appendChild(indicator);

	return scrollbar;
}

function Indicator (scroller, options) {
	this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
	this.wrapperStyle = this.wrapper.style;
	this.indicator = this.wrapper.children[0];
	this.indicatorStyle = this.indicator.style;
	this.scroller = scroller;

	this.options = {
		listenX: true,
		listenY: true,
		interactive: false,
		resize: true,
		defaultScrollbars: false,
		shrink: false,
		fade: false,
		speedRatioX: 0,
		speedRatioY: 0
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	this.sizeRatioX = 1;
	this.sizeRatioY = 1;
	this.maxPosX = 0;
	this.maxPosY = 0;

	if ( this.options.interactive ) {
		if ( !this.options.disableTouch ) {
			utils.addEvent(this.indicator, 'touchstart', this);
			utils.addEvent(window, 'touchend', this);
		}
		if ( !this.options.disablePointer ) {
			utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
		}
		if ( !this.options.disableMouse ) {
			utils.addEvent(this.indicator, 'mousedown', this);
			utils.addEvent(window, 'mouseup', this);
		}
	}

	if ( this.options.fade ) {
		this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
		var durationProp = utils.style.transitionDuration;
		this.wrapperStyle[durationProp] = utils.isBadAndroid ? '0.0001ms' : '0ms';
		// remove 0.0001ms
		var self = this;
		if(utils.isBadAndroid) {
			rAF(function() {
				if(self.wrapperStyle[durationProp] === '0.0001ms') {
					self.wrapperStyle[durationProp] = '0s';
				}
			});
		}
		this.wrapperStyle.opacity = '0';
	}
}

Indicator.prototype = {
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
		}
	},

	destroy: function () {
		if ( this.options.fadeScrollbars ) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}
		if ( this.options.interactive ) {
			utils.removeEvent(this.indicator, 'touchstart', this);
			utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.removeEvent(this.indicator, 'mousedown', this);

			utils.removeEvent(window, 'touchmove', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
			utils.removeEvent(window, 'mousemove', this);

			utils.removeEvent(window, 'touchend', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
			utils.removeEvent(window, 'mouseup', this);
		}

		if ( this.options.defaultScrollbars ) {
			this.wrapper.parentNode.removeChild(this.wrapper);
		}
	},

	_start: function (e) {
		var point = e.touches ? e.touches[0] : e;

		e.preventDefault();
		e.stopPropagation();

		this.transitionTime();

		this.initiated = true;
		this.moved = false;
		this.lastPointX	= point.pageX;
		this.lastPointY	= point.pageY;

		this.startTime	= utils.getTime();

		if ( !this.options.disableTouch ) {
			utils.addEvent(window, 'touchmove', this);
		}
		if ( !this.options.disablePointer ) {
			utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
		}
		if ( !this.options.disableMouse ) {
			utils.addEvent(window, 'mousemove', this);
		}

		this.scroller._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		var point = e.touches ? e.touches[0] : e,
			deltaX, deltaY,
			newX, newY,
			timestamp = utils.getTime();

		if ( !this.moved ) {
			this.scroller._execEvent('scrollStart');
		}

		this.moved = true;

		deltaX = point.pageX - this.lastPointX;
		this.lastPointX = point.pageX;

		deltaY = point.pageY - this.lastPointY;
		this.lastPointY = point.pageY;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		this._pos(newX, newY);

// INSERT POINT: indicator._move

		e.preventDefault();
		e.stopPropagation();
	},

	_end: function (e) {
		if ( !this.initiated ) {
			return;
		}

		this.initiated = false;

		e.preventDefault();
		e.stopPropagation();

		utils.removeEvent(window, 'touchmove', this);
		utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
		utils.removeEvent(window, 'mousemove', this);

		if ( this.scroller.options.snap ) {
			var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.scroller.x - snap.x), 1000),
						Math.min(Math.abs(this.scroller.y - snap.y), 1000)
					), 300);

			if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
				this.scroller.directionX = 0;
				this.scroller.directionY = 0;
				this.scroller.currentPage = snap;
				this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
			}
		}

		if ( this.moved ) {
			this.scroller._execEvent('scrollEnd');
		}
	},

	transitionTime: function (time) {
		time = time || 0;
		var durationProp = utils.style.transitionDuration;
		this.indicatorStyle[durationProp] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.indicatorStyle[durationProp] = '0.0001ms';
			// remove 0.0001ms
			var self = this;
			rAF(function() {
				if(self.indicatorStyle[durationProp] === '0.0001ms') {
					self.indicatorStyle[durationProp] = '0s';
				}
			});
		}
	},

	transitionTimingFunction: function (easing) {
		this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
	},

	refresh: function () {
		this.transitionTime();

		if ( this.options.listenX && !this.options.listenY ) {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
		} else if ( this.options.listenY && !this.options.listenX ) {
			this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
		} else {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
		}

		if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
			utils.addClass(this.wrapper, 'iScrollBothScrollbars');
			utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '8px';
				} else {
					this.wrapper.style.bottom = '8px';
				}
			}
		} else {
			utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
			utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '2px';
				} else {
					this.wrapper.style.bottom = '2px';
				}
			}
		}

		var r = this.wrapper.offsetHeight;	// force refresh

		if ( this.options.listenX ) {
			this.wrapperWidth = this.wrapper.clientWidth;
			if ( this.options.resize ) {
				this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
				this.indicatorStyle.width = this.indicatorWidth + 'px';
			} else {
				this.indicatorWidth = this.indicator.clientWidth;
			}

			this.maxPosX = this.wrapperWidth - this.indicatorWidth;

			if ( this.options.shrink == 'clip' ) {
				this.minBoundaryX = -this.indicatorWidth + 8;
				this.maxBoundaryX = this.wrapperWidth - 8;
			} else {
				this.minBoundaryX = 0;
				this.maxBoundaryX = this.maxPosX;
			}

			this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
		}

		if ( this.options.listenY ) {
			this.wrapperHeight = this.wrapper.clientHeight;
			if ( this.options.resize ) {
				this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
				this.indicatorStyle.height = this.indicatorHeight + 'px';
			} else {
				this.indicatorHeight = this.indicator.clientHeight;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;

			if ( this.options.shrink == 'clip' ) {
				this.minBoundaryY = -this.indicatorHeight + 8;
				this.maxBoundaryY = this.wrapperHeight - 8;
			} else {
				this.minBoundaryY = 0;
				this.maxBoundaryY = this.maxPosY;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;
			this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
		}

		this.updatePosition();
	},

	updatePosition: function () {
		var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
			y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

		if ( !this.options.ignoreBoundaries ) {
			if ( x < this.minBoundaryX ) {
				if ( this.options.shrink == 'scale' ) {
					this.width = Math.max(this.indicatorWidth + x, 8);
					this.indicatorStyle.width = this.width + 'px';
				}
				x = this.minBoundaryX;
			} else if ( x > this.maxBoundaryX ) {
				if ( this.options.shrink == 'scale' ) {
					this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
					this.indicatorStyle.width = this.width + 'px';
					x = this.maxPosX + this.indicatorWidth - this.width;
				} else {
					x = this.maxBoundaryX;
				}
			} else if ( this.options.shrink == 'scale' && this.width != this.indicatorWidth ) {
				this.width = this.indicatorWidth;
				this.indicatorStyle.width = this.width + 'px';
			}

			if ( y < this.minBoundaryY ) {
				if ( this.options.shrink == 'scale' ) {
					this.height = Math.max(this.indicatorHeight + y * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
				}
				y = this.minBoundaryY;
			} else if ( y > this.maxBoundaryY ) {
				if ( this.options.shrink == 'scale' ) {
					this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
					y = this.maxPosY + this.indicatorHeight - this.height;
				} else {
					y = this.maxBoundaryY;
				}
			} else if ( this.options.shrink == 'scale' && this.height != this.indicatorHeight ) {
				this.height = this.indicatorHeight;
				this.indicatorStyle.height = this.height + 'px';
			}
		}

		this.x = x;
		this.y = y;

		if ( this.scroller.options.useTransform ) {
			this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
		} else {
			this.indicatorStyle.left = x + 'px';
			this.indicatorStyle.top = y + 'px';
		}
	},

	_pos: function (x, y) {
		if ( x < 0 ) {
			x = 0;
		} else if ( x > this.maxPosX ) {
			x = this.maxPosX;
		}

		if ( y < 0 ) {
			y = 0;
		} else if ( y > this.maxPosY ) {
			y = this.maxPosY;
		}

		x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
		y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

		this.scroller.scrollTo(x, y);
	},

	fade: function (val, hold) {
		if ( hold && !this.visible ) {
			return;
		}

		clearTimeout(this.fadeTimeout);
		this.fadeTimeout = null;

		var time = val ? 250 : 500,
			delay = val ? 0 : 300;

		val = val ? '1' : '0';

		this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

		this.fadeTimeout = setTimeout((function (val) {
			this.wrapperStyle.opacity = val;
			this.visible = +val;
		}).bind(this, val), delay);
	}
};

IScroll.utils = utils;

if ( typeof module != 'undefined' && module.exports ) {
	module.exports = IScroll;
} else if ( typeof define == 'function' && define.amd ) {
        define( function () { return IScroll; } );
} else {
	window.IScroll = IScroll;
}

})(window, document, Math);

},{}],2:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Navigo=t()}(this,function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function t(){return!("undefined"==typeof window||!window.history||!window.history.pushState)}function n(e,n,o){this.root=null,this._routes=[],this._useHash=n,this._hash=void 0===o?"#":o,this._paused=!1,this._destroyed=!1,this._lastRouteResolved=null,this._notFoundHandler=null,this._defaultHandler=null,this._usePushState=!n&&t(),this._onLocationChange=this._onLocationChange.bind(this),this._genericHooks=null,this._historyAPIUpdateMethod="pushState",e?this.root=n?e.replace(/\/$/,"/"+this._hash):e.replace(/\/$/,""):n&&(this.root=this._cLoc().split(this._hash)[0].replace(/\/$/,"/"+this._hash)),this._listen(),this.updatePageLinks()}function o(e){return e instanceof RegExp?e:e.replace(/\/+$/,"").replace(/^\/+/,"^/")}function i(e){return e.replace(/\/$/,"").split("/").length}function s(e,t){return i(t)-i(e)}function r(e,t){return function(e){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]).map(function(t){var i=function(e){var t=[];return{regexp:e instanceof RegExp?e:new RegExp(e.replace(n.PARAMETER_REGEXP,function(e,o,i){return t.push(i),n.REPLACE_VARIABLE_REGEXP}).replace(n.WILDCARD_REGEXP,n.REPLACE_WILDCARD)+n.FOLLOWED_BY_SLASH_REGEXP,n.MATCH_REGEXP_FLAGS),paramNames:t}}(o(t.route)),s=i.regexp,r=i.paramNames,a=e.replace(/^\/+/,"/").match(s),h=function(e,t){return 0===t.length?null:e?e.slice(1,e.length).reduce(function(e,n,o){return null===e&&(e={}),e[t[o]]=decodeURIComponent(n),e},null):null}(a,r);return!!a&&{match:a,route:t,params:h}}).filter(function(e){return e})}(e,t)[0]||!1}function a(e,t){var n=t.map(function(t){return""===t.route||"*"===t.route?e:e.split(new RegExp(t.route+"($|/)"))[0]}),i=o(e);return n.length>1?n.reduce(function(e,t){return e.length>t.length&&(e=t),e},n[0]):1===n.length?n[0]:i}function h(e,n,o){var i,s=function(e){return e.split(/\?(.*)?$/)[0]};return void 0===o&&(o="#"),t()&&!n?s(e).split(o)[0]:(i=e.split(o)).length>1?s(i[1]):s(i[0])}function u(t,n,o){if(n&&"object"===(void 0===n?"undefined":e(n))){if(n.before)return void n.before(function(){(!(arguments.length>0&&void 0!==arguments[0])||arguments[0])&&(t(),n.after&&n.after(o))},o);if(n.after)return t(),void(n.after&&n.after(o))}t()}return n.prototype={helpers:{match:r,root:a,clean:o,getOnlyURL:h},navigate:function(e,t){var n;return e=e||"",this._usePushState?(n=(n=(t?"":this._getRoot()+"/")+e.replace(/^\/+/,"/")).replace(/([^:])(\/{2,})/g,"$1/"),history[this._historyAPIUpdateMethod]({},"",n),this.resolve()):"undefined"!=typeof window&&(e=e.replace(new RegExp("^"+this._hash),""),window.location.href=window.location.href.replace(/#$/,"").replace(new RegExp(this._hash+".*$"),"")+this._hash+e),this},on:function(){for(var t=this,n=arguments.length,o=Array(n),i=0;i<n;i++)o[i]=arguments[i];if("function"==typeof o[0])this._defaultHandler={handler:o[0],hooks:o[1]};else if(o.length>=2)if("/"===o[0]){var r=o[1];"object"===e(o[1])&&(r=o[1].uses),this._defaultHandler={handler:r,hooks:o[2]}}else this._add(o[0],o[1],o[2]);else"object"===e(o[0])&&Object.keys(o[0]).sort(s).forEach(function(e){t.on(e,o[0][e])});return this},off:function(e){return null!==this._defaultHandler&&e===this._defaultHandler.handler?this._defaultHandler=null:null!==this._notFoundHandler&&e===this._notFoundHandler.handler&&(this._notFoundHandler=null),this._routes=this._routes.reduce(function(t,n){return n.handler!==e&&t.push(n),t},[]),this},notFound:function(e,t){return this._notFoundHandler={handler:e,hooks:t},this},resolve:function(e){var n,o,i=this,s=(e||this._cLoc()).replace(this._getRoot(),"");this._useHash&&(s=s.replace(new RegExp("^/"+this._hash),"/"));var a=function(e){return e.split(/\?(.*)?$/).slice(1).join("")}(e||this._cLoc()),l=h(s,this._useHash,this._hash);return!this._paused&&(this._lastRouteResolved&&l===this._lastRouteResolved.url&&a===this._lastRouteResolved.query?(this._lastRouteResolved.hooks&&this._lastRouteResolved.hooks.already&&this._lastRouteResolved.hooks.already(this._lastRouteResolved.params),!1):(o=r(l,this._routes))?(this._callLeave(),this._lastRouteResolved={url:l,query:a,hooks:o.route.hooks,params:o.params,name:o.route.name},n=o.route.handler,u(function(){u(function(){o.route.route instanceof RegExp?n.apply(void 0,o.match.slice(1,o.match.length)):n(o.params,a)},o.route.hooks,o.params,i._genericHooks)},this._genericHooks,o.params),o):this._defaultHandler&&(""===l||"/"===l||l===this._hash||function(e,n,o){if(t()&&!n)return!1;if(!e.match(o))return!1;var i=e.split(o);return i.length<2||""===i[1]}(l,this._useHash,this._hash))?(u(function(){u(function(){i._callLeave(),i._lastRouteResolved={url:l,query:a,hooks:i._defaultHandler.hooks},i._defaultHandler.handler(a)},i._defaultHandler.hooks)},this._genericHooks),!0):(this._notFoundHandler&&u(function(){u(function(){i._callLeave(),i._lastRouteResolved={url:l,query:a,hooks:i._notFoundHandler.hooks},i._notFoundHandler.handler(a)},i._notFoundHandler.hooks)},this._genericHooks),!1))},destroy:function(){this._routes=[],this._destroyed=!0,this._lastRouteResolved=null,this._genericHooks=null,clearTimeout(this._listeningInterval),"undefined"!=typeof window&&(window.removeEventListener("popstate",this._onLocationChange),window.removeEventListener("hashchange",this._onLocationChange))},updatePageLinks:function(){var e=this;"undefined"!=typeof document&&this._findLinks().forEach(function(t){t.hasListenerAttached||(t.addEventListener("click",function(n){if((n.ctrlKey||n.metaKey)&&"a"==n.target.tagName.toLowerCase())return!1;var o=e.getLinkPath(t);e._destroyed||(n.preventDefault(),e.navigate(o.replace(/\/+$/,"").replace(/^\/+/,"/")))}),t.hasListenerAttached=!0)})},generate:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=this._routes.reduce(function(n,o){var i;if(o.name===e)for(i in n=o.route,t)n=n.toString().replace(":"+i,t[i]);return n},"");return this._useHash?this._hash+n:n},link:function(e){return this._getRoot()+e},pause:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this._paused=e,this._historyAPIUpdateMethod=e?"replaceState":"pushState"},resume:function(){this.pause(!1)},historyAPIUpdateMethod:function(e){return void 0===e?this._historyAPIUpdateMethod:(this._historyAPIUpdateMethod=e,e)},disableIfAPINotAvailable:function(){t()||this.destroy()},lastRouteResolved:function(){return this._lastRouteResolved},getLinkPath:function(e){return e.getAttribute("href")},hooks:function(e){this._genericHooks=e},_add:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return"string"==typeof t&&(t=encodeURI(t)),this._routes.push("object"===(void 0===n?"undefined":e(n))?{route:t,handler:n.uses,name:n.as,hooks:o||n.hooks}:{route:t,handler:n,hooks:o}),this._add},_getRoot:function(){return null!==this.root?this.root:(this.root=a(this._cLoc().split("?")[0],this._routes),this.root)},_listen:function(){var e=this;if(this._usePushState)window.addEventListener("popstate",this._onLocationChange);else if("undefined"!=typeof window&&"onhashchange"in window)window.addEventListener("hashchange",this._onLocationChange);else{var t=this._cLoc(),n=void 0,o=void 0;(o=function(){n=e._cLoc(),t!==n&&(t=n,e.resolve()),e._listeningInterval=setTimeout(o,200)})()}},_cLoc:function(){return"undefined"!=typeof window?void 0!==window.__NAVIGO_WINDOW_LOCATION_MOCK__?window.__NAVIGO_WINDOW_LOCATION_MOCK__:o(window.location.href):""},_findLinks:function(){return[].slice.call(document.querySelectorAll("[data-navigo]"))},_onLocationChange:function(){this.resolve()},_callLeave:function(){var e=this._lastRouteResolved;e&&e.hooks&&e.hooks.leave&&e.hooks.leave(e.params)}},n.PARAMETER_REGEXP=/([:*])(\w+)/g,n.WILDCARD_REGEXP=/\*/g,n.REPLACE_VARIABLE_REGEXP="([^/]+)",n.REPLACE_WILDCARD="(?:.*)",n.FOLLOWED_BY_SLASH_REGEXP="(?:/$|$)",n.MATCH_REGEXP_FLAGS="",n});


},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shopifyAPI = require('./shopifyAPI');

var _shopifyAPI2 = _interopRequireDefault(_shopifyAPI);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _currency = require('./currency');

var _currency2 = _interopRequireDefault(_currency);

var _images = require('./images');

var _images2 = _interopRequireDefault(_images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $window = $(window);
var $body = $('body');

var selectors = {
  container: '[data-ajax-cart-container]',
  template: 'script[data-ajax-cart-template]',
  trigger: '[data-ajax-cart-trigger]',
  close: '[data-ajax-cart-close]',
  addForm: 'form[action^="/cart/add"]',
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]',
  header: '[data-ajax-cart-header]',
  body: '[data-ajax-cart-body]',
  footer: '[data-ajax-cart-footer]',
  item: '[data-ajax-item][data-id][data-qty]',
  itemRemove: '[data-ajax-cart-item-remove]',
  cartBadge: '[data-cart-badge]'
};

var classes = {
  bodyCartOpen: 'ajax-cart-open',
  backdrop: 'ajax-cart-backdrop',
  backdropVisible: 'is-visible',
  cartOpen: 'is-open',
  cartBadgeHasItems: 'has-items',
  cartRequestInProgress: 'request-in-progress'
};

var AJAXCart = function () {
  function AJAXCart() {
    _classCallCheck(this, AJAXCart);

    this.name = 'ajaxCart';
    this.namespace = '.' + this.name;
    this.events = {
      RENDER: 'render' + this.namespace,
      DESTROY: 'destroy' + this.namespace,
      SCROLL: 'scroll' + this.namespace,
      UPDATE: 'update' + this.namespace //  Use this as a global event to hook into whenever the cart changes
    };

    var initialized = false;
    var settings = {
      disableAjaxCart: false,
      backdrop: true
    };

    this.$el = $(selectors.container);
    this.$backdrop = null;
    this.stateIsOpen = null;
    this.transitionEndEvent = _utils2.default.whichTransitionEnd();
    this.requestInProgress = false;

    /**
     * Initialize the cart
     *
     * @param {object} options - see `settings` variable above
     */
    this.init = function (options) {
      if (initialized) return;

      this.settings = $.extend(settings, options);

      if (!$(selectors.template).length) {
        console.warn('[' + this.name + '] - Handlebars template required to initialize');
        return;
      }

      this.$container = $(selectors.container);
      this.$cartBadge = $(selectors.cartBadge);
      this.$cartBadgeCount = $(selectors.cartBadgeCount);

      // Compile this once during initialization
      this.template = Handlebars.compile($(selectors.template).html());

      // Add the AJAX part
      if (!this.settings.disableAjaxCart) {
        this._formOverride();
      }

      // Add event handlers here
      $body.on('click', selectors.trigger, this.onTriggerClick.bind(this));
      $body.on('click', selectors.close, this.onCloseClick.bind(this));
      $body.on('click', selectors.itemRemove, this.onItemRemoveClick.bind(this));
      $window.on(this.events.RENDER, this.onCartRender.bind(this));
      $window.on(this.events.DESTROY, this.onCartDestroy.bind(this));

      // Get the cart data when we initialize the instance
      _shopifyAPI2.default.getCart().then(this.buildCart.bind(this));

      initialized = true;

      return initialized;
    };

    return this;
  }

  /**
   * Call this function to AJAX-ify any add to cart forms on the page
   */


  AJAXCart.prototype._formOverride = function _formOverride() {
    var _this = this;

    $body.on('submit', selectors.addForm, function (e) {
      e.preventDefault();

      if (this.requestInProgress) return;

      var $submitButton = $(e.target).find(selectors.addToCart);
      var $submitButtonText = $submitButton.find(selectors.addToCartText);

      // Update the submit button text and disable the button so the user knows the form is being submitted
      $submitButton.prop('disabled', true);
      $submitButtonText.html(theme.strings.adding);

      this._onRequestStart();

      _shopifyAPI2.default.addItemFromForm($(e.target)).then(function (data) {
        _this._onRequestFinish();
        // Reset button state
        $submitButton.prop('disabled', false);
        $submitButtonText.html(theme.strings.addToCart);
        _this.onItemAddSuccess.call(_this, data);
      }).fail(function (data) {
        _this._onRequestFinish();
        // Reset button state
        $submitButton.prop('disabled', false);
        $submitButtonText.html(theme.strings.addToCart);
        _this.onItemAddFail.call(_this, data);
      });
    }.bind(this));
  };

  /**
   * Ensure we are working with a valid number
   *
   * @param {int|string} qty
   * @return {int} - Integer quantity.  Defaults to 1
   */


  AJAXCart.prototype._validateQty = function _validateQty(qty) {
    return parseFloat(qty) == parseInt(qty) && !isNaN(qty) ? qty : 1;
  };

  /**
   * Ensure we are working with a valid number
   *
   * @param {element} el - cart item row or child element
   * @return {obj}
   */


  AJAXCart.prototype._getItemRowAttributes = function _getItemRowAttributes(el) {
    var $el = $(el);
    var $row = $el.is(selectors.item) ? $el : $el.parents(selectors.item);

    return {
      $row: $row,
      id: $row.data('id'),
      line: $row.index() + 1,
      qty: this._validateQty($row.data('qty'))
    };
  };

  AJAXCart.prototype._onRequestStart = function _onRequestStart() {
    this.requestInProgress = true;
    this.$el.addClass(classes.cartRequestInProgress);
  };

  AJAXCart.prototype._onRequestFinish = function _onRequestFinish() {
    this.requestInProgress = false;
    this.$el.removeClass(classes.cartRequestInProgress);
  };

  AJAXCart.prototype.addBackdrop = function addBackdrop(callback) {

    var _this = this;
    var cb = callback || $.noop;

    if (this.stateIsOpen) {
      this.$backdrop = $(document.createElement('div'));

      this.$backdrop.addClass(classes.backdrop).appendTo($body);

      this.$backdrop.one(this.transitionEndEvent, cb);
      this.$backdrop.one('click', this.close.bind(this));

      // debug this...
      setTimeout(function () {
        _this.$backdrop.addClass(classes.backdropVisible);
      }, 10);
    } else {
      cb();
    }
  };

  AJAXCart.prototype.removeBackdrop = function removeBackdrop(callback) {

    var _this = this;
    var cb = callback || $.noop;

    if (!this.stateIsOpen && this.$backdrop) {
      this.$backdrop.one(this.transitionEndEvent, function () {
        _this.$backdrop && _this.$backdrop.remove();
        _this.$backdrop = null;
        cb();
      });

      setTimeout(function () {
        _this.$backdrop.removeClass(classes.backdropVisible);
      }, 10);
    } else {
      cb();
    }
  };

  /**
   * Callback when adding an item is successful
   *
   * @param {Object} cart - JSON representation of the cart.
   */


  AJAXCart.prototype.onItemAddSuccess = function onItemAddSuccess(cart) {
    this.buildCart(cart);
    this.open();
  };

  /**
   * STUB - Callback when adding an item fails
    * @param {Object} data
   * @param {string} data.message - error message
   */


  AJAXCart.prototype.onItemAddFail = function onItemAddFail(data) {
    console.log('[' + this.name + '] - onItemAddFail');
    console.warn('[' + this.name + '] - ' + data.message);
  };

  /**
  * Callback for when the cart HTML is rendered to the page
  * Allows us to add event handlers for events that don't bubble
  */


  AJAXCart.prototype.onCartRender = function onCartRender(e) {}
  // console.log('['+this.name+'] - onCartRender');


  /**
   * Callback for when the cart HTML is removed from the page
   * Allows us to do cleanup on any event handlers applied post-render
   */
  ;

  AJAXCart.prototype.onCartDestroy = function onCartDestroy(e) {}
  // console.log('['+this.name+'] - onCartDestroy');


  /**
   * Builds the HTML for the ajax cart.
   * Modifies the JSON cart for consumption by our handlebars template
   *
   * @param {object} cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
   * @return ??
   */
  ;

  AJAXCart.prototype.buildCart = function buildCart(cart) {

    // All AJAX Cart requests finish with rebuilding the cart
    // So this is a good place to add this code
    this._onRequestFinish();

    // Make adjustments to the cart object contents before we pass it off to the handlebars template
    cart.total_price = _currency2.default.formatMoney(cart.total_price, theme.moneyFormat);
    // cart.total_price = Currency.stripZeroCents(cart.total_price);

    cart.items.map(function (item) {
      item.image = _images2.default.getSizedImageUrl(item.image, '200x');
      item.price = _currency2.default.formatMoney(item.price, theme.moneyFormat);
      // item.price = Currency.stripZeroCents(item.price);

      // Adjust the item's variant options to add "name" and "value" properties
      if (item.hasOwnProperty('product')) {
        var product = item.product;
        for (var i = item.variant_options.length - 1; i >= 0; i--) {
          var name = product.options[i];
          var value = item.variant_options[i];

          item.variant_options[i] = {
            name: name,
            value: value
          };

          // Don't show this info if it's the default variant that Shopify creates
          if (value == "Default Title") {
            delete item.variant_options[i];
          }
        }
      } else {
        delete item.variant_options; // skip it and use the variant title instead
      }

      return item;
    });

    /**
     *  You can also use this as an intermediate step to constructing the AJAX cart DOM
     *  by returning an HTML string and using another function to do the DOM updating
     *
     *  return this.template(cart)
     *
     *  The code below isn't the most elegant way to update the cart but it works...
     */

    $window.trigger(this.events.DESTROY);
    this.$container.empty().append(this.template(cart));
    $window.trigger(this.events.RENDER);
    $window.trigger(this.events.UPDATE);

    this.updateCartCount(cart);
  };

  /**
   * Update the cart badge + count here
   *
   * @param {Object} cart - JSON representation of the cart.
   */


  AJAXCart.prototype.updateCartCount = function updateCartCount(cart) {

    if (cart.item_count) {
      this.$cartBadge.text(cart.item_count + ' ' + (cart.item_count == 1 ? 'Item' : 'Items'));
      this.$cartBadge.addClass(classes.cartBadgeHasItems);
    } else {
      this.$cartBadge.text('');
      this.$cartBadge.removeClass(classes.cartBadgeHasItems);
    }
  };

  /**
   * Remove the item from the cart.  Extract this into a separate method if there becomes more ways to delete an item
   *
   * @param {event} e - Click event
   */


  AJAXCart.prototype.onItemRemoveClick = function onItemRemoveClick(e) {
    e.preventDefault();

    if (this.requestInProgress) return;

    var attrs = this._getItemRowAttributes(e.target);

    this._onRequestStart();
    _shopifyAPI2.default.changeLineItemQuantity(attrs.line, 0).then(_shopifyAPI2.default.getCart).then(this.buildCart.bind(this));
  };

  /**
   * Click the 'ajaxCart - trigger' selector
   *
   * @param {event} e - Click event
   */


  AJAXCart.prototype.onTriggerClick = function onTriggerClick(e) {
    e.preventDefault();
    this.toggleVisibility();
  };

  /**
   * Click the 'ajaxCart - close' selector
   *
   * @param {event} e - Click event
   */


  AJAXCart.prototype.onCloseClick = function onCloseClick(e) {
    e.preventDefault();

    // Do any cleanup before closing the cart
    this.close();
  };

  /**
   * Opens / closes the cart depending on state
   *
   */


  AJAXCart.prototype.toggleVisibility = function toggleVisibility() {
    return this.stateIsOpen ? this.close() : this.open();
  };

  /**
   * Check the open / closed state of the cart
   *
   * @return {bool}
   */


  AJAXCart.prototype.isOpen = function isOpen() {
    return this.stateIsOpen;
  };

  /**
   * Returns true is the cart is closed.
   *
   * @return {bool}
   */


  AJAXCart.prototype.isClosed = function isClosed() {
    return !this.stateIsOpen;
  };

  /**
   * STUB METHOD - Code for opening the cart
   */


  AJAXCart.prototype.open = function open() {
    if (this.stateIsOpen) return;
    this.stateIsOpen = true;

    if (this.settings.backdrop) {
      $body.addClass(classes.bodyCartOpen);
      this.addBackdrop();
    }

    this.$el.addClass(classes.cartOpen);
  };

  /**
   * STUB METHOD - Code for closing the cart
   */


  AJAXCart.prototype.close = function close() {
    if (!this.stateIsOpen) return;

    this.stateIsOpen = false;

    this.$el.removeClass(classes.cartOpen);

    if (this.settings.backdrop) {
      this.removeBackdrop(function () {
        $body.removeClass(classes.bodyCartOpen);
      });
    }
  };

  return AJAXCart;
}();

exports.default = AJAXCart;

},{"./currency":8,"./images":9,"./shopifyAPI":26,"./utils":29}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AJAX MailChimp Library
 * -----------------------------------------------------------------------------
 * Heavily modified version of the original jQuery plugin - https://github.com/scdoshi/jquery-ajaxchimp
 * Handles AJAX form submission and provides hooks for lifecycle events.
 *
 * Usage:
 *
 *   var $form = $('form');
 *   var ajaxForm = new AjaxMailChimpForm($form, {
 *     onInit: function() {
 *       // ...
 *     }
 *   });
 *
 * @namespace ajaxMailChimpForm
 */

var regexes = {
  error: {
    1: /Please enter a value/,
    2: /An email address must contain a single @/,
    3: /The domain portion of the email address is invalid \(the portion after the @: (.+)\)/,
    4: /The username portion of the email address is invalid \(the portion before the @: (.+)\)/,
    5: /This email address looks fake or invalid. Please enter a real email address/,
    6: /.+\#6592.+/,
    7: /(.+@.+) is already subscribed to list (.+)\..+<a href.+/
  }
};

var responses = {
  success: 'Thank you for subscribing!',
  error: {
    1: 'Please enter an email address',
    2: 'There was a problem with your entry. Please check the address and try again.',
    3: 'There was a problem with your entry. Please check the address and try again.',
    4: 'There was a problem with your entry. Please check the address and try again.',
    5: 'There was a problem with your entry. Please check the address and try again.',
    6: 'Too many subscribe attempts for this email address. Please try again in about 5 minutes.',
    7: 'You\'re already subscribed. Thank you!'
  }
};

var AJAXMailchimpForm = function () {

  /**
   * AJAX MailChimp Form Contructor
   *
   * @param {HTMLElement | jQuery} form - Form element
   * @param {Object} options
   * @param {Function} options.onInit
   * @param {Function} options.onDestroy
   * @param {Function} options.onBeforeSend - Prevent AJAX submission by returning false here
   * @param {Function} options.onSubmitFail
   * @param {Function} options.onSubscribeSuccess
   * @param {Function} options.onSubscribeFail
   * @return {self}
   */
  function AJAXMailchimpForm(form) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, AJAXMailchimpForm);

    this.name = 'ajaxMailChimpForm';
    this.namespace = '.' + this.name;
    this.events = {
      SUBMIT: 'submit' + this.namespace
    };

    var _this = this;
    var defaults = {
      onInit: $.noop,
      onDestroy: $.noop,
      onBeforeSend: $.noop,
      onSubmitFail: $.noop,
      onSubscribeSuccess: $.noop,
      onSubscribeFail: $.noop
    };

    if (form.length === 0) {
      return false;
    }

    this.$form = form instanceof jQuery ? form : $(form);
    this.$input = this.$form.find('input[type="email"]');
    this.$submit = this.$form.find('[type="submit"]');
    this.settings = $.extend({}, defaults, options);

    if (this.$input.attr('name') != "EMAIL") {
      console.warn('[' + this.name + '] - Email input *must* have attribute [name="EMAIL"]');
    }

    this.$form.on(this.events.SUBMIT, this.onFormSubmit.bind(_this));

    this.settings.onInit();

    return this;
  }

  AJAXMailchimpForm.prototype.getRegexMatch = function getRegexMatch(string, stringKey) {
    var regexPatterns = regexes[stringKey];
    var matchedId;
    $.each(regexPatterns, function (id, regexPattern) {
      if (string.match(regexPattern) !== null) {
        matchedId = id;
        return false;
      }
    });
    return matchedId;
  };

  AJAXMailchimpForm.prototype.getMessageForResponse = function getMessageForResponse(response) {
    var msg;
    if (response.result === 'success') {
      msg = responses.success;
    } else {
      var index = -1;
      try {
        var parts = response.msg.split(' - ', 2);
        if (parts[1] === undefined) {
          msg = response.msg;
        } else {
          msg = parts[1];
        }
      } catch (e) {
        msg = response.msg;
      }

      // Now that we have the relevant part of the message, lets get the actual string for it
      var regexPattern = regexes.error;
      var matchedId = this.getRegexMatch(msg, 'error');
      if (matchedId && regexPattern[matchedId] && responses.error[matchedId]) {
        return msg.replace(regexPattern[matchedId], responses.error[matchedId]);
      }
    }

    return msg;
  };

  AJAXMailchimpForm.prototype.destroy = function destroy() {
    this.$form.off(this.events.SUBMIT);
    this.settings.onDestroy();
  };

  AJAXMailchimpForm.prototype.onBeforeSend = function onBeforeSend() {
    if (this.settings.onBeforeSend() == false) {
      return false;
    }

    if (this.$input.val() && this.$input.val().length) {
      this.$submit.prop('disabled', true);
      return true;
    }
    // else {
    //   this.$input.parents('.form-group').addClass('alert-info');
    // }
    return false;
  };

  AJAXMailchimpForm.prototype.onSubmitDone = function onSubmitDone(response) {
    var rspMsg = this.getMessageForResponse(response);
    this.$submit.prop('disabled', false);
    response.result === 'success' ? this.settings.onSubscribeSuccess(rspMsg) : this.settings.onSubscribeFail(rspMsg);
  };

  AJAXMailchimpForm.prototype.onSubmitFail = function onSubmitFail(response) {
    this.settings.onSubmitFail();
  };

  AJAXMailchimpForm.prototype.onFormSubmit = function onFormSubmit(e) {
    e.preventDefault();
    var _this = this;
    var $form = this.$form;
    var data = {};
    var dataArray = $form.serializeArray();

    // See - https://github.com/scdoshi/jquery-ajaxchimp/blob/master/jquery.ajaxchimp.js
    $.each(dataArray, function (index, item) {
      data[item.name] = item.value;
    });

    $.ajax({
      url: $form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
      dataType: 'jsonp',
      data: data,
      beforeSend: _this.onBeforeSend.bind(_this)
    }).done(function (response) {
      _this.onSubmitDone(response);
    }).fail(function (response) {
      _this.onSubmitFail(response);
    });

    return false;
  };

  return AJAXMailchimpForm;
}();

exports.default = AJAXMailchimpForm;

},{}],5:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _appRouter = require('./appRouter');

var _appRouter2 = _interopRequireDefault(_appRouter);

var _header = require('./sections/header');

var _header2 = _interopRequireDefault(_header);

var _nav = require('./sections/nav');

var _nav2 = _interopRequireDefault(_nav);

var _footer = require('./sections/footer');

var _footer2 = _interopRequireDefault(_footer);

var _ajaxCart = require('./sections/ajaxCart');

var _ajaxCart2 = _interopRequireDefault(_ajaxCart);

var _mobileMenu = require('./sections/mobileMenu');

var _mobileMenu2 = _interopRequireDefault(_mobileMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($) {

  // Sections Stuff 
  // window.sectionManager = new SectionManager();

  var sections = {};

  sections.header = new _header2.default($('[data-section-type="header"]'));
  sections.nav = new _nav2.default($('[data-section-type="nav"]'));
  sections.footer = new _footer2.default($('[data-section-type="footer"]'));
  sections.ajaxCart = new _ajaxCart2.default($('[data-section-type="ajax-cart"]'));
  sections.mobileMenu = new _mobileMenu2.default($('[data-section-type="mobile-menu"]'));

  var appRouter = new _appRouter2.default({
    onRouteStart: function onRouteStart(url) {
      sections.ajaxCart.ajaxCart.close(); // Run this immediately in case it's open
      sections.mobileMenu.drawer.hide();
    },
    onViewTransitionOutDone: function onViewTransitionOutDone(url) {
      // Update the menu immediately or wait?
      sections.nav.deactivateMenuLinks();
      sections.nav.activateMenuLinkForUrl(url);
    },
    onViewChangeDOMUpdatesComplete: function onViewChangeDOMUpdatesComplete($responseHead, $responseBody) {
      window.scrollTop = 0;

      var title = $responseBody.find('#title').text();
      $('#title').text(title);
    }
  });
  // Misc Stuff

  // Apply UA classes to the document
  _utils2.default.userAgentBodyClass();

  // Apply a specific class to the html element for browser support of cookies.
  if (_utils2.default.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
  // END Misc Stuff

  $(document.body).addClass('is-loaded').removeClass('is-loading');

  // Stop here...no AJAX navigation inside the theme editor
  if (Shopify && Shopify.designMode) {
    return;
  }

  $(document.body).on('click', 'a', function (e) {
    if (e.isDefaultPrevented()) return;

    var url = e.currentTarget.getAttribute('href');

    if (_utils2.default.isExternal(url) || url == '#') return;

    e.preventDefault();
    appRouter.navigate(url);
  });

  return;

  // Prefetching :)
  var linkInteractivityTimeout = false;
  var prefetchCache = {};
  $(document.body).on('mouseenter', 'a', function (e) {
    var url = e.currentTarget.getAttribute('href');
    if (_utils2.default.isExternal(url) || url == '#' || prefetchCache.hasOwnProperty(url)) return;

    var linkInteractivityTimeout = setTimeout(function () {
      $.get(url, function () {
        prefetchCache[url] = true;
        console.log(prefetchCache);
      });
    }, 500);
  });

  $(document.body).on('mouseleave', 'a', function (e) {
    var linkInteractivityTimeout = false;
  });
})(jQuery);

// Sections
// import SectionManager  from './sectionManager';

},{"./appRouter":6,"./sections/ajaxCart":15,"./sections/footer":20,"./sections/header":21,"./sections/mobileMenu":22,"./sections/nav":23,"./utils":29}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('navigo');

var _base = require('./views/base');

var _base2 = _interopRequireDefault(_base);

var _index = require('./views/index');

var _index2 = _interopRequireDefault(_index);

var _product = require('./views/product');

var _product2 = _interopRequireDefault(_product);

var _collection = require('./views/collection');

var _collection2 = _interopRequireDefault(_collection);

var _cart = require('./views/cart');

var _cart2 = _interopRequireDefault(_cart);

var _contact = require('./views/contact');

var _contact2 = _interopRequireDefault(_contact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Views


// TODO - Move the loader and view-container bits to variables that get passed in
var $body = $(document.body);
var $viewContainer = $('#view-container');
var $loader = $('#loader');
var TEMPLATE_REGEX = /(^|\s)template-\S+/g;
var firstRoute = true;

var AppRouter = function () {
  function AppRouter() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AppRouter);

    var defaults = {
      onRouteStart: $.noop,
      onViewTransitionOutDone: $.noop,
      onViewChangeDOMUpdatesComplete: $.noop
    };

    this.viewConstructors = {
      'index': _index2.default,
      'product': _product2.default,
      'collection': _collection2.default,
      'cart': _cart2.default,
      'contact': _contact2.default
    };

    this.router = new Navigo(window.location.origin, false, '#!');
    this.currentView = null;
    this.settings = $.extend({}, defaults, options);

    // Add Routes
    this.router.on('/products/:slug', function (params) {
      _this.doRoute('/products/' + params.slug, 'product');
    });

    // Product within collection
    this.router.on('/collections/:slug/products/:handle', function (params, query) {
      _this.doRoute('/collections/' + params.slug + '/products/' + params.handle, 'product');
    });

    this.router.on('/collections/:slug', function (params, query) {
      var url = '/collections/' + params.slug;
      if (query) {
        url += '?' + query;
      }
      _this.doRoute(url, 'collection');
    });

    this.router.on('/collections', function () {
      _this.doRoute('/collections', 'list-collections');
    });

    this.router.on('/products', function () {
      _this.doRoute('/products', 'list-collections');
    });

    this.router.on('/cart', function (params) {
      _this.doRoute('/cart');
    });

    this.router.on('/pages/:slug', function (params) {
      // @TODO - What to do about this hmmm
      if (params.slug.indexOf('contact') > -1) {
        _this.doRoute('/pages/' + params.slug, 'contact');
      } else {
        _this.doRoute('/pages/' + params.slug, 'page');
      }
    });

    this.router.on('/', function () {
      _this.doRoute('/', 'index');
    });

    this.router.notFound(function (params) {
      // called when there is path specified but
      // there is no route matching
      console.log(params);
    });

    this.router.resolve();
  }

  AppRouter.prototype.doRoute = function doRoute(url, type) {
    var _this2 = this;

    var self = this;
    var viewConstructor = this.viewConstructors[type] || _base2.default;

    if (firstRoute) {
      this.currentView = new viewConstructor($viewContainer);
      firstRoute = false;
      return;
    }

    var transitionDeferred = $.Deferred();
    var ajaxDeferred = $.Deferred();

    // Add a timeout to do a basic redirect to the url if the request takes longer than a few seconds
    var t = setTimeout(function () {
      window.location = url;
    }, 4000);

    $.get(url, function (response) {
      clearTimeout(t);
      ajaxDeferred.resolve(response);
    });

    this.settings.onRouteStart(url);

    // Let the current view do it's 'out' transition and then apply the loading state
    this.currentView.transitionOut(function () {

      _this2.settings.onViewTransitionOutDone(url);

      $loader.addClass('is-visible');
      $loader.on('transitionend', function () {
        transitionDeferred.resolve();
      });
    });

    // Once AJAX *and* css animations are done, trigger the callback
    $.when(ajaxDeferred, transitionDeferred).done(function (response) {
      _this2.doViewChange(response, viewConstructor);
    });
  };

  AppRouter.prototype.doViewChange = function doViewChange(AJAXResponse, viewConstructor) {
    var _this3 = this;

    // Kill the current view
    this.currentView.destroy();

    var $responseHtml = $(document.createElement("html"));

    $responseHtml.get(0).innerHTML = AJAXResponse;

    var $responseHead = $responseHtml.find('head');
    var $responseBody = $responseHtml.find('body');

    var $dom = $responseBody.find('#view-content');

    // Do DOM updates
    document.title = $responseHead.find('title').text();
    $viewContainer.find('#view-content').replaceWith($dom);
    $body.removeClass(function (i, classname) {
      return (classname.match(TEMPLATE_REGEX) || []).join(' ');
    });

    var responseBodyClasses = $responseBody.attr('class').split(' ');
    $body.addClass(function (i, classname) {
      var addClasses = responseBodyClasses.map(function (classname) {
        return classname.match(TEMPLATE_REGEX);
      }).join(' ');

      return addClasses;
    });
    // Finish DOM updates

    this.settings.onViewChangeDOMUpdatesComplete($responseHead, $responseBody);

    this.currentView = new viewConstructor($viewContainer);

    $viewContainer.imagesLoaded(function () {
      $loader.removeClass('is-visible');
      _this3.currentView.transitionIn();
    });
  };

  AppRouter.prototype.navigate = function navigate(url) {
    this.router.navigate(url);
  };

  return AppRouter;
}();

exports.default = AppRouter;

},{"./views/base":30,"./views/cart":31,"./views/collection":32,"./views/contact":33,"./views/index":34,"./views/product":35,"navigo":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $window = $(window);
var cachedWindowWidth = $window.width();

// Match those set in variables.scss
var _breakpointMinWidths = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1480
};

var events = {
  BREAKPOINT_CHANGE: 'breakpointChange'
};

/**
* Get one of the widths stored in the variable defined above
*
* @param {string} key - string matching one of the key names
* @return {int} - pixel width
*/
function getBreakpointMinWidth(key) {
  if (!key) return;

  if (_breakpointMinWidths.hasOwnProperty(key)) {
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

  $.each(_breakpointMinWidths, function (k, bpMinWidth) {
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
  var newWindowWidth = $window.width();

  $.each(_breakpointMinWidths, function (k, bpMinWidth) {
    if (newWindowWidth >= bpMinWidth && cachedWindowWidth < bpMinWidth || cachedWindowWidth >= bpMinWidth && newWindowWidth < bpMinWidth) {

      var bpMinWidthKey = getBreakpointMinWidthKeyForWidth(newWindowWidth);
      var e = $.Event(events.BREAKPOINT_CHANGE, { bpMinWidthKey: bpMinWidthKey });
      $window.trigger(e);
      return false;
    }
  });

  cachedWindowWidth = $window.width();
}

$(function () {
  $window.on('resize', $.throttle(20, onResize));
});

exports.getBreakpointMinWidth = getBreakpointMinWidth;
exports.getBreakpointMinWidthKeyForWidth = getBreakpointMinWidthKeyForWidth;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moneyFormat = '${{amount}}';

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

exports.default = {

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  formatMoney: function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = _utils2.default.defaultTo(precision, 2);
      thousands = _utils2.default.defaultTo(thousands, ',');
      decimal = _utils2.default.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  },


  /**
   * Removes '.00' if found at the end of the string
   *
   * @param  {string} value - formatted price (see above)
   * @return {string} value - formatted value
   */
  stripZeroCents: function stripZeroCents(string) {
    return string.replace(/\.00$/, '');
  }
};

},{"./utils":29}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

exports.default = {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */
  preload: function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  },


  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  loadImage: function loadImage(path) {
    new Image().src = path;
  },


  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  imageSize: function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  },


  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  getSizedImageUrl: function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  },
  removeProtocol: function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _productVariants = require('./productVariants');

var _productVariants2 = _interopRequireDefault(_productVariants);

var _productImageTouchZoomController = require('./productImageTouchZoomController');

var _productImageTouchZoomController2 = _interopRequireDefault(_productImageTouchZoomController);

var _productImageDesktopZoomController = require('./productImageDesktopZoomController');

var _productImageDesktopZoomController2 = _interopRequireDefault(_productImageDesktopZoomController);

var _breakpoints = require('../breakpoints');

var Breakpoints = _interopRequireWildcard(_breakpoints);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _currency = require('../currency');

var _currency2 = _interopRequireDefault(_currency);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var selectors = {
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  originalSelectorId: '[data-product-select]',
  priceWrapper: '[data-price-wrapper]',
  productZoomButton: '[data-zoom-button]',

  galleriesWrapper: '[data-galleries-wrapper]',
  gallery: '[data-gallery]',
  galleryImage: '[data-gallery-image]',

  productJson: '[data-product-json]',
  productPrice: '[data-product-price]',
  singleOptionSelector: '[data-single-option-selector]',
  stickyOptionSelector: '[data-sticky-option-selector]',
  variantOptionValueList: '[data-variant-option-value-list][data-option-position]',
  variantOptionValue: '[data-variant-option-value]'
};

var classes = {
  hide: 'hide',
  variantOptionValueSelected: 'is-selected',
  variantOptionValueDisabled: 'is-disabled',
  variantOptionValueNotHovered: 'is-not-hovered',
  zoomReady: 'is-zoomable',
  zoomedIn: 'is-zoomed',
  galleriesAreReady: 'is-ready',
  galleryActive: 'is-active',
  galleryImageLoaded: 'is-loaded'
};

var $window = $(window);

var ProductDetailForm = function () {

  /**
   * ProductDetailForm constructor
   *
   * @param { Object } config
   * @param { jQuery } config.$el - Main element, see snippets/product-detail-form.liquid
   * @param { jQuery } config.$container - Container to listen to scope events / element to listen to events on.  Defaults to config.$el
   * @param { Boolean } config.enableHistoryState - If set to "true", turns on URL updating when switching variants
   * @param { Function } config.onReady -  Called after the product form is initialized.
   */
  function ProductDetailForm(config) {
    _classCallCheck(this, ProductDetailForm);

    this.settings = {};
    this.name = 'productDetailForm';
    this.namespace = '.' + this.name;

    this.events = {
      RESIZE: 'resize' + this.namespace,
      CHANGE: 'change' + this.namespace,
      CLICK: 'click' + this.namespace,
      READY: 'ready' + this.namespace,
      MOUSEENTER: 'mouseenter' + this.namespace,
      MOUSELEAVE: 'mouseleave' + this.namespace
    };

    var ready = false;
    var defaults = {
      enableHistoryState: true
    };

    this.initialize = function () {
      var _this = this;

      if (ready) {
        return;
      }

      this.stickyMaxWidth = Breakpoints.getBreakpointMinWidth('sm') - 1;
      this.zoomMinWidth = Breakpoints.getBreakpointMinWidth('sm');
      this.transitionEndEvent = _utils2.default.whichTransitionEnd();
      this.settings = $.extend({}, defaults, config);

      if (!this.settings.$el || this.settings.$el == undefined) {
        console.warn('[' + this.name + '] - $el required to initialize');
        return;
      }

      this.$el = this.settings.$el;
      this.$container = this.settings.$container;

      if (!this.$container || this.$container == undefined) {
        this.$container = this.$el;
      }

      // Dom elements we'll need
      // this.$singleOptionSelectors      = $(selectors.singleOptionSelector, this.$container);
      // this.$productGallerySlideshow    = $(selectors.productGallerySlideshow, this.$container);
      // this.$productGalleryCurrentIndex = $(selectors.productGalleryCurrentIndex, this.$container);
      // this.$addToCartBtn               = $(selectors.addToCart, this.$container);
      // this.$addToCartBtnText           = $(selectors.addToCartText, this.$container);
      // this.$priceWrapper               = $(selectors.priceWrapper, this.$container);
      // this.$productPrice               = $(selectors.productPrice, this.$container);
      // this.$comparePrice               = $(selectors.comparePrice, this.$container);
      // this.$comparePriceText           = $(selectors.comparePriceText, this.$container);
      this.$galleriesWrapper = $(selectors.galleriesWrapper, this.$container);
      this.$galleries = $(selectors.gallery, this.$container); // can have multiple
      this.$galleryImages = $(selectors.galleryImage, this.$container);

      this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

      var variantOptions = {
        $container: this.$container,
        enableHistoryState: this.settings.enableHistoryState,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new _productVariants2.default(variantOptions);
      this.productImageTouchZoomController = new _productImageTouchZoomController2.default(this.$container);
      this.productImageDesktopZoomController = new _productImageDesktopZoomController2.default(this.$container);

      // Do images loaded check on the first active gallery
      this.$galleries.filter('.' + classes.galleryActive).find(selectors.galleryImage).first().imagesLoaded(function () {
        _this.$galleriesWrapper.addClass(classes.galleriesAreReady);
      });

      this.$galleryImages.unveil(200, function () {
        var $img = $(this);
        $img.on('load', function () {
          $img.addClass(classes.galleryImageLoaded).removeAttr('data-src');
        });
      });

      // See productVariants
      this.$container.on('variantChange' + this.namespace, this.onVariantChange.bind(this));
      this.$container.on(this.events.CHANGE, selectors.stickyOptionSelector, this.onStickyOptionSelectorChange.bind(this));
      this.$container.on(this.events.CLICK, selectors.variantOptionValue, this.onVariantOptionValueClick.bind(this));
      this.$container.on(this.events.MOUSEENTER, selectors.variantOptionValue, this.onVariantOptionValueMouseenter.bind(this));
      this.$container.on(this.events.MOUSELEAVE, selectors.variantOptionValue, this.onVariantOptionValueMouseleave.bind(this));
      $window.on('resize', $.throttle(50, this.onResize.bind(this)));

      this.onResize();

      var e = $.Event(this.events.READY);
      this.$el.trigger(e);

      ready = true;
    };
  }

  ProductDetailForm.prototype.onVariantChange = function onVariantChange(evt) {
    var variant = evt.variant;

    this.updateProductPrices(variant);
    this.updateAddToCartState(variant);
    this.updateVariantOptionValues(variant);
    this.updateGalleries(variant);

    console.log('TODO - update stickySelect');
  };

  /**
   * Updates the DOM state of the add to cart button
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateAddToCartState = function updateAddToCartState(variant) {

    var $addToCartBtn = $(selectors.addToCart, this.$container);
    var $addToCartBtnText = $(selectors.addToCartText, this.$container);
    var $priceWrapper = $(selectors.priceWrapper, this.$container);

    if (variant) {
      $priceWrapper.removeClass(classes.hide);
    } else {
      $addToCartBtn.prop('disabled', true);
      $addToCartBtnText.html(theme.strings.unavailable);
      $priceWrapper.addClass(classes.hide);
      return;
    }

    if (variant.available) {
      $addToCartBtn.prop('disabled', false);
      $addToCartBtnText.html(theme.strings.addToCart);
    } else {
      $addToCartBtn.prop('disabled', true);
      $addToCartBtnText.html(theme.strings.soldOut);
    }
  };

  /**
   * Updates the DOM with specified prices
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateProductPrices = function updateProductPrices(variant) {
    var $productPrice = $(selectors.productPrice, this.$container);
    var $comparePrice = $(selectors.comparePrice, this.$container);
    var $compareEls = $comparePrice.add($(selectors.comparePriceText, this.$container));

    if (variant) {
      $productPrice.html(_currency2.default.stripZeroCents(_currency2.default.formatMoney(variant.price, theme.moneyFormat)));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(_currency2.default.stripZeroCents(_currency2.default.formatMoney(variant.compare_at_price, theme.moneyFormat)));
        $compareEls.removeClass(classes.hide);
      } else {
        $comparePrice.html('');
        $compareEls.addClass(classes.hide);
      }
    }
  };

  /**
   * Updates the DOM state of the elements matching the variantOption Value selector based on the currently selected variant
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateVariantOptionValues = function updateVariantOptionValues(variant) {
    if (variant) {
      // Loop through all the options and update the option value
      for (var i = 1; i <= 3; i++) {
        var variantOptionValue = variant['option' + i];

        if (!variantOptionValue) break; // Break if the product doesn't have an option at this index

        // Since we are finding the variantOptionValueUI based on the *actual* value, we need to scope to the correct list
        // As some products can have the same values for different variant options (waist + inseam both use "32", "34", etc..)
        var $variantOptionValueList = $(selectors.variantOptionValueList, this.$container).filter('[data-option-position="' + i + '"]');
        var $variantOptionValueUI = $('[data-variant-option-value="' + variantOptionValue + '"]', $variantOptionValueList);

        $variantOptionValueUI.addClass(classes.variantOptionValueSelected);
        $variantOptionValueUI.siblings().removeClass(classes.variantOptionValueSelected);
      }
    }
  };

  /**
   * If there are multiple galleries, look for a gallery matching one of the selected variant's options and switch to that gallery
   *
   * @param {Object} variant - Shopify variant object
   */


  ProductDetailForm.prototype.updateGalleries = function updateGalleries(variant) {
    var _this2 = this;

    if (!variant || this.$galleries.length == 1) return;

    var self = this;
    var $activeGalleries = this.$galleries.filter('.' + classes.galleryActive);

    function getVariantGalleryForOption(option) {
      return self.$galleries.filter(function () {
        return $(this).data('variant-option-gallery') == option;
      });
    }

    var _loop = function _loop() {
      var $vGallery = getVariantGalleryForOption(variant['option' + i]);

      if ($vGallery.length && !$vGallery.hasClass(classes.galleryActive)) {

        // Do the hiding / showing of the correct gallery
        $activeGalleries.first().one(_this2.transitionEndEvent, function () {
          $activeGalleries.css('display', 'none');
          _this2.productImageDesktopZoomController.zoomOut();
          $window.scrollTop(0);
          $vGallery.css('display', 'block');
          void $vGallery.get(0).offsetWidth;
          $vGallery.addClass(classes.galleryActive);
        });

        $activeGalleries.removeClass(classes.galleryActive);
        return 'break';
      }
    };

    for (var i = 3; i >= 1; i--) {
      var _ret = _loop();

      if (_ret === 'break') break;
    }
  };

  /**
   * Handle variant option value click event.
   * Update the associated select tag and update the UI for this value
   *
   * @param {event} evt
   */


  ProductDetailForm.prototype.onVariantOptionValueClick = function onVariantOptionValueClick(e) {
    e.preventDefault();

    var $option = $(e.currentTarget);

    if ($option.hasClass(classes.variantOptionValueSelected) || $option.hasClass(classes.variantOptionValueDisabled) || $option.attr('disabled') != undefined) {
      return;
    }

    var value = $option.data('variant-option-value');
    var position = $option.parents(selectors.variantOptionValueList).data('option-position');
    var $selector = $(selectors.singleOptionSelector, this.$container).filter('[data-index="option' + position + '"]');

    $selector.val(value);
    $selector.trigger('change');

    $option.addClass(classes.variantOptionValueSelected);
    $option.siblings().removeClass(classes.variantOptionValueSelected);
  };

  ProductDetailForm.prototype.onStickyOptionSelectorChange = function onStickyOptionSelectorChange(e) {
    e.preventDefault();

    // console.log('change');

    var $stickySelect = $(e.currentTarget);
    var value = $stickySelect.val();
    var position = $stickySelect.data('option-position');
    var $selector = $(selectors.singleOptionSelector, this.$container).filter('[data-index="option' + position + '"]');

    // console.log(value);

    // TODO - Clean this up
    var $placeholder = $stickySelect.siblings('.sticky-select-placeholder');
    $placeholder.find('.sticky-select-placeholder-text').text(value);
    $placeholder.find('.sticky-select-label').css('display', value ? 'inline-block' : 'none');

    $selector.val(value);
    $selector.trigger('change');
  };

  ProductDetailForm.prototype.onVariantOptionValueMouseenter = function onVariantOptionValueMouseenter(e) {
    var $option = $(e.currentTarget);
    var $list = $option.parents(selectors.variantOptionValueList);

    if ($option.hasClass(classes.variantOptionValueDisabled) || $option.attr('disabled') != undefined) return;

    $list.find(selectors.variantOptionValue).not($option).addClass(classes.variantOptionValueNotHovered);
  };

  ProductDetailForm.prototype.onVariantOptionValueMouseleave = function onVariantOptionValueMouseleave(e) {
    console.log('leave');
    var $option = $(e.currentTarget);
    var $list = $option.parents(selectors.variantOptionValueList);
    $list.find(selectors.variantOptionValue).removeClass(classes.variantOptionValueNotHovered);
  };

  ProductDetailForm.prototype.onResize = function onResize(e) {
    if (window.innerWidth >= this.zoomMinWidth) {
      this.productImageTouchZoomController.disable();
      this.productImageDesktopZoomController.enable();
    } else {
      if (Modernizr && Modernizr.touchevents) {
        this.productImageTouchZoomController.enable();
      }
    }

    if (window.innerWidth < this.stickyMaxWidth) {
      $('.product-detail-form').css('margin-bottom', $('.sticky-form').outerHeight());
    } else {
      $('.product-detail-form').css('margin-bottom', '');
    }
  };

  return ProductDetailForm;
}();

exports.default = ProductDetailForm;

},{"../breakpoints":7,"../currency":8,"../utils":29,"./productImageDesktopZoomController":11,"./productImageTouchZoomController":12,"./productVariants":13}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var selectors = {
  gallery: '[data-gallery]',
  galleryImage: '[data-gallery-image]'
};

var classes = {
  isZoomed: 'is-zoomed'
};

var $window = $(window);
var $body = $(document.body);

var ProductImageDesktopZoomController = function () {

  /**
   * ProductImageDesktopZoomController
   *
   * @constructor
   * @param {jQuery} $el - element containing all required elements
   */
  function ProductImageDesktopZoomController($el) {
    _classCallCheck(this, ProductImageDesktopZoomController);

    this.name = 'productImageDesktopZoomController';
    this.namespace = '.' + this.name;

    this.events = {
      CLICK: 'click' + this.namespace
    };

    this.enabled = false;
    this.isZoomed = false;

    this.$container = $el;

    if (!$el) {
      console.warn('[' + this.name + '] - $el required to initialize');
      return;
    }

    this.$gallery = $(selectors.gallery, this.$container);
    this.$galleryImages = $(selectors.galleryImage, this.$container);

    this.setCursors('in');
  }

  ProductImageDesktopZoomController.prototype.enable = function enable() {
    if (this.enabled) return;

    this.$galleryImages.on(this.events.CLICK, this.onGalleryImageClick.bind(this));
    this.setCursors('in');

    this.enabled = true;
  };

  ProductImageDesktopZoomController.prototype.disable = function disable() {
    if (!this.enabled) return;

    this.$galleryImages.off(this.events.CLICK, this.onGalleryImageClick.bind(this));
    this.setCursors();

    this.enabled = false;
  };

  ProductImageDesktopZoomController.prototype.zoomIn = function zoomIn(src) {
    if (this.isZoomed) return;

    this.$gallery.addClass(classes.isZoomed);
    this.setCursors('out');
    this.isZoomed = true;
  };

  ProductImageDesktopZoomController.prototype.zoomOut = function zoomOut() {
    if (!this.isZoomed) return;

    this.$gallery.removeClass(classes.isZoomed);
    this.setCursors('in');
    this.isZoomed = false;
  };

  ProductImageDesktopZoomController.prototype.setCursors = function setCursors(type) {
    var $images = this.$gallery.find('img');
    if (type == 'in') {
      $images.css('cursor', 'zoom-in');
    } else if (type == 'out') {
      $images.css('cursor', 'zoom-out');
    } else {
      $images.css('cursor', '');
    }
  };

  ProductImageDesktopZoomController.prototype.onGalleryImageClick = function onGalleryImageClick(e) {
    e.preventDefault();
    console.log(e);
    this.isZoomed ? this.zoomOut() : this.zoomIn();
  };

  return ProductImageDesktopZoomController;
}();

exports.default = ProductImageDesktopZoomController;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iscrollZoom = require('../../../node_modules/iscroll/build/iscroll-zoom');

var _iscrollZoom2 = _interopRequireDefault(_iscrollZoom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var selectors = {
  galleryImage: '[data-gallery-image]',
  blowup: '[data-blowup]',
  blowupScroll: '[data-blowup-scroll]',
  blowupImage: '[data-blowup-image]'
};

var classes = {
  bodyBlowupOpen: 'blowup-open',
  blowupActive: 'is-active'
};

var $window = $(window);
var $body = $(document.body);

var ProductImageTouchZoomController = function () {

  /**
   * ProductImageTouchZoomController
   *
   * @constructor
   * @param {jQuery} $el - element containing all required elements
   */
  function ProductImageTouchZoomController($el) {
    _classCallCheck(this, ProductImageTouchZoomController);

    this.name = 'productImageTouchZoomController';
    this.namespace = '.' + this.name;

    this.events = {
      CLICK: 'click' + this.namespace
    };

    this.enabled = false;
    this.isZoomed = false;
    this.iscrollInstance = undefined;

    this.$container = $el;

    if (!$el) {
      console.warn('[' + this.name + '] - $el required to initialize');
      return;
    }

    this.$blowup = $(selectors.blowup, this.$container);
    this.$blowupScroll = $(selectors.blowupScroll, this.$container);
    this.$blowupImage = $(selectors.blowupImage, this.$container);
  }

  ProductImageTouchZoomController.prototype.enable = function enable() {
    if (this.enabled) return;

    this.$container.on(this.events.CLICK, selectors.galleryImage, this.onGalleryImageClick.bind(this));
    this.$container.on(this.events.CLICK, selectors.blowup, this.zoomOut.bind(this));

    this.enabled = true;
  };

  ProductImageTouchZoomController.prototype.disable = function disable() {
    if (!this.enabled) return;

    this.$container.off(this.events.CLICK);

    this.enabled = false;
  };

  ProductImageTouchZoomController.prototype.zoomIn = function zoomIn(src) {
    if (this.isZoomed) return;

    // var $zoomImg  = $(new Image());
    var startZoom = 1.2;

    this.iscrollInstance = new _iscrollZoom2.default(this.$blowupScroll.get(0), {
      zoom: true,
      hideScrollbar: true,
      scrollX: true,
      scrollY: true,
      zoomMin: 1,
      zoomMax: 2,
      startZoom: startZoom,
      directionLockThreshold: 20,
      tap: true,
      click: true
    });

    this.$blowupImage.on('load', function () {
      var x = -1 * ((this.$blowupImage.outerWidth() * startZoom - $window.width()) / 2);
      var y = -1 * ((this.$blowupImage.outerHeight() * startZoom - $window.height()) / 2);
      this.iscrollInstance.scrollTo(x, y, 0);
    }.bind(this));

    // Set the smaller image immediately (it should already be loaded from the slideshow)
    this.$blowupImage.attr('src', src);

    // if(zoomSrc) {
    //   $zoomImg.on('load', function() {
    //     this.$blowupImage.attr('src', zoomSrc);
    //   }.bind(this));
    //   $zoomImg.attr('src', zoomSrc);
    // }

    this.$blowup.addClass(classes.blowupActive);
    $body.addClass(classes.bodyBlowupOpen);
    this.isZoomed = true;
  };

  ProductImageTouchZoomController.prototype.zoomOut = function zoomOut() {
    if (!this.isZoomed) return;

    if (this.iscrollInstance instanceof _iscrollZoom2.default) {
      this.iscrollInstance.destroy();
    }

    $body.removeClass(classes.bodyBlowupOpen);
    this.$blowup.removeClass(classes.blowupActive);
    this.$blowupImage.attr('src', '');
    this.isZoomed = false;
  };

  ProductImageTouchZoomController.prototype.onGalleryImageClick = function onGalleryImageClick(e) {
    e.preventDefault();
    this.zoomIn($(e.currentTarget).attr('src'));
  };

  return ProductImageTouchZoomController;
}();

exports.default = ProductImageTouchZoomController;

},{"../../../node_modules/iscroll/build/iscroll-zoom":1}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Product Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 */

var ProductVariants = function () {
  function ProductVariants(options) {
    _classCallCheck(this, ProductVariants);

    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  /**
   * Get the currently selected options from add-to-cart form. Works with all
   * form input elements.
   *
   * @return {array} options - Values of currently selected variants
   */


  ProductVariants.prototype._getCurrentOptions = function _getCurrentOptions() {
    var currentOptions = $.map($(this.singleOptionSelector, this.$container), function (element) {
      var $element = $(element);
      var type = $element.attr('type');
      var currentOption = {};

      if (type === 'radio' || type === 'checkbox') {
        if ($element[0].checked) {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        } else {
          return false;
        }
      } else {
        currentOption.value = $element.val();
        currentOption.index = $element.data('index');

        return currentOption;
      }
    });

    // remove any unchecked input values if using radio buttons or checkboxes
    currentOptions = _utils2.default.compact(currentOptions);

    return currentOptions;
  };

  /**
   * Find variant based on selected values.
   *
   * @param  {array} selectedValues - Values of variant inputs
   * @return {object || undefined} found - Variant object from product.variants
   */


  ProductVariants.prototype._getVariantFromOptions = function _getVariantFromOptions() {
    var selectedValues = this._getCurrentOptions();
    var variants = this.product.variants;
    var found = false;

    variants.forEach(function (variant) {
      var satisfied = true;

      selectedValues.forEach(function (option) {
        if (satisfied) {
          satisfied = option.value === variant[option.index];
        }
      });

      if (satisfied) {
        found = variant;
      }
    });

    return found || null;
  };

  /**
   * Event handler for when a variant input changes.
   */


  ProductVariants.prototype._onSelectChange = function _onSelectChange() {
    var variant = this._getVariantFromOptions();

    this.$container.trigger({
      type: 'variantChange',
      variant: variant
    });

    if (!variant) {
      return;
    }

    this._updateMasterSelect(variant);
    this._updateImages(variant);
    this._updatePrice(variant);
    this.currentVariant = variant;

    if (this.enableHistoryState) {
      this._updateHistoryState(variant);
    }
  };

  /**
   * Trigger event when variant image changes
   *
   * @param  {object} variant - Currently selected variant
   * @return {event}  variantImageChange
   */


  ProductVariants.prototype._updateImages = function _updateImages(variant) {
    var variantImage = variant.featured_image || {};
    var currentVariantImage = this.currentVariant.featured_image || {};

    if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
      return;
    }

    this.$container.trigger({
      type: 'variantImageChange',
      variant: variant
    });
  };

  /**
   * Trigger event when variant price changes.
   *
   * @param  {object} variant - Currently selected variant
   * @return {event} variantPriceChange
   */


  ProductVariants.prototype._updatePrice = function _updatePrice(variant) {
    if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
      return;
    }

    this.$container.trigger({
      type: 'variantPriceChange',
      variant: variant
    });
  };

  /**
   * Update history state for product deeplinking
   *
   * @param  {variant} variant - Currently selected variant
   * @return {k}         [description]
   */


  ProductVariants.prototype._updateHistoryState = function _updateHistoryState(variant) {
    if (!history.replaceState || !variant) {
      return;
    }

    var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
    window.history.replaceState({ path: newurl }, '', newurl);
  };

  /**
   * Update hidden master select of variant change
   *
   * @param  {variant} variant - Currently selected variant
   */


  ProductVariants.prototype._updateMasterSelect = function _updateMasterSelect(variant) {
    $(this.originalSelectorId, this.$container)[0].value = variant.id;
  };

  return ProductVariants;
}();

exports.default = ProductVariants;

},{"../utils":29}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _test = require('./sections/test');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  test: _test2.default
};

},{"./sections/test":25}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _ajaxCart = require('../ajaxCart');

var _ajaxCart2 = _interopRequireDefault(_ajaxCart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

/**
 * Ajax Cart Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the interacting with the ajax cart section.
 * All logic is handled in AjaxCart, this file is strictly for handling section settings and them editor interactions
 *
 * @namespace - ajaxCart
 */

var $body = $(document.body);

var AJAXCartSection = function (_BaseSection) {
  _inherits(AJAXCartSection, _BaseSection);

  function AJAXCartSection(container) {
    _classCallCheck(this, AJAXCartSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'ajaxCart';
    _this.namespace = '.' + _this.name;

    _this.ajaxCart = new _ajaxCart2.default();

    _this.ajaxCart.init();
    return _this;
  }

  AJAXCartSection.prototype.onSelect = function onSelect(e) {
    console.log('on select inside AJAXCart');
    this.ajaxCart.open();
  };

  AJAXCartSection.prototype.onDeselect = function onDeselect(e) {
    this.ajaxCart.close();
  };

  AJAXCartSection.prototype.onUnload = function onUnload(e) {
    this.ajaxCart.$backdrop && this.ajaxCart.$backdrop.remove();
  };

  return AJAXCartSection;
}(_base2.default);

exports.default = AJAXCartSection;

},{"../ajaxCart":3,"./base":16}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var shopifyEvents = ['shopify:section:unload', 'shopify:section:select', 'shopify:section:deselect', 'shopify:section:reorder', 'shopify:block:select', 'shopify:block:deselect'];

var BaseSection = function () {
  function BaseSection(container) {
    _classCallCheck(this, BaseSection);

    this.$container = container instanceof $ ? container : $(container);
    this.id = this.$container.data('section-id');
    this.type = this.$container.data('section-type');

    $(document).on(shopifyEvents.join(' '), this.onShopifyEvent.bind(this));
  }

  BaseSection.prototype.onShopifyEvent = function onShopifyEvent(e) {
    if (e.detail.sectionId != this.id.toString()) {
      return;
    }

    switch (e.type) {
      case 'shopify:section:unload':
        this.onUnload(e);
        break;
      case 'shopify:section:select':
        this.onSelect(e);
        break;
      case 'shopify:section:deselect':
        this.onDeselect(e);
        break;
      case 'shopify:section:reorder':
        this.onReorder(e);
        break;
      case 'shopify:block:select':
        this.onBlockSelect(e);
        break;
      case 'shopify:block:deselect':
        this.onBlockDeselect(e);
        break;
    }
  };

  BaseSection.prototype.onUnload = function onUnload(e) {
    console.log('[BaseSection] - removing event listeners - onSectionUnload');
    $(document).off(shopifyEvents.join(' '), this.onShopifyEvent.bind(this));
  };

  BaseSection.prototype.onSelect = function onSelect(e) {
    console.log('onselect in base section');
  };

  BaseSection.prototype.onDeselect = function onDeselect(e) {};

  BaseSection.prototype.onReorder = function onReorder(e) {};

  BaseSection.prototype.onBlockSelect = function onBlockSelect(e) {};

  BaseSection.prototype.onBlockDeselect = function onBlockDeselect(e) {};

  return BaseSection;
}();

exports.default = BaseSection;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  form: '[data-cart-form]',
  itemQtySelect: '[data-item-quantity-select]'
};

var classes = {};

var CartSection = function (_BaseSection) {
  _inherits(CartSection, _BaseSection);

  function CartSection(container) {
    _classCallCheck(this, CartSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'cart';
    _this.namespace = '.' + _this.name;

    var $form = $(selectors.form, _this.$container);

    // Since we have more than 1 quantity select per row (1 for mobile, 1 for desktop)
    // We need to use single input per row, which is responsible for sending the form data for that line item
    // Watch for changes on the quantity selects, and then update the input.  These two are tied together using a data attribute
    _this.$container.on('change', selectors.itemQtySelect, function () {
      var $itemQtyInput = $('[id="' + $(this).data('item-quantity-select') + '"]'); // Have to do '[id=".."]' instead of '#id' because id is generated using {{ item.key }} which has semi-colons in it - breaks normal id select
      $itemQtyInput.val($(this).val());
      $form.submit();
    });
    return _this;
  }

  return CartSection;
}(_base2.default);

exports.default = CartSection;

},{"./base":16}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var CollectionSection = function (_BaseSection) {
  _inherits(CollectionSection, _BaseSection);

  function CollectionSection(container) {
    _classCallCheck(this, CollectionSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'collection';
    _this.namespace = '.' + _this.name;
    console.log('constructing collection view');
    return _this;
  }

  return CollectionSection;
}(_base2.default);

exports.default = CollectionSection;

},{"./base":16}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require("./base");

var _base2 = _interopRequireDefault(_base);

var _contactForm = require("../uiComponents/contactForm");

var _contactForm2 = _interopRequireDefault(_contactForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  form: 'form#contact_form'
};

var classes = {};

var ContactSection = function (_BaseSection) {
  _inherits(ContactSection, _BaseSection);

  function ContactSection(container) {
    _classCallCheck(this, ContactSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'cart';
    _this.namespace = "." + _this.name;

    _this.form = new _contactForm2.default($(selectors.form, _this.$container).first());
    return _this;
  }

  return ContactSection;
}(_base2.default);

exports.default = ContactSection;

},{"../uiComponents/contactForm":27,"./base":16}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require("./base");

var _base2 = _interopRequireDefault(_base);

var _ajaxMailchimpForm = require("../ajaxMailchimpForm");

var _ajaxMailchimpForm2 = _interopRequireDefault(_ajaxMailchimpForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {};

var FooterSection = function (_BaseSection) {
  _inherits(FooterSection, _BaseSection);

  function FooterSection(container) {
    _classCallCheck(this, FooterSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'footer';
    _this.namespace = "." + _this.name;
    _this.$subscribeForm = _this.$container.find('form');

    _this.AJAXMailchimpForm = new _ajaxMailchimpForm2.default(_this.$subscribeForm, {
      onInit: function onInit() {
        // console.log('init footer subscribe!');
      },
      onSubscribeFail: function onSubscribeFail(msg) {
        console.log('subscribed fail - ' + msg);
      },
      onSubscribeSuccess: function onSubscribeSuccess() {
        console.log('subscribed successfully');
      }
    });
    return _this;
  }

  return FooterSection;
}(_base2.default);

exports.default = FooterSection;

},{"../ajaxMailchimpForm":4,"./base":16}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  header: '[data-header]'
};

var classes = {};

var HeaderSection = function (_BaseSection) {
  _inherits(HeaderSection, _BaseSection);

  function HeaderSection(container) {
    _classCallCheck(this, HeaderSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.$el = $(selectors.header, _this.$container);
    _this.name = 'header';
    _this.namespace = '.' + _this.name;
    return _this;
  }

  return HeaderSection;
}(_base2.default);

exports.default = HeaderSection;

},{"./base":16}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require("./base");

var _base2 = _interopRequireDefault(_base);

var _drawer = require("../uiComponents/drawer");

var _drawer2 = _interopRequireDefault(_drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  toggle: '[data-mobile-menu-toggle]',
  menu: '[data-mobile-menu]'
};

var classes = {
  toggleActive: 'is-active'
};

var MobileMenuSection = function (_BaseSection) {
  _inherits(MobileMenuSection, _BaseSection);

  function MobileMenuSection(container) {
    _classCallCheck(this, MobileMenuSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'mobileMenu';
    _this.namespace = "." + _this.name;

    _this.$el = $(selectors.menu, _this.$container);
    _this.$toggle = $(selectors.toggle); // Don't scope to this.$container

    _this.drawer = new _drawer2.default(_this.$el);

    _this.$toggle.on('click', _this.onToggleClick.bind(_this));
    _this.$el.on('click', 'a', function (e) {
      if (!e.isDefaultPrevented()) {
        _this.drawer.hide();
      }
    });
    _this.$el.on('show.drawer', function () {
      _this.$toggle.addClass(classes.toggleActive);
    });
    _this.$el.on('hide.drawer', function () {
      _this.$toggle.removeClass(classes.toggleActive);
    });

    $(window).on('resize', _this.onResize.bind(_this));
    return _this;
  }

  MobileMenuSection.prototype.onToggleClick = function onToggleClick(e) {
    e.preventDefault();
    this.drawer.toggle();
  };

  MobileMenuSection.prototype.onResize = function onResize(e) {
    // @TODO - Turn breakpoints into es6 file
    if (window.innerWidth >= 576) {
      this.drawer.hide();
    }
  };

  /**
   * Theme Editor section events below
   */


  MobileMenuSection.prototype.onSelect = function onSelect() {
    this.drawer.show();
  };

  MobileMenuSection.prototype.onDeselect = function onDeselect() {
    this.drawer.hide();
  };

  MobileMenuSection.prototype.onUnload = function onUnload() {
    this.drawer.$backdrop && this.drawer.$backdrop.remove();
  };

  return MobileMenuSection;
}(_base2.default);

exports.default = MobileMenuSection;

},{"../uiComponents/drawer":28,"./base":16}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  mainMenu: '.main-menu',
  menuLink: '[data-menu-link]',
  submenu: '[data-submenu]',
  submenuTrigger: 'a[data-submenu-trigger]'
};

var classes = {
  menuLinkActive: 'is-active',
  menuLinkNotHovered: 'is-not-hovered',
  submenuActive: 'is-active'
};

var NavSection = function (_BaseSection) {
  _inherits(NavSection, _BaseSection);

  function NavSection(container) {
    _classCallCheck(this, NavSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.$menu = $(selectors.mainMenu, _this.$container);
    _this.$menuLinks = $(selectors.menuLink, _this.$container);
    _this.$submenuTriggers = $(selectors.submenuTrigger, _this.$container);
    _this.$submenus = $(selectors.submenu, _this.$container);

    if (Modernizr && Modernizr.touchevents) {
      _this.$menu.on('click', selectors.submenuTrigger, _this.onSubmenuTriggerClick.bind(_this));
    } else {
      _this.$menuLinks.on('mouseenter', _this.onMenuLinkMouseenter.bind(_this));
      _this.$menu.on('mouseleave', _this.onMenuMouseleave.bind(_this));
    }
    return _this;
  }

  NavSection.prototype.activateMenuLinkForUrl = function activateMenuLinkForUrl(url) {
    this.$menu.find('a').each(function (i, el) {
      var $el = $(el);
      var href = $el.attr('href');
      if (href == url || url.indexOf(href) > -1) {
        $el.addClass(classes.menuLinkActive);
      }
    });
  };

  NavSection.prototype.deactivateMenuLinks = function deactivateMenuLinks() {
    this.$menu.find('.' + classes.menuLinkActive).removeClass(classes.menuLinkActive);
  };

  NavSection.prototype.activateSubmenu = function activateSubmenu(id) {
    this.$submenus.filter('#' + id).addClass(classes.submenuActive);
  };

  NavSection.prototype.onSubmenuTriggerClick = function onSubmenuTriggerClick(e) {
    e.preventDefault();
    // is active ? deactive : activate
    this.$submenus.filter('#' + $(e.currentTarget).data('submenu-trigger')).toggleClass(classes.submenuActive);
  };

  NavSection.prototype.onMenuMouseleave = function onMenuMouseleave(e) {
    this.$submenus.removeClass('is-active');
    this.$menuLinks.removeClass(classes.menuLinkNotHovered);
  };

  NavSection.prototype.onMenuLinkMouseenter = function onMenuLinkMouseenter(e) {
    var $link = $(e.currentTarget);
    this.$submenus.removeClass(classes.submenuActive);
    if ($link.is(selectors.submenuTrigger)) {
      this.activateSubmenu($link.data('submenu-trigger'));
    }
    this.$menuLinks.removeClass(classes.menuLinkNotHovered);
    this.$menuLinks.not($link).addClass(classes.menuLinkNotHovered);
    // store the active submenu in a variable so we can check if the trigger is for that menu
  };

  return NavSection;
}(_base2.default);

exports.default = NavSection;

},{"./base":16}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _productDetailForm = require('../product/productDetailForm');

var _productDetailForm2 = _interopRequireDefault(_productDetailForm);

var _drawer = require('../uiComponents/drawer');

var _drawer2 = _interopRequireDefault(_drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var selectors = {
  sizeGuideDrawer: '[data-size-guide-drawer]',
  sizeGuideShow: '[data-size-guide-show]'
};

var ProductSection = function (_BaseSection) {
  _inherits(ProductSection, _BaseSection);

  function ProductSection(container) {
    _classCallCheck(this, ProductSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'product';
    _this.namespace = '.' + _this.name;

    _this.productDetailForm = new _productDetailForm2.default({
      $el: _this.$container,
      $container: _this.$container,
      enableHistoryState: false
    });

    _this.productDetailForm.initialize();

    _this.$sizeGuideDrawerEl = $(selectors.sizeGuideDrawer, _this.$container);

    if (_this.$sizeGuideDrawerEl.length) {
      _this.drawer = new _drawer2.default(_this.$sizeGuideDrawerEl);

      _this.$container.on('click', selectors.sizeGuideShow, function (e) {
        e.preventDefault();
        _this.drawer.show();
      });
    }
    return _this;
  }

  ProductSection.prototype.onSelect = function onSelect(e) {
    console.log('on select in product section');
  };

  return ProductSection;
}(_base2.default);

exports.default = ProductSection;

},{"../product/productDetailForm":10,"../uiComponents/drawer":28,"./base":16}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require("./base");

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var TestSection = function (_BaseSection) {
  _inherits(TestSection, _BaseSection);

  function TestSection(container) {
    _classCallCheck(this, TestSection);

    var _this = _possibleConstructorReturn(this, _BaseSection.call(this, container));

    _this.name = 'test';
    _this.namespace = "." + _this.name;

    _this.$container.append(new Date());

    return _this;
  }

  return TestSection;
}(_base2.default);

exports.default = TestSection;

},{"./base":16}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  /**
   * AJAX submit an 'add to cart' form
   *
   * @param {jQuery} $form - jQuery instance of the form
   * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
   */
  addItemFromForm: function addItemFromForm($form) {
    var promise = $.Deferred();
    var self = this;

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/add.js',
      data: $form.serialize(),
      success: function success() {
        self.getCart().then(function (data) {
          promise.resolve(data);
        });
      },
      error: function error() {
        promise.reject({
          message: 'The quantity you entered is not available.'
        });
      }
    });

    return promise;
  },


  /**
   * Retrieve a JSON respresentation of the users cart
   *
   * @return {Promise} - JSON cart
   */
  getCart: function getCart() {
    var promise = $.Deferred();
    var url = '/cart?view=json';

    if (Shopify && Shopify.designMode) {
      url = '/cart.js';
    }

    $.ajax({
      type: 'get',
      url: url,
      success: function success(data) {
        var cart = JSON.parse(data);
        promise.resolve(cart);
      },
      error: function error() {
        promise.reject({
          message: 'Could not retrieve cart items'
        });
      }
    });

    return promise;
  },


  /**
   * Retrieve a JSON respresentation of the users cart
   *
   * @return {Promise} - JSON cart
   */
  getProduct: function getProduct(handle) {
    return $.getJSON('/products/' + handle + '.js');
  },


  /**
   * Change the quantity of an item in the users cart
   *
   * @param {int} line - Cart line
   * @param {int} qty - New quantity of the variant
   * @return {Promise} - JSON cart
   */
  changeLineItemQuantity: function changeLineItemQuantity(line, qty) {
    return $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/change.js',
      data: 'quantity=' + qty + '&line=' + line
    });
  }
};

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var selectors = {
  form: 'form#contact_form',
  inputEmail: '[data-input-email]',
  inputMessage: '[data-input-message]'
};

var ContactForm = function () {
  function ContactForm(form) {
    _classCallCheck(this, ContactForm);

    this.$form = $(form);

    if (!this.$form.is(selectors.form)) {
      console.warn('Valis form element required to initialize');
      return;
    }

    this.$inputEmail = this.$form.find(selectors.inputEmail);
    this.$inputMessage = this.$form.find(selectors.inputMessage);

    this.$form.on('submit', this.onSubmit.bind(this));
  }

  ContactForm.prototype.onSubmit = function onSubmit(e) {
    e.preventDefault();

    if (this.$inputMessage.val().length == 0) {
      console.log('Please enter a message');
      return false;
    }

    if (this.$inputEmail.val().length == 0) {
      console.log('Please enter an email address');
      return false;
    }

    var url = this.$form.attr('action');
    var data = this.$form.serialize();

    $.ajax({
      type: "POST",
      url: url,
      data: data
    }).done(function (AJAXResponse) {
      var $responseHtml = $(document.createElement("html"));

      $responseHtml.get(0).innerHTML = AJAXResponse;

      var $responseHead = $responseHtml.find('head');
      var $responseBody = $responseHtml.find('body');
      var $form = $responseBody.find(selectors.form);

      console.log($form);
    }).fail(function () {
      console.log('something went wrong, try again later');
    });
  };

  return ContactForm;
}();

exports.default = ContactForm;

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $document = $(document);
var $body = $(document.body);

var selectors = {
  close: '[data-drawer-close]'
};

var classes = {
  drawer: 'drawer',
  visible: 'is-visible',
  backdrop: 'drawer-backdrop',
  backdropVisible: 'is-visible',
  bodyDrawerOpen: 'drawer-open'
};

var Drawer = function () {

  /**
   * Drawer constructor
   *
   * @param {HTMLElement | $} el - The drawer element
   * @param {Object} options
   */
  function Drawer(el, options) {
    _classCallCheck(this, Drawer);

    this.name = 'drawer';
    this.namespace = '.' + this.name;

    this.$el = $(el);
    this.$backdrop = null;
    this.stateIsOpen = false;
    this.transitionEndEvent = _utils2.default.whichTransitionEnd();
    this.supportsCssTransitions = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;

    if (this.$el == undefined || !this.$el.hasClass(classes.drawer)) {
      console.warn('[' + this.name + '] - Element with class `' + classes.drawer + '` required to initialize.');
      return;
    }

    var defaults = {
      closeSelector: selectors.close,
      backdrop: true
    };

    this.settings = $.extend({}, defaults, options);

    this.events = {
      HIDE: 'hide' + this.namespace,
      HIDDEN: 'hidden' + this.namespace,
      SHOW: 'show' + this.namespace,
      SHOWN: 'shown' + this.namespace
    };

    this.$el.on('click', this.settings.closeSelector, this.onCloseClick.bind(this));
  }

  Drawer.prototype.addBackdrop = function addBackdrop(callback) {
    var _this = this;
    var cb = callback || $.noop;

    if (this.stateIsOpen) {
      this.$backdrop = $(document.createElement('div'));

      this.$backdrop.addClass(classes.backdrop).appendTo($body);

      this.$backdrop.one(this.transitionEndEvent, cb);
      this.$backdrop.one('click', this.hide.bind(this));

      // debug this...
      setTimeout(function () {
        $body.addClass(classes.bodyDrawerOpen);
        _this.$backdrop.addClass(classes.backdropVisible);
      }, 10);
    } else {
      cb();
    }
  };

  Drawer.prototype.removeBackdrop = function removeBackdrop(callback) {
    var _this = this;
    var cb = callback || $.noop;

    if (this.$backdrop) {
      this.$backdrop.one(this.transitionEndEvent, function () {
        _this.$backdrop && _this.$backdrop.remove();
        _this.$backdrop = null;
        cb();
      });

      setTimeout(function () {
        _this.$backdrop.removeClass(classes.backdropVisible);
        $body.removeClass(classes.bodyDrawerOpen);
      }, 10);
    } else {
      cb();
    }
  };

  /**
   * Called after the closing animation has run
   */


  Drawer.prototype.onHidden = function onHidden() {
    this.stateIsOpen = false;
    var e = $.Event(this.events.HIDDEN);
    this.$el.trigger(e);
  };

  /**
   * Called after the opening animation has run
   */


  Drawer.prototype.onShown = function onShown() {
    var e = $.Event(this.events.SHOWN);
    this.$el.trigger(e);
  };

  Drawer.prototype.hide = function hide() {
    var e = $.Event(this.events.HIDE);
    this.$el.trigger(e);

    if (!this.stateIsOpen) return;

    this.$el.removeClass(classes.visible);

    if (this.settings.backdrop) {
      this.removeBackdrop();
    }

    if (this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onHidden.bind(this));
    } else {
      this.onHidden();
    }
  };

  Drawer.prototype.show = function show() {
    var e = $.Event(this.events.SHOW);
    this.$el.trigger(e);

    if (this.stateIsOpen) return;

    this.stateIsOpen = true;

    this.$el.addClass(classes.visible);

    if (this.settings.backdrop) {
      this.addBackdrop();
    }

    if (this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onShown.bind(this));
    } else {
      this.onShown();
    }
  };

  Drawer.prototype.toggle = function toggle() {
    return this.stateIsOpen ? this.hide() : this.show();
  };

  Drawer.prototype.onCloseClick = function onCloseClick(e) {
    e.preventDefault();
    this.hide();
  };

  return Drawer;
}();

exports.default = Drawer;

},{"../utils":29}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function findInstance(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },


  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function removeInstance(array, key, value) {
    var i = array.length;
    while (i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },


  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function compact(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },


  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function defaultTo(value, defaultValue) {
    return value == null || value !== value ? defaultValue : value;
  },


  /**
   * Constructs an object of key / value pairs out of the parameters of the query string
   *
   * @return {Object}
   */
  getQueryParams: function getQueryParams() {
    var queryString = location.search && location.search.substr(1) || '';
    var queryParams = {};

    queryString.split('&').filter(function (element) {
      return element.length;
    }).forEach(function (paramValue) {
      var splitted = paramValue.split('=');

      if (splitted.length > 1) {
        queryParams[splitted[0]] = splitted[1];
      } else {
        queryParams[splitted[0]] = true;
      }
    });

    return queryParams;
  },


  /**
   * Returns empty string or query string with '?' prefix
   *
   * @return (string)
   */
  getQueryString: function getQueryString() {
    var queryString = location.search && location.search.substr(1) || '';

    // Add the '?' prefix if there is an actual query
    if (queryString.length) {
      queryString = '?' + queryString;
    }

    return queryString;
  },


  /**
   * Constructs a version of the current URL with the passed in key value pair as part of the query string
   * Will also remove the key if an empty value is passed in
   * See: https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
   *
   * @param {String} key
   * @param {String} value
   * @param {String} uri - optional, defaults to window.location.href
   * @return {String}
   */
  getUrlWithUpdatedQueryStringParameter: function getUrlWithUpdatedQueryStringParameter(key, value, uri) {

    uri = uri || window.location.href;

    // remove the hash part before operating on the uri
    var i = uri.indexOf('#');
    var hash = i === -1 ? '' : uri.substr(i);
    uri = i === -1 ? uri : uri.substr(0, i);

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";

    if (!value) {
      // remove key-value pair if value is empty
      uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
      if (uri.slice(-1) === '?') {
        uri = uri.slice(0, -1);
      }
      // replace first occurrence of & by ? if no ? is present
      if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
    } else if (uri.match(re)) {
      uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      uri = uri + separator + key + "=" + value;
    }
    return uri + hash;
  },


  /**
   * Constructs a version of the current URL with the passed in parameter key and associated value removed
   *
   * @param {String} key
   * @return {String}
   */
  getUrlWithRemovedQueryStringParameter: function getUrlWithRemovedQueryStringParameter(parameterKeyToRemove, uri) {
    uri = uri || window.location.href;

    var rtn = uri.split("?")[0],
        param,
        params_arr = [],
        queryString = uri.indexOf("?") !== -1 ? uri.split("?")[1] : "";

    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        if (param === parameterKeyToRemove) {
          params_arr.splice(i, 1);
        }
      }
      if (params_arr.length > 0) {
        rtn = rtn + "?" + params_arr.join("&");
      }
    }

    return rtn;
  },


  /**
   * Check if we're running the theme inside the theme editor
   *
   * @return {bool}
   */
  isThemeEditor: function isThemeEditor() {
    return location.href.match(/myshopify.com/) !== null && location.href.match(/theme_id/) !== null;
  },


  /**
   * Get the name of the correct 'transitionend' event for the browser we're in
   *
   * @return {string}
   */
  whichTransitionEnd: function whichTransitionEnd() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  },


  /**
   * Adds user agent classes to the document to target specific browsers
   *
   */
  userAgentBodyClass: function userAgentBodyClass() {
    var ua = navigator.userAgent,
        d = document.documentElement,
        classes = d.className,
        matches;

    // Detect iOS (needed to disable zoom on form elements)
    // http://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      classes += ' ua-ios';

      // Add class for version of iOS
      matches = ua.match(/((\d+_?){2,3})\slike\sMac\sOS\sX/);
      if (matches) {
        classes += ' ua-ios-' + matches[1]; // e.g. ua-ios-7_0_2
      }

      // Add class for Twitter app
      if (/Twitter/.test(ua)) {
        classes += ' ua-ios-twitter';
      }

      // Add class for Chrome browser
      if (/CriOS/.test(ua)) {
        classes += ' ua-ios-chrome';
      }
    }

    // Detect Android (needed to disable print links on old devices)
    // http://www.ainixon.me/how-to-detect-android-version-using-js/
    if (/Android/.test(ua)) {
      matches = ua.match(/Android\s([0-9\.]*)/);
      classes += matches ? ' ua-aos ua-aos-' + matches[1].replace(/\./g, '_') : ' ua-aos';
    }

    // Detect webOS (needed to disable optimizeLegibility)
    if (/webOS|hpwOS/.test(ua)) {
      classes += ' ua-webos';
    }

    // Detect Samsung Internet browser
    if (/SamsungBrowser/.test(ua)) {
      classes += ' ua-samsung';
    }

    d.className = classes;
  },


  /**
   * Generates a 32 bit integer from a string
   * Reference - https://stackoverflow.com/a/7616484
   *
   * @param {string}
   * @return {int}
   */
  hashFromString: function hashFromString(string) {
    var hash = 0,
        i,
        chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr = string.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },
  chosenSelects: function chosenSelects($container) {
    var $selects = $container ? $('select.form-control', $container) : $('select.form-control');
    $selects.not('[data-no-chosen]').chosen();

    // Allows browser autofill to function properly
    $selects.on('change', function () {
      $(this).trigger('chosen:updated');
    });
  },


  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function cookiesEnabled() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
    }
    return cookieEnabled;
  },


  /**
   * Pluralizes the unit for the nuber passed in.
   * Usage mirrors the Shopify "pluralize" string filter
   *
   * @param {Number} number
   * @param {String} singular
   * @param {String} plural
   * @return {String}
   */
  pluralize: function pluralize(number, singular, plural) {
    var output = '';

    number = parseInt(number);

    if (number == 1) {
      output = singular;
    } else {
      output = plural;
      if (typeof plural == "undefined") {
        output = singular + 's'; // last resort, turn singular into a plural
      }
    }
    return output;
  },


  /**
   * Checks if a url is an external link or not
   *
   * @param {String} url
   * @return {Bool}
   */
  isExternal: function isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + { "http:": 80, "https:": 443 }[location.protocol] + ")?$"), "") !== location.host) return true;
    return false;
  }
};

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('../sections/base');

var _base2 = _interopRequireDefault(_base);

var _sectionConstructorDictionary = require('../sectionConstructorDictionary');

var _sectionConstructorDictionary2 = _interopRequireDefault(_sectionConstructorDictionary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseView = function () {
  function BaseView($el) {
    _classCallCheck(this, BaseView);

    this.$el = $el;
    this.sections = [];

    $(document).on('shopify:section:load', this.onSectionLoad.bind(this));
    $(document).on('shopify:section:unload', this.onSectionUnload.bind(this));

    console.log('BaseView - contructing view');
  }

  BaseView.prototype._createSectionInstance = function _createSectionInstance($container) {
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    var constructor = _sectionConstructorDictionary2.default[type];

    // Need to make sure we're working with actual sections here..
    if (typeof constructor === 'undefined' || !(constructor.prototype instanceof _base2.default)) {
      return;
    }

    console.log('creating new section instance for type - ' + type);

    this.sections.push(new constructor($container));
  };

  BaseView.prototype.onSectionLoad = function onSectionLoad(e) {
    console.log('[BaseView] - calling section LOAD');

    this._createSectionInstance($('[data-section-id]', e.target));
  };

  BaseView.prototype.onSectionUnload = function onSectionUnload(e) {
    console.log('[BaseView] - calling section UNLOAD');
    console.log('sections count - ' + this.sections.length);

    var remainingSections = [];
    this.sections.forEach(function (section) {
      if (section.id == e.detail.sectionId) {
        console.log('removing section for type - ' + section.type);
        section.onUnload();
      } else {
        remainingSections.push(section);
      }
    });

    this.sections = remainingSections;
    console.log('updated sections count - ' + this.sections.length);
  };

  BaseView.prototype.destroy = function destroy() {
    console.log('[BaseView] - calling DESTROY');
    this.sections.forEach(function (section) {
      section.onUnload && section.onUnload();
    });
  };

  BaseView.prototype.transitionIn = function transitionIn() {
    console.log('transition in!');
  };

  BaseView.prototype.transitionOut = function transitionOut(callback) {
    callback();
  };

  return BaseView;
}();

exports.default = BaseView;

},{"../sectionConstructorDictionary":14,"../sections/base":16}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _cart = require('../sections/cart');

var _cart2 = _interopRequireDefault(_cart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var CartView = function (_BaseView) {
  _inherits(CartView, _BaseView);

  function CartView($el) {
    _classCallCheck(this, CartView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    _this.cartSection = new _cart2.default($el.find('[data-section-type="cart"]'));

    _this.sections.push(_this.cartSection);
    return _this;
  }

  return CartView;
}(_base2.default);

exports.default = CartView;

},{"../sections/cart":17,"./base":30}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _collection = require('../sections/collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var CollectionView = function (_BaseView) {
  _inherits(CollectionView, _BaseView);

  function CollectionView($el) {
    _classCallCheck(this, CollectionView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    _this.collectionSection = new _collection2.default($el.find('[data-section-type="collection"]'));

    _this.sections.push(_this.collectionSection);
    return _this;
  }

  CollectionView.prototype.transitionOut = function transitionOut(callback) {
    $("html, body").animate({ scrollTop: 0 }, 300);
    setTimeout(callback, 150);
  };

  return CollectionView;
}(_base2.default);

exports.default = CollectionView;

},{"../sections/collection":18,"./base":30}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _contact = require('../sections/contact');

var _contact2 = _interopRequireDefault(_contact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var ContactView = function (_BaseView) {
  _inherits(ContactView, _BaseView);

  function ContactView($el) {
    _classCallCheck(this, ContactView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    _this.contactSection = new _contact2.default($el.find('[data-section-type="contact"]'));

    _this.sections.push(_this.contactSection);
    return _this;
  }

  return ContactView;
}(_base2.default);

exports.default = ContactView;

},{"../sections/contact":19,"./base":30}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _base3 = require('../sections/base');

var _base4 = _interopRequireDefault(_base3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var IndexView = function (_BaseView) {
  _inherits(IndexView, _BaseView);

  function IndexView($el) {
    _classCallCheck(this, IndexView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    console.log('index view');

    $('[data-section-id]').each(function (i, el) {
      _this._createSectionInstance($(el));
    });
    return _this;
  }

  return IndexView;
}(_base2.default);

exports.default = IndexView;

},{"../sections/base":16,"./base":30}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _product = require('../sections/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var ProductView = function (_BaseView) {
  _inherits(ProductView, _BaseView);

  function ProductView($el) {
    _classCallCheck(this, ProductView);

    var _this = _possibleConstructorReturn(this, _BaseView.call(this, $el));

    _this.productSection = new _product2.default($el.find('[data-section-type="product"]'));

    _this.sections.push(_this.productSection);

    window.scrollTop = 0;
    return _this;
  }

  ProductView.prototype.transitionIn = function transitionIn() {};

  ProductView.prototype.transitionOut = function transitionOut(callback) {
    if (this.productSection.drawer && this.productSection.drawer.stateIsOpen) {
      this.productSection.drawer.$el.one('hidden.drawer', callback);
      this.productSection.drawer.hide();
    } else {
      callback();
    }
    // this.productSection.$container.css('transition', 'all 1000ms cubic-bezier(0.4, 0.08, 0, 1.02)');
    // this.productSection.$container.css('transform', 'translateY(5%)');
    // this.productSection.$container.css('opacity', '0');
    // setTimeout(callback, 400);
  };

  return ProductView;
}(_base2.default);

exports.default = ProductView;

},{"../sections/product":24,"./base":30}]},{},[5]);
