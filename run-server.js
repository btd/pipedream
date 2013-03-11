var app = require('./app/server/app')({
    paths: {
        routes: '../route/routes',
        controllers: '../controllers'
    }
});

app.listen(3000);