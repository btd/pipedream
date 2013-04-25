module.exports = {
    TodoList: require('../todo')(require('../../models/server').Todo)
};
