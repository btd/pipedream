var _ = require('lodash');
var Backbone = require('backbone');


module.exports = function(BaseRouter) {
    return BaseRouter.extend({
        route: function(route, name, callback) {
            if (!_.isRegExp(route)) route = this._routeToRegExp(this._preprocessBackboneRoute(route.trim()));
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) callback = this[name];

            var that = this;

            this.options.app.get(route, function(req, res) {
                var args = [function(err, viewName, data) {
                    res.render(viewName, data);
                }].concat(req.params || []);
                callback.apply(that, args);

                that.trigger.apply(that, ['route:' + name].concat(args));
                that.trigger('route', name, args);
                Backbone.history.trigger('route', that, name, args);
            });

            return this;
        },

        _preprocessBackboneRoute: function(route) {
            return route.indexOf('/') === 0 ? route : '/' + route;
        },

        //this is required to be in costructor because constructor executed before initialize for router (it is defenitely different things)
        constructor: function(options) {
            this.options = options;
            if (options.routes) this.routes = options.routes;

            this._bindRoutes();
            this.initialize.apply(this, arguments);

            // server router intialized and never parse anything
            this.initialized = true;
        }
    });
};
