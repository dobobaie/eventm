const Eventm = function() {
  const childEvent = function(name, options) {
    const _engine = {
      dataInCache: null,
      state: null,
      stack: []
    };

    // configuration promise
    const promise =
      (options.promise &&
        new Promise((resolve, reject) => {
          options.resolve = resolve;
          options.reject = reject;
        })) ||
      undefined;

    // execute callback
    const executeCallback = cb => {
      if (typeof(cb) !== "function") {
        return undefined;
      }
      if (options.promise === true) {
        return _engine.state === "reject"
          ? undefined
          : cb(_engine.dataInCache);
      }
      return cb(
        _engine.state === "reject" && _engine.dataInCache,
        _engine.state === "resolve" && _engine.dataInCache
      );
    }

    // state manager
    const setStateEvent = (state, forced) => data => {
      if (_engine.state !== null && !forced) {
        throw name + '_statement_is_already_set_to_' + _engine.state;
      }
      _engine.state = state;
      _engine.dataInCache = data;
      _engine.stack.map(cb => executeCallback(cb));
      if (options.promise === true) {
        _engine.state === 'resolve'
          ? options.resolve(_engine.dataInCache)
          : options.reject(_engine.dataInCache);
      }
      // _engine.stack = [];
    };

    this.getPromise = () => promise;
    this.resolveForced = setStateEvent('resolve', true);
    this.resolve = setStateEvent('resolve');
    this.reject = setStateEvent('reject');
    this.push = cb => {
      _engine.stack.push(cb) - 1;
      if (_engine.state !== null && options.keepSession) {
        executeCallback(cb);
      }
      return this.getPromise();
    };

    return this;
  }

  const listEvents = {};
  this.getEvent = name => listEvents[name];
  this.create = (name, options) => {
    // configuration options
    options = options || {};
    options = {
      keepSession:
        typeof options.keepSession === "boolean"
          ? options.keepSession
          : true,
      promise:
        typeof options.promise === "boolean"
          ? options.promise
          : true
    };

    // create new event
    listEvents[name] = listEvents[name] || new childEvent(name, options);
    return listEvents[name];
  };

  return this;
};

if (module && module.exports) {
  module.exports = Eventm;
}
