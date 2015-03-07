module.exports = function acceptsEncodings(...condings) {
  return req => req.acceptsEncodings(...condings);
};
