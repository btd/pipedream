var express = require('express');
var ServerRouter = require('../route/server/router');
var _ = require('lodash');

module.exports = app = function(options) {
    var app = express();

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    console.log(options);

    var router = new ServerRouter(_.extend(options, {
        app: app
    }));

    app.use(app.router);
    return app;
};

