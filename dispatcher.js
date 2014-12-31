/**
 * @file koa dispatcher
 */

Define(["koa-compose", "path-to-regexp"], function(compose, pathToReg) {
  var GeneratorFunction = (function*() {}).constructor;

  // evaluates condition in request context
  // not the full context, to prevent unwanted behaviour
  function evalCond(req, cond) {
    if (cond instanceof GeneratorFunction)
      return cond.call(req, req);
    if (cond instanceof Function)
      return Promise.resolve(cond.call(req, req));
    return Promise.resolve(cond);
  }

  var $d;
  /* jshint -W093 */
  return $d = {
    compose,
    // returns a middleware function which:
    // if condition passes, invoke koa-compose(handlers).
    when(condition, ...handlers) {
      var handler = compose(handlers);
      return function*(next) {
        if (yield evalCond(this.request, condition))
          yield* handler.call(this, next);
        else yield next;
      };
    },
    // helpers to combine conditions
    and(...conds) {
      return function*() {
        for (let cond of conds)
          if (!yield evalCond(this, cond))
            return false;
        return true;
      };
    },
    or(...conds) {
      return function*() {
        for (let cond of conds)
          if (yield evalCond(this, cond))
            return true;
        return false;
      };
    },
    not(cond) {
      return function*() {
        return !yield evalCond(this, cond);
      };
    },
    // common matchings
    route(path, opts) {
      var keys = [];
      var reg = pathToReg(path, keys, opts);
      return function() {
        var match = reg.exec(this.url);
        if (match) {
          if (!(this.params instanceof Object))
            this.params = {};
          this.params.should.be.instanceof(Object);
          for (let i=1; i<match.length; ++i)
            this.params[keys[i-1].name] = match[i];
          return true;
        }
      };
    },
    method(...methods) {
      return function() {
        return methods.find(method => method.toUpperCase() === this.method);
      };
    },
    accepts(...types) {
      return function() {
        return this.accepts(...types);
      };
    }
  };
  /* jshint +W093 */
});
