var Should = require('should');
var request = require('supertest');

var app = require('../../app/server/main');

describe('server router', function() {
    it('should call specified in routes controller', function(done) {

        request(app)
            .get('/a')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                res.body.should.be.eql({ view: 'index' });

                request(app)
                    .get('/a/15')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function(err, res){
                        if (err) return done(err);

                        res.body.should.be.eql({ id: "15", view: 'show' });
                        request(app)
                            .get('/')
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .end(function(err, res){
                                if (err) return done(err);

                                res.body.should.be.eql({ view: 'index' });
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

                res.body.should.be.eql({ id: "15", view: 'show' });
                request(app)
                    .get('/')
                    .expect('Content-Type', /html/)
                    .end(function(err, res){
                        if (err) return done(err);
                        done();
                    });
            });
    });
    it('should parse params', function(done) {
        request(app)
            .get('/a/15/b/c/werw')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
    });
});