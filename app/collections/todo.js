var Todo = require('../models/todo');
var Backbone = require('backbone');

module.exports = TodoList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Todo,

    comparator: 'creationTime',

    // Filter down the list of all todo items that are finished.
    done: function() {
        return this._byDone(true);
    },

    _byDone: function(done) {
        return this.where({
            done: done
        });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
        return this._byDone(false);
    }

});
