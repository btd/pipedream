module.exports = {
    index: function(callback) {
        return callback(null, 'index', {
            title: "Test title",
            names: [{
                    name: 'One'
                }, {
                    name: 'Two'
                }, {
                    name: 'Tree'
                }
            ]
        });
    },

    show: function(callback, id) {

        return callback(null, 'show', { param: id });
    }
};
