var express = require('express'),
    _ = require('lodash'),
    cons = require('consolidate'),
    path = require('path');

var ServerRouter = require('../route/server/router'),
    options = require('./options');

var app = express();

app.set('view engine', options.express['view engine']);
app.engine('dust', cons.dust);
app.engine('html', cons.ejs);

app.set('views', options.express.views);

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

module.exports = app;
