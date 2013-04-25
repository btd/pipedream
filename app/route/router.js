/**
 * Options will contain path to controllers and path to routes
 * @param options
 * @return {Object}
 */

var _ = require('lodash');
var Backbone = require('backbone');
var TodoList = require('../collections').TodoList;

module.exports = Backbone.Router.extend({
    initialized: false,

    routes: {
        '': 'showTodo'
    },

    views: {
        index: require('../views/app')
    },

    showTodo: function (render) {
        var todos = new TodoList();
        if (this.initialized) {
            todos.fetch({
                success: function () {
                    render(null, 'index', {
                        model: todos
                    });
                }
            });
        } else {
            render(null, 'index', {
                model: todos
            });
        }

    },

    route: function (route, name, callback) {
        // first need to normalize input
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];

        var that = this;

        Backbone.Router.prototype.route.call(this, route, name, function () {
            callback.apply(this, [function (err, viewName, data) {
                if (err) throw err;

                data.viewInit = that.initialized;

                this.currentView = new that.views[viewName](data);

                if (!that.initialized) that.initialized = true;
            }].concat(arguments));
        });
    }
});
