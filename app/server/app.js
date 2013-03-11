var express = require('express'),
    ServerRouter = require('../route/server/router'),
    _ = require('lodash'),
    dust = require('dustjs-linkedin'),
    cons = require('consolidate');

var tpl_engine = 'dust';

module.exports = app = function(options) {
    var app = express();

    //templates
    app.engine(tpl_engine, cons.dust);
    app.set('template_engine', tpl_engine);
    app.set('templates', __dirname + '/templates');
    app.set('view engine', tpl_engine);

    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    var router = new ServerRouter(_.extend(options, {
        app: app
    }));

    app.use(app.router);

    app.configure('development', function(){
        app.use(express.errorHandler());
    });

    return app;
};

