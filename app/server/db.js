var options = require('./options');

var MongoClient = require('mongodb').MongoClient,
    _ = require('lodash');

module.exports =  _.bind(MongoClient.connect, null, options.db, options.mongodb);