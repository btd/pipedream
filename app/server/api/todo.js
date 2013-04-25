var Todo = require('../../models').Todo;
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

var ok = {result: 'ok'};
var error = function(msg) {
    return { result: 'error', msg: msg};
};

module.exports = {
    destroy: function(req, res) {
        var todo = req.todo;
        if(todo) {
            todo.destroy();
        }
        res.send(ok);
    },
    update: function(req, res) {
        var todo = req.todo;
        if(todo) {

            todo.save(_.omit(req.body, '_id'), {
                success: function() {
                    res.send(todo.toJSON());
                }
            });
        } else {
            res.send(404, error('There is no such todo'));
        }
    },

    create: function(req, res) {
        var todo = new Todo(req.body);
        todo.save(null, {
            success: function() {
                res.send(todo.toJSON());
            }
        });
    },

    load: function(req, id, fn) {
        var todo = new Todo({ _id: ObjectID.createFromHexString(id) });
        todo.fetch({
            success: function() {
                fn(null, todo);
            }
        });
    }
};