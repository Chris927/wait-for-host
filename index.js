var net = require('net');

module.exports = function(host, port, options, cb) {

  // allow for missing options
  if (typeof options == "function") {
    cb = options;
    options = {};
  }

  var retriesRemaining = options.numRetries || 10;
  var retryInterval = options.retryInterval || 1000;
  var timer = null, socket = null;

  if (!(retriesRemaining > 0)) throw new Error('invalid value for option "numRetries"');
  if (!(retryInterval > 0)) throw new Error('invalid value for option "retryInterval"');

  function clearTimerAndDestroySocket() {
    clearTimeout(timer);
    timer = null;
    if (socket) socket.destroy();
    socket = null;
  }

  function retry() {
    console.log('about to clear timeout and retry, port=' + port + ', retriesRemaining=' + retriesRemaining + ', key=' + options.key);
    tryToConnect();
  };

  function tryToConnect() {

    clearTimerAndDestroySocket();

    if (--retriesRemaining < 0) return cb(new Error('out of retries'));

    socket = net.createConnection(port, host, function(err) {
      console.log('connected!');
      clearTimerAndDestroySocket();
      if (retriesRemaining > 0) cb(null);
    });

    timer = setTimeout(function() { retry(); }, retryInterval);

    socket.on('error', function(err) {
      console.log('error', err);
      clearTimerAndDestroySocket();
      setTimeout(retry, retryInterval);
    });
  }

  tryToConnect();

};
