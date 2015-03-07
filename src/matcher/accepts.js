module.exports = function accepts(...types) {
  return req => req.accepts(...types);
};
