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
      if (options.promise) {
        _engine.state === 'resolve'
          ? options.resolve(_engine.dataInCache)
          : options.reject(_engine.dataInCache);
      }
      if (typeof(cb) !== "function") {
        return undefined;
      }
      if (options.disableErrorParameter && _engine.state === "resolve") {
        return cb(_engine.dataInCache);
      }
      return cb(
        _engine.state === "reject" && _engine.dataInCache,
        _engine.state === "resolve" && _engine.dataInCache
      );
    }

    // state manager
    const setStateEvent = state => data => {
      if (_engine.state !== null) {
        throw name + '_statement_is_already_set_to_' + _engine.state;
      }
      _engine.state = state;
      _engine.dataInCache = data;
      _engine.stack.map(cb => executeCallback(cb));
      _engine.stack = [];
    };

    this.getPromise = () => promise;
    this.resolve = setStateEvent('resolve');
    this.reject = setStateEvent('reject');
    this.push = cb => {
      if (_engine.state !== null && options.keepSession) {
        return executeCallback(cb);
      }
      const elemId = _engine.stack.push(cb) - 1;
      return elemId;
    };

    return this;
  }

  const listEvents = {};
  this.getEvent = name => listEvents[name];
  this.create = (name, cb, options) => {
    // configuration options
    options = {
      keepSession:
        options && typeof options.keepSession === "boolean"
          ? options.keepSession
          : true,
      disableErrorParameter:
        options && typeof options.disableErrorParameter === "boolean"
          ? options.disableErrorParameter
          : false,
      promise:
        options && typeof options.promise === "boolean"
          ? options.promise
          : false
    };

    // create new event
    listEvents[name] = listEvents[name] || new childEvent(name, options);
    listEvents[name].push(cb);
    return listEvents[name].getPromise();
  };

  return this;
};

if (module && module.exports) {
  module.exports = Eventm;
}
