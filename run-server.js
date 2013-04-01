var app = require('./app/server/main');
var connectDb = require('./app/server/db');
var options = require('./app/server/options');

var Backbone = require('./app/server/sync');

var Todo = require('./app/models/todo');

var TodoList = require('./app/collections/todo');

connectDb(function(err, db) {
    if(err) throw err;

    console.log('Connected to db');
    console.log('Application on port: ' + options.port);

    app.db = db;

    /*
    collection: read
    var todo = new TodoList();

    todo.fetch({
        success: function() {
            console.log(todo.toJSON());
        }
    });*/


    //model: read
    var todo = new Todo();

    todo.fetch({
        success: function() {
            console.log(todo.toJSON());
        }
    });

    app.listen(options.port);
});
