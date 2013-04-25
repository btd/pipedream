var Backbone = require('backbone');
var app = require('./main');
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

var collectionsCache = {
};

Backbone.sync = function(method, model, options) {
    var app = Backbone.app;
    if(!app) throw new Error('Run out of app context');
    if(!app.db) throw new Error('Not connected to db');

    var collectionName = model.collectionName();
    if(!collectionName) throw new Error('Couldn\'t sync model without collection. Model and collection should have collectionName method which return name of collection.');

    if(!collectionsCache[collectionName]) {
        collectionsCache[collectionName] = app.db.collection(collectionName);
    }

    var dbCollection = collectionsCache[collectionName];

    var data = options.data || options.attrs || model.toJSON(options);

    var isModel = !model.model;

    var firstElCallback = function(err, result) {
        if(err) options.error(err);

        options.success(result[0]);
    };

    var wholeObjCallback = function(err, result) {
        if(err) options.error(err);

        options.success(result);
    };

    switch (method) {
        case 'read':
            if(isModel) {
                if(model.isNew()) throw new Error('Try to read new model. Model should have _id property.');

                dbCollection.findOne({ _id: model.id }, wholeObjCallback);
            } else {
                //TODO add options.data support there
                dbCollection.find().toArray(wholeObjCallback);
            }

            break;

        case 'create':

            dbCollection.insert(data, firstElCallback);
            break;

        case 'patch':
        case 'update':
            //TODO update only changed
            dbCollection.update({ _id: model.id }, _.omit(data, '_id'), wholeObjCallback);

            break;

        case 'delete':
            dbCollection.remove({ _id: model.id }, firstElCallback);
    }

    return dbCollection;
};

// return patched backbone
module.exports = Backbone;