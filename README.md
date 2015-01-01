# What?

Implements a single NodeJS function to wait for host/port to become available.
Once available, a callback is called.

Example:

```javascript
var waitForPort = require('wait-for-port');

waitForPort('my-host.com', 22, function(err) {
  if (err) throw new Error(err);
  // .. now we know that (at least for now) my-host.com is
  // listening on port 22
});
```

Check [the specs](./test/all.js) for details and options.

# Why?

This is useful e.g. when provisioning cloud stuff, e.g. call the EC2 API from
Javascript to create instances, then wait for ssh to become available on all
the hosts.
