// First, we require `expect` from Chai.
var chai = require('chai'),
    expect = chai.expect,
    request = require('supertest'),
    app   = require('express')(),
    gget = require('..');

var port = 3000;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.use('/api/resources', gget(3000));

app.get('/api/users', function (req, res) {

  setTimeout(function () {
    var user = {
      'name': 'Nicolas',
      'age': 28
    };

    res.json(user);
  }, getRandomInt(400, 1000));
});

app.get('/api/countries', function (req, res) {

  setTimeout(function () {
    var countries = [
      'USA',
      'Japan',
      'Canada'
    ];

    res.json(countries);
  }, getRandomInt(400, 1000));
});

app.get('/api/customers/:id', function (req, res) {
  setTimeout(function () {
    var customers = {
      23: 'John Doe',
    };

    res.json(customers);
  }, getRandomInt(400, 1000));
});

var server = app.listen(3000);

describe('Basic tests for module:', function() {

  it('Module should export a function', function() {
    expect(gget(port)).to.be.an('function');
  });
});

describe('Test GGET middleware:', function() {

  it('Check Express.js based API /api/users', function() {
    request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
      });
  });

  it('A request to GGET without parameters', function() {
    request(app)
      .get('/api/resources')
      .expect(500)
      .end(function(err, res){
        if (err) throw err;
      });
  });

  it('A request to GGET with multiple parameters', function() {
    request(app)
      .get('/api/resources?users=api/users&customer=api/customers/23&countries=api/countries')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '122')
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
      });
  });

  it('A request to GGET with multiple parameters, including non-existing APIs', function(done){
    request(app)
      .get('/api/resources?countries=api/countries&foo=bar&fizz=api/buzz/12')
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body.countries = JSON.parse(res.body.countries);
      })
      .expect(200, {
        countries: [
          'USA',
          'Japan',
          'Canada'
        ],
        foo: null,
        fizz: null
      }, done);
  });
});
