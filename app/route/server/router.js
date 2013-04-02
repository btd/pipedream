var _ = require('lodash');
var BaseRouter = require('../router');

module.exports = BaseRouter.extend({
    route: function(route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (!callback) callback = this[name];

        var wrappedCallback = function(req, callback, act) {
            return function() {
                callback.apply(null, [act].concat(req.params || []));
            };
        };

        this.options.app.get(route, function(req, res) {
            res.format({
                html: wrappedCallback(req, callback, function(err, viewName, data) {
                    res.render(viewName, data);
                }),
                json: wrappedCallback(req, callback, function(err, viewName, data) {
                    res.send(data);
                })
            });
        });
    },

    _parseUrl: function(url) {
        return url.indexOf('/') === 0 ? url : '/' + url;
    }
});
