var ClientRouter = require('../route/client/router');

var router = new ClientRouter({
    paths: {
        controllers: '../controllers',
        routes: '../route/routes'
    }
});

router.start();

router.navigate('a/123/a/abac/sdfs', { trigger: true });