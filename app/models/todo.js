module.exports = function(BaseModel) {
    var Todo = BaseModel.extend({

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
        },
        urlRoot: '/todos'
    }, {
        collectionName: 'todos'
    });

    return Todo;
};
