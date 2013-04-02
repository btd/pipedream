var should = require('should');

var app = require('../../app/server/main');
var connectDb = require('../../app/server/db');

var Backbone = require('../../app/server/sync');

var BadModel = Backbone.Model;

var GoodModel = Backbone.Model.extend({
   collectionName: function() {
       return 'models';
   },
    idAttribute: '_id'
});

describe('Backbone.Sync with MongoDB', function() {
    before(function(done) {
        connectDb(function(err, db) {
            if(err) done(err);

            app.db = db;
            done();
        });
    });

    after(function(done) {
        app.db.close();
        done();
    });

    /*beforeEach(function(done) {

        app.db.dropCollection('models', function(err) {
            if(err) done(err);

            done();
        });
    });*/

    it('should say if model does not have collection to save', function(done) {
        var model = new BadModel();

        (function() { model.save(); }).should.throwError(/collectionName/);
        done();
    });

    it('should save model', function(done) {
        var model = new GoodModel();

        model.save({}, {
            success: function() {

                //console.log(model.toJSON());
                should.exist(model.get('_id'));
                done();
            }
        });
    });

    it('should read model', function(done) {
        var model1 = new GoodModel({ a: 'test'});

        var model2 = new GoodModel();

        should.not.exist(model1.get('_id'));
        should.not.exist(model2.get('_id'));

        model1.save({}, {
            success: function() {
                should.exist(model1.get('_id'));
                should.not.exist(model2.get('_id'));

                model2.set('_id', model1.get('_id'));

                model2.fetch({
                    success: function() {

                        should.exist(model2.get('a'));
                        model2.get('a').should.equal('test');

                        done();
                    }
                });
            }
        });
    });

    it('should update model', function(done) {
        var model = new GoodModel();

        model.save({}, {
            success: function() {
                model.set('a', 'test1');

                model.save({}, {
                    success: function() {

                        var model2 = new GoodModel({ _id: model.id });

                        model2.fetch({
                            success: function() {
                                should.exist(model2.get('a'));
                                model2.get('a').should.equal('test1');

                                model.save('b', 'test2', {
                                    success: function() {
                                        var model3 = new GoodModel({ _id: model.id });

                                        model3.fetch({
                                            success: function() {
                                                should.exist(model3.get('b'));
                                                model3.get('b').should.equal('test2');

                                                done();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    //TODO not sure that it is right way
    it('should remove model', function(done) {
        var model = new GoodModel({ a: 'test'});

        model.save(null, {
            success: function() {

                model.destroy({
                    success: function() {

                        var model1 = new GoodModel({ _id: model.id });
                        model1.fetch({
                            success: function() {

                                should.not.exist(model1.get('a'));

                                done();
                            }
                        });

                    }
                });
            }
        });
    });


});