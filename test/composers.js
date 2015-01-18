var $co = require("co");

var D = require("../");

describe("compose()", function() {
  it("referentially equals koa-compose", function() {
    D.compose.should.equal(require("koa-compose"));
  });
});

var ctx = { request: {} };

describe("when()", function() {

  function check(cond) {
    return new Promise(function(resolve) {
      var mw = D.when(cond, function*() { resolve(true); });
      var next = function*() { resolve(false); };
      var gen = D.compose([mw, next]);
      $co.wrap(gen).call(ctx);
    });
  }

  var syncTruthyValue = 1;
  var syncFalsyValue = 0;
  var syncTruthyFn = sinon.stub().returns(syncTruthyValue);
  var syncFalsyFn = sinon.stub().returns(syncFalsyValue);

  it("support sync values", function() {
    return Promise.all([
      check(syncTruthyValue).should.become(true),
      check(syncFalsyValue).should.become(false)
    ]);
  });

  it("support sync functions", function() {
    return Promise.all([
      check(syncTruthyFn).should.become(true).then(
        syncTruthyFn.should.have.been.calledOnce.and.calledWith(ctx.request)),
      check(syncFalsyFn).should.become(false).then(
        syncFalsyFn.should.have.been.calledOnce.and.calledWith(ctx.request))
    ]);
  });

  it("compose array handlers", function() {
    return (new Promise(function(resolve) {
      var mw = D.when(true, [function*() { resolve(true); }]);
      $co.wrap(mw).call(ctx);
    })).should.become(true);
  });

});

describe("awhen()", function() {
  var asyncTruthyValue = Promise.resolve(1);
  var asyncFalsyValue = Promise.resolve(0);
  var asyncTruthyFn = sinon.stub().returns(asyncTruthyValue);
  var asyncFalsyFn = sinon.stub().returns(asyncFalsyValue);

  function check(cond) {
    return new Promise(function(resolve) {
      var mw = D.awhen(cond, function*() { resolve(true); });
      var next = function*() { resolve(false); };
      var gen = D.compose([mw, next]);
      $co.wrap(gen).call(ctx);
    });
  }

  it("support async values", function() {
    return Promise.all([
      check(asyncTruthyValue).should.become(true),
      check(asyncFalsyValue).should.become(false)
    ]);
  });

  it("support async functions", function() {
    return Promise.all([
      check(asyncTruthyFn).should.become(true).then(
        asyncTruthyFn.should.have.been.calledOnce.and.calledWith(ctx.request)),
      check(asyncFalsyFn).should.become(false).then(
        asyncFalsyFn.should.have.been.calledOnce.and.calledWith(ctx.request))
    ]);
  });

  it("compose array handlers", function() {
    return (new Promise(function(resolve) {
      var mw = D.when(true, [function*() { resolve(true); }]);
      $co.wrap(mw).call(ctx);
    })).should.become(true);
  });
});
