module.exports = function(match) {
    match('a/:id', 'a#show');
    match('a',     'a');

    match('',      'a');
    match('a/:id/:a/:b/*other', 'a');
};