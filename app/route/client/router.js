
var Backbone = require('backbone');
var _ = require('lodash');
var BaseRouter = require('../router');



module.exports = ClientRouter = function() {
    var ClientRouter = function(options) {
        BaseRouter.call(this, options);

        this._router = new Backbone.Router;
        this.buildRoutes();

        _(this.routes).each(function(route) {

            var paramNames = this.paramNames(route);

            //third argument for callback will be a function(err, view_name, data) that will populate template
            this._router.route(
                route.pattern.indexOf('/') === 0 ? route.pattern.substr(1): route.pattern,
                route.definition.controller + '#' + route.definition.action,
                bindNamesToArguments(paramNames, this.getAction(route.definition))
            );
        }, this);
    };

    var bindNamesToArguments = function(paramNames, callback) {
        var params = {};
        var otherArgs = Array.prototype.slice.call(arguments, 2);
        return function() {
            var args = arguments;
            _(paramNames).each(function(p, idx) {
               params[p.substr(1)] = args[idx];
            });
            callback.apply(this, [params].concat(otherArgs));
        };
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
