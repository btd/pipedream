
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
