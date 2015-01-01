var waitForPort = require('../index'),
    helpers = require('./helpers'),
    net = require('net'),
    sinon = require('sinon'),
    should = require('should');

describe('retries', function() {

  var host = 'localhost', port = 0;

  var clock;
  before(function() { clock = sinon.useFakeTimers(); });
  after(function() { clock.restore(); });

  beforeEach(function(done) {
    helpers.nextRandomPort(function(err, next) {
      if (err) throw new Error(err);
      port = next;
      done();
    });
  });

  it('fails when run out of retries', function(done) {
    waitForPort(host, port, function(err) {
      done(err);
    });
    clock.tick(50000);
  });

});
