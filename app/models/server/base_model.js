var BaseModel = require('../base_model');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;


module.exports = BaseModel.extend({
    idAttribute: '_id',

    toJSON: function() {
        var json = BaseModel.prototype.toJSON.apply(this);
        if(json._id) json._id = json._id.toHexString();
        return json;
    }
});