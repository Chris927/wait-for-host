var net = require('net');

module.exports = function(host, port, cb) {
  var retriesRemaining = 10; // TODO: unused, options
  var socket = null;
  function tryToConnect() {
    if (socket) socket.destroy();
    console.log('trying to connect...');
    var socket = net.createConnection(port, host, function(err) {
      console.log('err', err);
      socket.destroy();
      cb(null);
    });
    socket.setTimeout(10); // TODO: options
    socket.on('timeout', tryToConnect)
    socket.on('error', tryToConnect);
  }
  tryToConnect();
};
