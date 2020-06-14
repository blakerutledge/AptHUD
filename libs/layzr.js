(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Layzr = factory());
}(this, (function () { 'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var knot = function knot() {
  var extended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var events = Object.create(null);

  function on(name, handler) {
    events[name] = events[name] || [];
    events[name].push(handler);
    return this;
  }

  function once(name, handler) {
    handler._once = true;
    on(name, handler);
    return this;
  }

  function off(name) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    handler ? events[name].splice(events[name].indexOf(handler), 1) : delete events[name];

    return this;
  }

  function emit(name) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // cache the events, to avoid consequences of mutation
    var cache = events[name] && events[name].slice();

    // only fire handlers if they exist
    cache && cache.forEach(function (handler) {
      // remove handlers added with 'once'
      handler._once && off(name, handler);

      // set 'this' context, pass args to handlers
      handler.apply(_this, args);
    });

    return this;
  }

  return _extends({}, extended, {

    on: on,
    once: once,
    off: off,
    emit: emit
  });
};

var layzr = (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // options

  var settings = {
    normal: options.normal || 'data-normal',
    retina: options.retina || 'data-retina',
    srcset: options.srcset || 'data-srcset',
    threshold: options.threshold || 0,
    container: options.container || document.body
  };

  // private

  var prevLoc = getLoc();
  var ticking = void 0;

  var nodes = void 0;
  var windowHeight = void 0;

  // feature detection
  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/srcset.js

  var srcset = document.body.classList.contains('srcset') || 'srcset' in document.createElement('img');

  // device pixel ratio
  // not supported in IE10 - https://msdn.microsoft.com/en-us/library/dn265030(v=vs.85).aspx

  var dpr = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;

  // instance

  var instance = knot({
    handlers: handlers,
    check: check,
    update: update
  });

  return instance;

  // location helper

  function getLoc() {
    return settings.container.scrollTop;
  }

  // debounce helpers

  function requestScroll() {
    prevLoc = getLoc();
    requestFrame();
  }

  function requestFrame() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        return check();
      });
      ticking = true;
    }
  }

  // offset helper

  function getOffset(node) {
    return node.getBoundingClientRect().top + prevLoc;
  }

  // in viewport helper

  function inViewport(node) {
    var viewTop = prevLoc;
    var viewBot = viewTop + windowHeight;

    var nodeTop = getOffset(node);
    var nodeBot = nodeTop + node.offsetHeight;

    var offset = settings.threshold / 100 * windowHeight;

    var in_view = ( nodeBot >= viewTop - offset && nodeTop <= viewBot + offset );

    // if ( in_view && !node.classList.contains('in-viewport') )  {
    //   node.classList.add('in-viewport')
    // }
    // else if ( !in_view && node.classList.contains('in-viewport') ) {
    //   node.classList.remove('in-viewport')
    // }

    return in_view
  }

  // source helper

  function setSource(node) {
    instance.emit('src:before', node);

    // prefer srcset, fallback to pixel density
    if (srcset && node.hasAttribute(settings.srcset)) {
      node.setAttribute('srcset', node.getAttribute(settings.srcset));
    } else {
      var retina = dpr > 1 && node.getAttribute(settings.retina);
      node.setAttribute('src', retina || node.getAttribute(settings.normal));
    }

    node.removeAttribute(settings.normal);

    node.dataset.loaded = true

    instance.emit('src:after', node);[settings.retina, settings.srcset].forEach(function (attr) {
      return node.removeAttribute(attr);
    });

    update();
  }

  // API

  function handlers(flag) {
    var action = flag ? 'addEventListener' : 'removeEventListener';['scroll', 'resize'].forEach(function (event) {
      return settings.container[action](event, requestScroll);
    });
    return this;
  }

  function check() {
    windowHeight = settings.container.clientHeight;
    nodes.forEach(function (node) {
      return inViewport(node) && setSource(node);
    });

    ticking = false;
    return this;
  }

  function update() {
    nodes = Array.prototype.slice.call(document.querySelectorAll('[data-normal]'));
    return this;
  }
});

return layzr;

})));