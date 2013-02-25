var _ = require('lodash');
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
}();