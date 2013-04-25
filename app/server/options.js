var options = require('../options');
var _ = require('lodash');

var testDir = __dirname + '/../../tests';

var envName = process.env.NODE_ENV || 'development';

var opts = {
    'development': _.merge({}, options, {
        db: 'mongodb://localhost/pipe-development',
        port: 4343,
        express: {
            'view engine': 'hbs',
            views: __dirname + '/views'
        },
        mongodb: {

        }
    }),
    'test': _.merge({}, options, {
        db: 'mongodb://localhost/pipe-test',
        port: 4343,
        express: {
            'view engine': 'html',
            views: testDir + '/views'
        },
        mongodb: {

        }
    })
};

module.exports = opts[envName];