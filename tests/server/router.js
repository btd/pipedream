var should = require('should'),
    request = require('supertest'),
    Backbone = require('backbone');

var router = Backbone.Router.extend({
    routes: {
        'a/:id': 'showTodo',
        'a':     'index',

        '':      'index',
        'a/:id/:a/:b/*other': 'showTodo2'
    },

    showTodo: function(callback, id) {
        callback(null, 'show', { id: id });
    },

    index: function(callback) {
        callback(null, 'index');
    },

    showTodo2: function(callback, id, a, b, other) {
        callback(null, 'manyParams', {
           id: id,
            a: a,
            b: b,
            other: other
        });
    }
});

var ServerRouter = require('../../app/route/server/router')(router);

var app = require('../../app/server/main')(function(app) {
    var router = new ServerRouter({
        app: app
    });
});

describe('server router', function() {
    it('should call specified in routes controller', function(done) {

        request(app)
            .get('/a')
            .end(function(err, res){
                if (err) return done(err);

                res.text.should.be.eql('index');

                request(app)
                    .get('/a/15')
                    .end(function(err, res){
                        if (err) return done(err);

                        res.text.should.be.eql('show 15');
                        request(app)
                            .get('/')
                            .end(function(err, res){
                                if (err) return done(err);

                                res.text.should.be.eql('index');
                                done();
                            });
                    });
            });
    });
    it('should parse params', function(done) {
        request(app)
            .get('/a/15/b/c/werw')
            .end(function(err, res){
                if (err) return done(err);

                res.text.should.be.eql('Params 15 b c werw');
                done();
            });
    });
});