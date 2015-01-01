var waitForPort = require('../index'),
    net = require('net');

var should = require('should');

describe('waitForPort', function() {
  var host = 'localhost', port = 34887;
  describe('when port is open already', function() {
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
        var client = net.createConnection(port, host, function() {
          console.log('connected!');
          client.end();
          done();
        });
      });
    });
  });
});
