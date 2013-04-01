var Backbone = require('backbone');
var app = require('./main');
var ObjectID = require('mongodb').ObjectID;

var collectionsCache = {
};

Backbone.sync = function(method, model, options) {
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

        console.log(result);
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
            dbCollection.update({ _id: model.id }, data, wholeObjCallback);

            break;

        case 'delete':
            dbCollection.remove({ _id: model.id }, firstElCallback);
    }

    return dbCollection;
};

// return patched backbone
module.exports = Backbone;