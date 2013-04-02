var Handlebars = require("handlebars");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['stats.hlb'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n"
    + "\n<a id=\"clear-completed\">Clear ";
  if (stack1 = helpers.done) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.done; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " completed item(s)</a>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.done, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<div class=\"todo-count\"><b>";
  if (stack1 = helpers.remaining) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.remaining; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b> item(s) left</div>";
  return buffer;
  });
