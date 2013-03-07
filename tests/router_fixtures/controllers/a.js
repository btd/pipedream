
module.exports = {
    index: function(params) {
        console.log(params);
        console.log('index called');
        return 'index';
    },

    show: function(params) {
        console.log(params);
        console.log('show called');
        return 'show';
    }
};