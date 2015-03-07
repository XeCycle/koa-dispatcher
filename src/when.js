module.exports = function when(condition, handler) {
  return function*(next, ...args) {
    var result = condition(this.request);
    if (result == null || result === false)
      return yield next;
    return yield* handler.apply(this, [next, result, ...args]);
  };
};
