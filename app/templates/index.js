var Handlebars = require("handlebars");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['index.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"utf-8\">\n    <title>Todos</title>\n    <link rel=\"stylesheet\" href=\"/styles/todo.css\"/>\n</head>\n\n<body>\n\n<div id=\"todoapp\" data-view-model=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.json),stack1 ? stack1.call(depth0, depth0.model, options) : helperMissing.call(depth0, "json", depth0.model, options)))
    + "\">\n\n    <header>\n        <h1>Todos</h1>\n        <input id=\"new-todo\" type=\"text\" placeholder=\"What needs to be done?\">\n    </header>\n\n    <section id=\"main\">\n        <input id=\"toggle-all\" type=\"checkbox\">\n        <label for=\"toggle-all\">Mark all as complete</label>\n        <ul id=\"todo-list\"></ul>\n    </section>\n\n    <footer>\n        <a id=\"clear-completed\">Clear completed</a>\n        <div id=\"todo-count\"></div>\n    </footer>\n\n</div>\n\n<div id=\"instructions\">\n    Double-click to edit a todo.\n</div>\n\n<script src=\"/js/client.min.js\"></script>\n<script>\n    var app = require('app/main');\n</script>\n</body>\n</html>";
  return buffer;
  }); module.exports = templates['index.hbs'];
