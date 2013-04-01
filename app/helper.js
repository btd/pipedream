var isClient = typeof __isClient !== 'undefined' && __isClient;


var root_require = function(path) {
    return require(path);
};

if(!isClient) {
    root_require = function(path) {
        try {
            var splitted = path.split('/'), filename = splitted.pop(), basename = splitted.join('/');
            return require(basename+'/server/'+filename);
        } catch(e) {
            return require(path);
        }
    };
}

module.exports = {
    isClient: isClient,
    root_require: root_require
};