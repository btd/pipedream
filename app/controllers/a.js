module.exports = {
    index:function (params, callback) {
        console.log('index called');
        console.log(params);
        return callback && callback(null, 'index');
    },

    show:function (params) {
        console.log(params);
        console.log('show called');
        return 'show';
    }
};