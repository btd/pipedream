var Backbone = require('backbone');
var Router = require('./route/router');
var options = require('./options');

var router = new Router(options);

Backbone.history.start({
    pushState: true
});

router.navigate('a/123/a/abac/sdfs', {
    trigger: true
});
