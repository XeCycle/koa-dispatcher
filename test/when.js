var {inspect} = require("util");

describe("when()", function() {
  var when = require("../src/when");

  function check(ctx, args, cond, passing, failing) {
    var mw = when(cond, function*(...args) { passing(...args); });
    var next = (function*() { failing(); })();
    for (let yieldable of mw.call(ctx, next, ...args))
      if (typeof yieldable.next === "function")
        yieldable.next();
    return next;
  }

  // Not all passing values covered.
  var passingValues = [
    true, 0, 1, 0.1, Infinity, -Infinity, NaN, "str", "", [], {}
  ];

  // These are the only values to fail.
  var failingValues = [
    false, null, undefined
  ];

  var ctx = { request: {} };

  describe("condition checking", function() {
    passingValues.forEach(val => {
      it("passes for "+inspect(val), function() {
        var passing = sinon.spy();
        var failing = () => { throw new Error("this value failed"); };
        check(ctx, [], req => val, passing, failing);
        return passing.should.be.called;
      });
    });
    failingValues.forEach(val => {
      it("failes for "+inspect(val), function() {
        var passing = () => { throw new Error("this value should fail"); };
        var failing = sinon.spy();
        check(ctx, [], req => val, passing, failing);
        return failing.should.be.called;
      });
    });
  });

  describe("if passed", function() {
    var passing = sinon.spy();
    var failing = sinon.spy();
    var cond = sinon.spy(req => true);
    var next;
    before(function() {
      next = check(ctx, [1, 2], cond, passing, failing);
    });

    it("calls condition only once and synchronously", function() {
      return cond.should.be.calledOnce;
    });

    it("yields into the handler only once and synchronously", function() {
      return passing.should.be.calledOnce;
    });

    it("does not yield to next", function() {
      return failing.should.not.be.called;
    });

    it("provides the handler with given next", function() {
      return next.should.equal(passing.args[0][0]);
    });

    it("provides the handler with condition returned value before upstream values", function() {
      return passing.args[0].slice(1).should.eql([true, 1, 2]);
    });
  });

  describe("if failed", function() {
    var passing = sinon.spy();
    var failing = sinon.spy();
    var cond = sinon.spy(req => false);
    var next;
    before(function() {
      next = check(ctx, [1, 2], cond, passing, failing);
    });

    it("calls condition only once and synchronously", function() {
      return cond.should.be.calledOnce;
    });

    it("does not yield into the handler", function() {
      return passing.should.not.be.called;
    });

    it("yields to next only once and synchronously", function() {
      return failing.should.be.calledOnce;
    });
  });

});
