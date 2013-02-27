
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"client/app": function(exports, require, module) {var ClientRouter = require('../route/client/router');

var router = new ClientRouter({
    paths: {
        controllers: '../controllers',
        routes: '../route/routes'
    }
});}, "controllers/a": function(exports, require, module) {module.exports = {
    index: function() {
        console.log('index called');
        return 'index';
    },

    show: function() {
        console.log('show called');
        return 'show';
    }
}}, "route/client/router": function(exports, require, module) {
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
}, "route/router": function(exports, require, module) {/**
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


}, "route/routes": function(exports, require, module) {module.exports = function(match) {
    match('a', 'a');
};}, "route/server/router": function(exports, require, module) {var _ = require('lodash');
var BaseRouter = require('../router');

module.exports = ServerRouter = function() {
    var ServerRouter = function(options) {
        BaseRouter.call(this, options);

        this.buildRoutes();

        this.app = options.app;

        _(this.routes).each(function(route) {
            console.log(route);
            var action = this.getAction(route.definition);
            this.app.get('/' + route.pattern, function(req, res) {
                // just call it for now
                var result = action();

                res.format({
                    html: function() {
                       res.send(result);
                    },
                    json: function() {
                        res.send({ message: result });
                    }
                });
            });
        }, this);
    };

    _.extend(ServerRouter.prototype, BaseRouter.prototype);

    return ServerRouter;
}();}, "server/app": function(exports, require, module) {var express = require('express');
var ServerRouter = require('../route/server/router');
var _ = require('lodash');

module.exports = app = function(options) {
    var app = express();

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    console.log(options);

    var router = new ServerRouter(_.extend(options, {
        app: app
    }));

    app.use(app.router);
    return app;
};

}});
