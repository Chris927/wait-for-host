var net = require('net');

module.exports = function(host, port, cb) {

  var retriesRemaining = 10; // TODO: options
  var timer = null, socket = null;

  function clearTimerAndDestroySocket() {
    clearTimeout(timer);
    timer = null;
    if (socket) socket.destroy();
    socket = null;
  }

  function retry() {
    console.log('about to clear timeout and retry, port=' + port + ', retriesRemaining=' + retriesRemaining);
    tryToConnect();
  };

  function tryToConnect() {

    clearTimerAndDestroySocket();

    if (--retriesRemaining < 1) return cb(new Error('out of retries'));

    socket = net.createConnection(port, host, function(err) {
      console.log('connected!');
      clearTimerAndDestroySocket();
      if (retriesRemaining > 0) cb(null);
    });

    timer = setTimeout(function() { retry(); }, 100); // TODO: options

    socket.on('error', function(err) {
      console.log('error', err);
      clearTimerAndDestroySocket();
      setTimeout(retry, 100); // TODO: magic number
    });
  }

  tryToConnect();

};
