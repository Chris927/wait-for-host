var net = require('net');

module.exports = function(host, port, cb) {

  var retriesRemaining = 10; // TODO: options
  var timer = null, socket = null;

  function tryToConnect() {

    clearTimerAndDestroySocket();

    if (--retriesRemaining < 1) return cb(new Error('out of retries'));

    socket = net.createConnection(port, host, function(err) {
      console.log('connected!');
      clearTimerAndDestroySocket();
      if (retriesRemaining > 0) cb(null);
    });

    function clearTimerAndDestroySocket() {
      clearTimeout(timer);
      timer = null;
      if (socket) socket.destroy();
      socket = null;
    }

    function destroySocketAndRetry() {
      console.log('about to clear timeout and retry, port=' + port + ', retriesRemaining=' + retriesRemaining);
      // clearTimerAndDestroySocket();
      tryToConnect();
    };

    timer = setTimeout(function() {
      destroySocketAndRetry();
    }, 5); // TODO: options

    socket.on('error', function(err) {
      console.log('error', err);
      clearTimerAndDestroySocket();
      setTimeout(destroySocketAndRetry, 1); // TODO: magic number
    });
  }

  tryToConnect();

};
