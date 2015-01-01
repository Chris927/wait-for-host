var waitForPort = require('../index'),
    net = require('net'),
    sinon = require('sinon');

var should = require('should');

describe('waitForPort', function() {
  function tryToConnect(host, port, cb) {
    var client = net.createConnection(port, host, function() {
      console.log('connected!');
      client.end();
      cb(null);
    });
  }

  describe('when port is not open', function() {

    var host = 'localhost', port = 34888; // TODO: using different port number than below, as async specs may overlap
    var clock, server = null;

    // TODO: fake timers don't work as expected, as waitForPort uses socket
    // timeout, which seems unaffected by fake timers
    before(function() { clock = sinon.useFakeTimers(); });
    after(function() { clock.restore(); });

    afterEach(function(done) {
      server.close(done);
    });

    it('calls us back', function(done) {

      var portIsReady = false;
      waitForPort(host, port, function(err) {
        portIsReady.should.be.true;
        done();
      });
      server = net.createServer();
      server.listen(port, function() {
        console.log('server is now listening...');
        portIsReady = true;
      });

    });

  });

  describe('when port is open already', function() {

    var host = 'localhost', port = 34887;
    var server;

    beforeEach(function(done) {
      server = net.createServer();
      server.listen(port, function() {
        console.log('listening on port ' + port);
        done();
      });
    });
    afterEach(function(done) {
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
});
