var helper = require('../helper');

var BaseModel = helper.root_require('./models/base_model');

module.exports = Todo = BaseModel.extend({

    collectionName: function() {
        return Todo.collectionName;
    },

    // Default attributes for the todo item.
    defaults: function() {
        return {
            title: "empty todo...",
            creationTime: Date.now(),
            done: false
        };
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
        this.save({
            done: !this.get("done")
        });
    }

}, {
    collectionName: 'todos'
});
