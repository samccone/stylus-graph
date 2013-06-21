var mocha             = require('mocha');
var assert            = require('assert');

var stylusAssetGraph  = require('../index.js');


describe("find imports", function() {
  it("should find 0 imports", function() {
    d = stylusAssetGraph.getDependencies(__dirname + '/sample_files/simple.styl');
    assert.equal(0, d.length);
  });

  it("should find 1 import", function() {
    d = stylusAssetGraph.getDependencies(__dirname + '/sample_files/sample.styl');
    assert.equal(1, d.length);
  });

  it("should find 2 imports", function() {
    d = stylusAssetGraph.getDependencies(__dirname + '/sample_files/nested.styl');
    assert.equal(2, d.length);
  });

});