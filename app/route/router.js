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
