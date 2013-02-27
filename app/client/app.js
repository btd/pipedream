var ClientRouter = require('../route/client/router');

var router = new ClientRouter({
    paths: {
        controllers: '../controllers',
        routes: '../route/routes'
    }
});