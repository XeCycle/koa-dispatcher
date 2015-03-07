module.exports = function header(field, valueOrPred) {
  if (arguments.length === 1)
    return req => req.header[field];
  if (typeof valueOrPred === "function")
    return req => field in req.header && valueOrPred(req.header[field]);
  return req => req.header[field] == valueOrPred && valueOrPred;
};
