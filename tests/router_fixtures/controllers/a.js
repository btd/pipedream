
module.exports = {
    index: function(callback) {
        callback(null, 'index', {view: 'index'});
    },

    show: function(callback, id) {
        callback(null, 'show', {id: id, view: 'show'});
    }
};