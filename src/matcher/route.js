var pathToReg = require("path-to-regexp");

module.exports = function route(path, opts) {
  var keys = [];
  var reg = pathToReg(path, keys, opts);
  return req => {
    var match = reg.exec(req.path);
    return match && toParamsObject(keys, match);
  };
};

function toParamsObject(keys, match) {
  return keys.reduce((params, key, i) => {
    params[key.name] = key.repeat ? match[i+1].split(key.delimiter) : match[i+1];
    return params;
  }, {});
}
