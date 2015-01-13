var $co = require("co");

var D = require("../");

describe("compose()", function() {
  it("referentially equals koa-compose", function() {
    D.compose.should.equal(require("koa-compose"));
  });
});

describe("when()", function() {
  var ctx = { request: {} };

  var syncTruthyValue = 1;
  var syncFalsyValue = 0;
  var asyncTruthyValue = Promise.resolve(syncTruthyValue);
  var asyncFalsyValue = Promise.resolve(syncFalsyValue);
  var syncTruthyFn = sinon.stub().returns(syncTruthyValue);
  var syncFalsyFn = sinon.stub().returns(syncFalsyValue);
  var asyncTruthyFn = sinon.stub().returns(asyncTruthyValue);
  var asyncFalsyFn = sinon.stub().returns(asyncFalsyValue);

  function check(cond) {
    return new Promise(function(resolve) {
      var mw = D.when(cond, function*() { resolve(true); });
      var next = function*() { resolve(false); };
      var gen = D.compose([mw, next]);
      $co.wrap(gen).call(ctx);
    });
  }

  describe("support for plain values", function() {
    it("sync", function() {
      return Promise.all([
        check(syncTruthyValue).should.become(true),
        check(syncFalsyValue).should.become(false)
      ]);
    });
    it("async", function() {
      return Promise.all([
        check(asyncTruthyValue).should.become(true),
        check(asyncFalsyValue).should.become(false)
      ]);
    });
  });

  describe("support for functions", function() {
    it("sync", function() {
      return Promise.all([
        check(syncTruthyFn).should.become(true).then(
          syncTruthyFn.should.have.been.calledOnce.and.calledWith(ctx.request)),
        check(syncFalsyFn).should.become(false).then(
          syncFalsyFn.should.have.been.calledOnce.and.calledWith(ctx.request))
      ]);
    });
    it("async", function() {
      return Promise.all([
        check(asyncTruthyFn).should.become(true).then(
          asyncTruthyFn.should.have.been.calledOnce.and.calledWith(ctx.request)),
        check(asyncFalsyFn).should.become(false).then(
          asyncFalsyFn.should.have.been.calledOnce.and.calledWith(ctx.request))
      ]);
    });
  });

  it("compose array handlers", function() {
    return new Promise(function(resolve) {
      var mw = D.when(true, [function*() { resolve(true); }]);
      $co.wrap(mw).call(ctx);
    });
  });

});
