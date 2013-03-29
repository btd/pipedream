var Backbone = require('backbone');

module.exports = Todo = Backbone.Model.extend({

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

});
