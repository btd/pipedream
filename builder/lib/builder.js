var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('builder');

// source for client-side require
var requireCode = fs.readFileSync(__dirname + '/require.js', 'utf8')
    .replace(/\/*([^/]+)\/\n/g, '')
//.replace(/\n/g, '')
.replace(/ +/g, ' ');

var debugCode = fs.readFileSync(__dirname + '/../support/debug/debug.js', 'utf8');

function Renderer(options) {
    this.options = options || {};
    this.paths = [];
}

Renderer.prototype.set = function(key, val) {
    this.options[key] = val;
    return this;
};

Renderer.prototype.include = function(filepath) {
    if (!filepath) return this;
    var self = this,
        paths = (Array.isArray(filepath) ? filepath : [filepath]);

    paths.forEach(function(p) {
        var isDirectory = fs.statSync(p).isDirectory();
        if (isDirectory) {
            return fs.readdirSync(p).forEach(function(f) {
                self.include(p + '/' + f);
            });
        }
        self.paths.push(p);
    });
    return this;
};

Renderer.prototype.render = function(done) {
    if (!done) return this;
    var self = this,
        opt = this.options;

    var data = '(function(){\n var __isClient = true;\n ' + (opt.debug ? debugCode : 'function debug(){return debug;}') + '\n' + requireCode + this.paths.sort().reduce(function(str, path) {
        return str + self._render(path);
    }, '') + '\nwindow.require = require;' + '\n})();';

    done(undefined, data);
};

var moduleName = function(filepath) {
    return path.join(path.dirname(filepath), path.basename(filepath, '.js'));
};

Renderer.prototype._render = function(filepath) {

    var opts = this.options,
        basepath = opts.basepath,
        source = fs.readFileSync(filepath, 'utf8');

    // match a basepath
    basepath.some(function(base) {
        if (base == filepath.substr(0, base.length)) {
            filepath = filepath.substr(base.length);
            return true;
        }
    });
    var modName = moduleName(filepath);

    Object.keys(opts.shim).some(function(shimKey) {
        if ((new RegExp(shimKey)).test(modName)) {
            var shim = opts.shim[shimKey];
            var exports = shim.export ? '\nmodule.exports = ' + shim.export + ';' : '';
            var deps = shim.deps.map(function(d) {
                //TODO add some sort of processing for window?
                var name = (opts.shim[d] && opts.shim[d].export) || d;
                return 'var ' + name + ' = require("' + d + '"); this.' + name + ' = ' + name + ';\n';
            }).join('');
            source = deps + source + exports;
            return true;
        }
    });

    if (this.options.aliases[modName]) {
        return '\nrequire.register("' + modName + '", function(module, exports, require, global){ module.exports = require("' + this.options.aliases[modName] + '")});';

    } else {

        // remove `if node`
        var ignoring = false;

        source = source.split('\n').map(function(line, i) {
            if (ignoring) {
                if (/^ *\/\/ *end/.test(line)) {
                    ignoring = false;
                }
                return '';
            } else {
                if (/^ *\/\/ *if *node/.test(line)) {
                    debug('[%s] skipping node-only code at line %d', path.basename(filepath), i + 1);
                    ignoring = true;
                    return '';
                } else {
                    return line;
                }
            }
        }).join('\n');

        // wrap
        return '\nrequire.register("' + modName + '", ' + 'function(module, exports, require, global){\n' + source + '\n});';
    }
};

var normalizeShim = function(options) {
    options.shim = options.shim || {};
    Object.keys(options.shim).forEach(function(k) {
        var oldShim = options.shim[k];
        if (Array.isArray(oldShim)) {
            //deps
            options.shim[k] = {
                deps: oldShim
            };
        } else if (typeof oldShim === 'string') {
            //export
            options.shim[k] = {
                deps: [],
                export: oldShim
            };
        } else if (!options.shim[k].deps) {
            options.shim[k].deps = [];
        }
    });
    return options;
};

function render(paths, options, fn) {
    options = normalizeShim(options);
    if ('function' === typeof options) fn = options, options = {};
    return new Renderer(options).include(paths).render(fn);
}

// e.g. builder(paths, options).set(key, val).include(paths).render(fn)
exports = module.exports = render;
// e.g. builder.render(paths, options, fn)
exports.render = render;
