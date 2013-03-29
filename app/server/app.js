var express = require('express'),
    ServerRouter = require('../route/server/router'),
    _ = require('lodash'),
    cons = require('consolidate'),
    path = require('path');

module.exports = app = function(options, views) {
    var app = express();
    //templates

    app.set('view engine', 'html');
    app.engine('dust', cons.dust);
    app.engine('html', cons.ejs);

    app.set('views', views ||  __dirname + '/views');

    app.use(express.static(path.join(__dirname, '../public')));

    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    var router = new ServerRouter(_.extend(options, {
        app: app
    }));

    app.use(app.router);

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    return app;
};
