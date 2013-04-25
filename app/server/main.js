var express = require('express'),
    _ = require('lodash'),
    cons = require('consolidate'),
    path = require('path');

var //ServerRouter = require('../route/server/router'),
    options = require('./options');

require('../handlebars-helpers');

require('express-resource');

module.exports = function(callback) {
    var app = express();

    app.set('view engine', options.express['view engine']);
    app.engine('dust', cons.dust);
    app.engine('html', cons.ejs);
    app.engine('hbs', cons.handlebars);

    app.set('views', options.express.views);

    app.use(express.static(path.join(__dirname, './public')));

    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    callback(app);

    app.resource('todos', require('./api/todo'));

    //var router = new ServerRouter(_.extend({
    //    app: app
    //}, options));

    app.use(app.router);

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    return app;
};
