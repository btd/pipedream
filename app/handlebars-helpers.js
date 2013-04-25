var Handlebars = require('handlebars');

Handlebars.registerHelper('json', function(obj) {
    return JSON.stringify(obj);
});
