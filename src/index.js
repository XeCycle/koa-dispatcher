var $d = {
  // dispatchers
  compose: require("./var-compose"),
  when: require("./when"),
  awhen: require("./awhen"),
};

// matchers
[
  "accepts",
  "acceptsCharsets",
  "acceptsEncodings",
  "acceptsLanguages",
  "header",
  "method",
  "route"
].forEach(matcher => $d[matcher] = require("./matcher/"+matcher));

module.exports = $d;
