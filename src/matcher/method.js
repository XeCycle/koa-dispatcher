module.exports = function method(...methods) {
  var normalizedMethods = methods.map(str => str.toUpperCase());
  return req => {
    var i = normalizedMethods.indexOf(req.method);
    return i >= 0 && methods[i];
  };
};
