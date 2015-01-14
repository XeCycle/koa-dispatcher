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
      var match = reg.exec(req.path);
      if (match) {
        if (!(req.params instanceof Object))
          req.params = {};
        for (let i=1; i<match.length; ++i)
          req.params[keys[i-1].name] = match[i];
        return true;
      }
    };
  },
  method() {
    var methods = Array.prototype.map.call(arguments, m => m.toUpperCase());
    return req => methods.indexOf(req.method) >= 0;
  },
  accepts(...types) {
    return req => req.accepts(...types);
  },
  acceptsEncodings(...codings) {
    return req => req.acceptsEncodings(...codings);
  },
  acceptsCharsets(...sets) {
    return req => req.acceptsCharsets(...sets);
  },
  acceptsLanguages(...langs) {
    return req => req.acceptsLanguages(...langs);
  },
  header(field, valueOrPred) {
    if (arguments.length === 1)
      return req => req.header[field];
    if (typeof valueOrPred === "function")
      return req => field in req.header && valueOrPred(req.header[field]);
    return req => req.header[field] == valueOrPred;
  },
  hostname() {
    var names = arguments;
    if (names.length)
      return req => Array.prototype.indexOf.call(names, req.hostname) >= 0;
    return req => req.hostname;
  },
  typeIs() {
    var types = arguments;
    return req => req.is.apply(this, types);
  },
  charset() {
    var sets = arguments;
    return req => req.charset === undefined ||
      Array.prototype.indexOf.call(sets, req.charset) >= 0;
  },
  fresh() {
    return req => req.fresh;
  },
  stale() {
    return req => req.stale;
  },
  protocol(prot) {
    return req => req.protocol === prot;
  },
  secure() {
    return req => req.secure;
  },
  ip(match) {
    var pattern = new RegExp(match
                             .replace(/\./g, "\\.")
                             .replace(/\*/g, "[0-9]+"));
    return req => pattern.test(req.ip);
  },
  subdomain(domain) {
    return req => req.subdomains.reverse().join(".") === domain;
  }
};
