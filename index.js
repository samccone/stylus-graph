var _             = require('underscore');
var fs            = require('fs');
var dirname       = require('path').dirname;
var Stylus        = require('stylus');

require('./lib/import-monkey-patch');

exports.getDependencies = function(path) {
  var basePath = dirname(path);
  var contents = fs.readFileSync(path, "utf8");

  evaluator    = new Stylus.Evaluator('', {paths: [basePath]});
  parser       = new Stylus.Parser(contents);
  exp          = parser.parse();

  evaluator.visit(exp);

  return _.uniq(importedFiles);
}