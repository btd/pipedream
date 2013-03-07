module.exports = function(match) {
    match('a', 'a');
    match('a/:id', 'a#show');
    match('a/:a/:b/*other', 'a');
};