var Backbone = require('backbone');
var Router = require('./route/router');

var router = new Router({
    paths: {
        controllers: '../controllers'
    },
    routes: require('./route/routes')
});

Backbone.history.start({
    pushState: true
});

router.navigate('a/123/a/abac/sdfs', {
    trigger: true
});
