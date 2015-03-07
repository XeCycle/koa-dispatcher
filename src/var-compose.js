module.exports = function variadicCompose(handlers) {
  return function*(next, ...args) {
    return yield* handlers.reduceRight(
      (next, curr) => curr.apply(this, [next, ...args]),
      next || noop()
    );
  };
};

function* noop() {}
