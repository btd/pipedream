/**
 * Options will contain path to controllers and path to routes
 * @param options
 * @return {Object}
 */

var _ = require('lodash');
var Backbone = require('backbone');

module.exports = BaseRouter = Backbone.Router.extend({
    initialize: function(options) {
        this.options = options;

        this._controllersCache = options.controllers || {};
        this.routes = [];

        this._buildRoutes(options.routes || require(this.options.paths.routes));

        _(this.routes).each(function(route) {
            //for third argument _.bind will help
            //third argument for callback will be a function(err, view_name, data) that will populate template
            this.route(
            route.pattern,
            route.definition.controller + '#' + route.definition.action,
            this._getAction(route.definition));
        }, this);
    },

    _getController: function(name) {
        var controller = this._controllersCache[name];
        if (!controller) {
            controller = require(this.options.paths.controllers + '/' + name);
            this._controllersCache[name] = controller;
        }
        return controller;
    },
    _getAction: function(definition) {
        return this._getController(definition.controller)[definition.action];
    },

    _buildRoutes: function(routesBuild) {
        var that = this;

        var takeRoute = function() {
            var uriPattern = arguments[0];
            var definition = Array.prototype.slice.call(arguments, 1);
            that.routes.push({
                pattern: that._parseUrl(uriPattern),
                definition: that._parseDefinition(definition)
            });
        };

        routesBuild(takeRoute);
    },

    _parseUrl: function(url) {
        return url; // for now it will be as is
    },

    _parseDefinition: function(rawDefinition) {
        if (rawDefinition.length < 1) throw new Error("Route definition is empty");

        var definition = {};

        var splittedAction = rawDefinition[0].split('#');
        definition.controller = splittedAction[0];
        definition.action = splittedAction[1] ? splittedAction[1] : 'index';

        if (rawDefinition[1]) _.extend(definition, rawDefinition[1]);
        return definition;
    }
});
