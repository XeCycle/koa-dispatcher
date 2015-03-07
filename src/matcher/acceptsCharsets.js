module.exports = function acceptsCharsets(...sets) {
  return req => req.acceptsCharsets(...sets);
};
