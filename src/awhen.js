module.exports = function awhen(condition, handler) {
  return function*(next, ...args) {
    var result = yield condition(this.request);
    if (result == null || result === false)
      return yield next;
    yield* handler.apply(this, [next, result, ...args]);
  };
};
