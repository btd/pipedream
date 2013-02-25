var Should = require('should');
var request = require('supertest');

var App = require('../../app/server/app');

var testPath = function(path) {
    return __dirname + '/../router_fixtures/' + path;
};

var app = App({
    paths: {
        controllers: testPath('controllers'),
        routes: testPath('routes')
    }
});


describe('server router', function() {
    it('should call specified in routes controller', function(done) {

        request(app)
            .get('/a')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                res.body.message.should.be.eql('index');

                request(app)
                    .get('/a/15')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function(err, res){
                        if (err) return done(err);

                        res.body.message.should.be.eql('show');
                        request(app)
                            .get('/')
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .end(function(err, res){
                                if (err) return done(err);

                                res.body.message.should.be.eql('index');
                                done();
                            });
                    });
            });
    });

    it('should return html if we ask html and json if json', function(done) {
        request(app)
            .get('/a/15')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                res.body.message.should.be.eql('show');
                request(app)
                    .get('/')
                    .expect('Content-Type', /html/)
                    .end(function(err, res){
                        if (err) return done(err);

                        res.text.should.be.eql('index');
                        done();
                    });
            });
    });
});