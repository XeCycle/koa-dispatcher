module.exports = function acceptsLanguages(...langs) {
  return req => req.acceptsLanguages(...langs);
};
