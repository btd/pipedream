module.exports = {
    index:function (params, callback) {
        console.log('index called');
        console.log(params);
        return callback && callback(null, 'index', {
            title: "Test title",
            names: [{name: 'One'}, {name: 'Two'}, {name:'Tree'}]
        });
    },

    show:function (params) {
        console.log(params);
        console.log('show called');
        return 'show';
    }
};