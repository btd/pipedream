var BaseModel = require('../base_model');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;

module.exports = BaseModel.extend({
    initialize: function(attrs) {
        /*if(attrs._id) {
            this.set('_id', _.isString(attrs._id) ? ObjectID.createFromHexString(attrs._id): attrs._id, { silent: true});
        }*/
    },

    toJSON: function() {
        var json = BaseModel.prototype.toJSON.apply(this);
        if(json._id) json._id = json._id.toHexString();
        return json;
    }
});