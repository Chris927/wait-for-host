var waitForPort = require('../index'),
    net = require('net'),
    sinon = require('sinon'),
    should = require('should'),
    helpers = require('./helpers');

describe('waitForPort', function() {

  var clock;
  before(function() { clock = sinon.useFakeTimers(); });
  after(function() { clock.restore(); });

  function tryToConnect(host, port, cb) {
    var client = net.createConnection(port, host, function() {
      console.log('connected!');
      client.end();
      cb(null);
    });
  }

  describe('when port is not open', function() {

    var host = 'localhost', port;
    var server = null;

    before(function(done) {
      helpers.nextRandomPort(function(err, next) {
        port = next;
        done(err);
      });
    });

    beforeEach(function() {
      server = net.createServer();
    });
    afterEach(function(done) {
      server.close(done);
    });

    it('calls us back', function(done) {

      var portIsReady = false;
      waitForPort(host, port, function(err) {
        if (err) return done(err);
        portIsReady.should.be.true;
        done(); // called more than once?
      });
      server.listen(port, function() {
        console.log('server is now listening...');
        portIsReady = true;
      });
      clock.tick(10); // TODO: magic number

    });

  });

  describe('when port is open already', function() {

    var host = 'localhost', port;
    var server;

    before(function(done) {
      server = net.createServer();
      server.listen(0 /* any port */, function() {
        var address = server.address();
        port = address.port;
        console.log('listening on port ' + port);
        done();
      });
    });
    after(function(done) {
      server.close(function() {
        console.log('server closed');
        done();
      });
    });
    it('calls us back', function(done) {
      waitForPort(host, port, function(err) {

        // no error
        (err === null).should.be.true;

        // can we connect?
        tryToConnect(host, port, done);

      });
    });
  });

  describe('retries', function() {
    var host = 'localhost', port;
    beforeEach(function(done) {
      helpers.nextRandomPort(function(err, next) {
        port = next;
        done(err);
      });
    });
    it('fails if no server and we run out of retries', function(done) {
      waitForPort(host, port, function(err) {
        err.should.match(/out of retries/);
        done();
      });
      clock.tick(5000); // TODO: magic number
    })
  });

});
