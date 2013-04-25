
var connectDb = require('./app/server/db');
var options = require('./app/server/options');

var Backbone = require('./app/server/sync');

var ServerRouter = require('./app/route/server/router')(require('./app/route/router'));

var app = require('./app/server/main')(function(app) {
    var router = new ServerRouter({
        app: app
    });
});

connectDb(function(err, db) {
    if(err) throw err;

    console.log('Connected to db');
    console.log('Application on port: ' + options.port);

    Backbone.app = app;
    app.db = db;

    app.listen(options.port);
});
