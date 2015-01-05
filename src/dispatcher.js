var compose = require("koa-compose");
var pathToReg = require("path-to-regexp");

// evaluates condition for request
function evalCond(req, cond) {
  if (typeof cond === "function")
    return Promise.resolve(cond(req));
  return Promise.resolve(cond);
}

var $d = {
  compose,
  // returns a middleware function which:
  // if condition passes, invokes handler; else yield next.
  // if handler is an array it is composed by koa-compose.
  when(condition, handler) {
    if (handler instanceof Array)
      handler = compose(handler);
    return function*(next) {
      if (yield evalCond(this.request, condition))
        yield* handler.call(this, next);
      else yield next;
    };
  },
  // helpers to combine conditions
  and(...conds) {
    if (conds.length === 0) return () => Promise.resolve(true);
    return req => (function next(i) {
      return evalCond(req, conds[i]).then(
        ok => i+1<conds.length
          ? ok && next(i+1)
          : ok
      );
    })(0);
  },
  or(...conds) {
    if (conds.length === 0) return () => Promise.resolve(false);
    return req => (function next(i) {
      return evalCond(req, conds[i]).then(
        ok => i+1<conds.length
          ? ok || next(i+1)
          : ok
      );
    })(0);
  },
  not(cond) {
    return req => evalCond(req, cond).then(v => !v);
  },
  // common matchings
  route(path, opts) {
    var keys = [];
    var reg = pathToReg(path, keys, opts);
    return req => {
      var match = reg.exec(req.url);
      if (match) {
        if (!(req.params instanceof Object))
          req.params = {};
        req.params.should.be.instanceof(Object);
        for (let i=1; i<match.length; ++i)
          req.params[keys[i-1].name] = match[i];
        return true;
      }
    };
  },
  method(...methods) {
    return req => methods.find(m => m.toUpperCase() === req.method);
  },
  accepts(...types) {
    return req => req.accepts(...types);
  }
};
