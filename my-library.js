(function(){var global = this;
/*!
 * debug
 * Copyright(c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  localStorage.debug = name;

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

// persist

if (window.localStorage) debug.enable(localStorage.debug);function require(p, parent){ var path = require.resolve(p) , mod = require.modules[path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path), global); } return mod.exports;}require.modules = {};require.resolve = function(path){ var orig = path , reg = path + '.js' , index = path + '/index.js'; return require.modules[reg] && reg || require.modules[index] && index || orig;};require.register = function(path, fn){ require.modules[path] = fn;};require.relative = function(parent) { return function(p){ if ('debug' == p) return debug; if ('.' != p.charAt(0)) return require(p); var path = parent.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), parent); };};require.register("app/client/app.js", function(module, exports, require, global){
var ClientRouter = require('../route/client/router');

var router = new ClientRouter({
    paths: {
        controllers: '../controllers',
        routes: '../route/routes'
    }
});
});require.register("app/controllers/a.js", function(module, exports, require, global){
module.exports = {
    index: function() {
        console.log('index called');
        return 'index';
    },

    show: function() {
        console.log('show called');
        return 'show';
    }
}
});require.register("app/route/client/router.js", function(module, exports, require, global){

var Backbone = require('backbone');
var _ = require('lodash');
var BaseRouter = require('../router');

module.exports = ClientRouter = function() {
    var ClientRouter = function(options) {
        BaseRouter.call(this, options);

        console.log(options);

        this._router = new Backbone.Router;
        this.buildRoutes();

        _(this.routes).each(function(route) {
            console.log(route);
            this._router.route(
                route.pattern,
                route.definition.controller + '#' + route.definition.action,
                this.getAction(route.definition)
            );
        }, this);
    };

    _.extend(ClientRouter.prototype, BaseRouter.prototype, {
        navigate: function(path, options) {
            this._router.navigate(path, options);
        },

        start: function() {
            Backbone.history.start({ pushState: true });
        }
    });

    return ClientRouter;
}();

});require.register("app/route/router.js", function(module, exports, require, global){
/**
 * Options will contain path to controllers and path to routes
 * @param options
 * @return {Object}
 */
//TODO.md avoid usage of underscore and check that builded client script will contain backbone and lodash
var _ = require('lodash');
var Backbone = require('backbone');

module.exports = BaseRouter = function() {
    var BaseRouter = function(options) {
        this.options = options;
        this.routes = [];
    };

    _.extend(BaseRouter.prototype, Backbone.Events, {
        getController: function(name) {
            return require((this.options.paths.controllers || 'controllers') + '/' + name);
        },
        getAction: function(definition) {
            return this.getController(definition.controller)[definition.action];
        },
        buildRoutes: function() {
            var that = this;
            var routesBuild = require(this.options.paths.routes);

            console.log(routesBuild);

            var takeRoute = function() {
                var uriPattern = arguments[0];
                var definition = Array.prototype.slice.call(arguments, 1);
                that.routes.push({
                    pattern: that.parseUrl(uriPattern),
                    definition: that.parseDefinition(definition)
                });
            };

            routesBuild(takeRoute);
        },
        parseUrl: function(url) {
            return url; // for now it will be as is
        },

        parseDefinition: function(rawDefinition) {
            if(rawDefinition.length < 1) throw new Error("Route definition is empty");

            var definition = {};

            var splittedAction = rawDefinition[0].split('#');
            definition.controller = splittedAction[0];
            definition.action = splittedAction[1] ? splittedAction[1] : 'index';

            if(rawDefinition[1]) _.extend(definition, rawDefinition[1]);
            return definition;
        }
    });

    return BaseRouter;
}();

_



});require.register("app/route/routes.js", function(module, exports, require, global){
module.exports = function(match) {
    match('a', 'a');
};
});var exp = require('app');if ("undefined" != typeof module) module.exports = exp;else app = exp;
})();
