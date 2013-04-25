var isClient = typeof window !== 'undefined';

module.exports = {
    Todo: require('./todo')(require(isClient ? './base_model' : './server/base_model'))
};
