// First, we require `expect` from Chai.
var chai = require('chai'),
    expect = chai.expect,
    app   = require('express')(),
    gget = require('..');

var port = 3000;

describe('Basic tests for module:', function() {

  it('module should export a function', function() {

    expect(gget(port)).to.be.an('function');

  });
});

