debug                 = typeof debug != "undefined" ? debug : function(){};

var Path              = require('path');
var Stylus            = require('stylus');
var fs                = require('fs');
var dirname           = Path.dirname;

importedFiles         = exports.importedFiles = [];

Stylus.Evaluator.prototype.visitImport = function(imported){
  this.return++;

  var root = this.root
    , Parser = require(Path.join(__dirname, '../node_modules/stylus/lib/parser'))
    , path = this.visit(imported.path).first
    , includeCSS = this.includeCSS
    , importStack = this.importStack
    , found
    , literal;

  this.return--;
  debug('import %s', path);

  // url() passed
  if ('url' == path.name) return imported;

  // Ensure string
  if (!path.string) throw new Error('@import string expected');
  var name = path = path.string;

  // Absolute URL
  if (/url\s*\(\s*['"]?http/i.test(path)) {
    return imported;
  }

  // Literal
  if (~path.indexOf('.css') && !~path.indexOf('.css.')) {
    literal = true;
    if (!includeCSS) return imported;
  }

  // support optional .styl
  if (!literal && !/\.styl$/i.test(path)) path += '.styl';

  // Lookup
  found = Stylus.utils.lookup(path, this.paths, this.filename);
  found = found || Stylus.utils.lookup(join(name, 'index.styl'), this.paths, this.filename);

  // Expose imports
  imported.path = found;
  imported.dirname = dirname(found);
  this.paths.push(imported.dirname);

  // Nested imports
  if (importStack.length) this.paths.push(dirname(importStack[importStack.length - 1]));

  if (this.options._imports) this.options._imports.push(imported);

  // Throw if import failed
  if (!found) throw new Error('failed to locate @import file ' + path);

  // *******************************
  // MONKEY PATHING LIKE A BOSS

  importedFiles.push(found);

  // END OF THE MONKEY PATH
  //********************************


  // Parse the file
  importStack.push(found);
  Stylus.nodes.filename = found;

  var str = fs.readFileSync(found, 'utf8');
  if (literal) return new Stylus.nodes.Literal(str.replace(/\r\n?/g, "\n"));

  // parse
  var block = new Stylus.nodes.Block
    , parser = new Parser(str, Stylus.utils.merge({ root: block }, this.options));

  try {
    block = parser.parse();
  } catch (err) {
    err.filename = found;
    err.lineno = parser.lexer.lineno;
    err.input = str;
    throw err;
  }

  // Store the modified time
  fs.stat(found, function(err, stat){
    if (err) return;
    imported.mtime = stat.mtime;
  });

  // Evaluate imported "root"
  block.parent = root;
  block.scope = false;
  var ret = this.visit(block);
  this.paths.pop();
  importStack.pop();

  return ret;
};