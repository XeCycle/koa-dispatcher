global.chai = require("chai");
global.expect = chai.expect;
chai.should();
chai.use(require("chai-as-promised"));

global.sinon = require("sinon");
chai.use(require("sinon-chai"));

require("babel-core/register")({
  blacklist: ["regenerator"]
});
