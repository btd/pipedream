var Backbone = require('backbone');
var _ = require('lodash');
var TodoView = require('./todo');

module.exports = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: "#todoapp",

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: require('../templates/stats'),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "keypress #new-todo":  "createOnEnter",
        "click #clear-completed": "clearCompleted",
        "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function(options) {

        this.input = this.$("#new-todo");
        this.allCheckbox = this.$("#toggle-all")[0];

        this.model = options.model;
        if(!options.dataInit) this.model.reset(this.$el.data('view-model'));

        this.listenTo(this.model, 'add', this.addOne);
        this.listenTo(this.model, 'reset', this.addAll);
        this.listenTo(this.model, 'all', this.render);

        this.footer = this.$('footer');
        this.main = $('#main');

        //Todos.fetch();
        this.addAll();

        this.render();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        var done = this.model.done().length;
        var remaining = this.model.remaining().length;

        if (this.model.length) {
            this.main.show();
            this.footer.show();
            this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
        } else {
            this.main.hide();
            this.footer.hide();
        }

        this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
        var view = new TodoView({model: todo});
        this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
        this.model.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
        if (e.keyCode !== 13) return;
        if (!this.input.val()) return;

        this.model.create({title: this.input.val()});
        this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
        _.invoke(this.model.done(), 'destroy');
        return false;
    },

    toggleAllComplete: function () {
        var done = this.allCheckbox.checked;
        this.model.each(function (todo) { todo.save({'done': done}); });
    }

});
