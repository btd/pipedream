var _ = require('lodash');
var BaseRouter = require('../router');

module.exports = ServerRouter = function() {
    var ServerRouter = function(options) {
        BaseRouter.call(this, options);

        this.buildRoutes();

        this.app = options.app;

        _(this.routes).each(function(route) {
            var action = this.getAction(route.definition);

            var paramNames = this.paramNames(route);
            var splatParamName = (route.pattern.match(this.splatParam) || [])[0];

            this.app.get(
                this._preparePattern(route.pattern),
                function(req, res) {

                    var act = _.bind(action, null, copyParams(req.params, paramNames, splatParamName));

                    res.format({
                        html: function() {
                            act(function(err, viewName, data) {
                                res.render(viewName, data);
                            });
                        },
                        json: function() {
                            res.send({ message: act(function(err, viewName, data) {

                            }) });
                        }
                    });
            });
        }, this);
    };

    var copyParams = function(params, names, splat) {
        var p = {};
        _(names).each(function(n) {
            var name = n.substr(1);
            p[name] = splat && n === splat ? params[0] : params[name];
        });
        return p;
    };

    _.extend(ServerRouter.prototype, BaseRouter.prototype, {
        _preparePattern: function(pattern) {
            return (pattern.indexOf('/') === 0 ? pattern: '/' + pattern).replace(this.splatParam, '*');
        }
    });

    return ServerRouter;
}();