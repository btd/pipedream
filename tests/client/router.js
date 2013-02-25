var Should = require('should');

var ClientRouter = require('../../app/route/client/router');

var testPath = function(path) {
    return __dirname + '/../router_fixtures/' + path;
};

describe('client router', function(){
    it("should parse routes to backbone router", function() {
        var router = new ClientRouter({
            paths: {
                controllers: testPath('controllers'),
                routes: testPath('routes')
            }
        });

        "".should.be.eql("");
    });
});