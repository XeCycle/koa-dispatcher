var D = require("../");

var OC = Object.create;

describe("route()", function() {
  it("matches on request.path", function() {
    var cond = D.route("/route");
    cond(OC({ get path() { return "/route"; } })).should.be.ok;
    expect(cond(OC({ get path() { return "/another"; } }))).to.be.not.ok;
  });
  it("sets named parameters on request.params", function() {
    var request = OC({ get path() { return "/1/2"; } });
    D.route("/:a/:b")(request);
    request.params.should.eql({ a: "1", b: "2" });
  });
});

describe("method()", function() {
  it("matches on request.method", function() {
    var cond = D.method("get", "post");
    cond(OC({ get method() { return "POST"; } })).should.be.ok;
    expect(cond(OC({ get method() { return "DELETE"; } }))).to.be.not.ok;
  });
});

describe("header", function() {
  describe("header(field)", function() {
    it("checks field presence", function() {
      // header fields shall not be empty.
      var cond = D.header("field");
      cond(OC({ get header() { return { field: "value" }; } })).should.be.ok;
      expect(cond(OC({ get header() { return {}; } }))).to.be.not.ok;
    });
  });

  describe("header(field, value)", function() {
    it("checks casted equality of field to value", function() {
      var cond = D.header("field", 1);
      cond(OC({ get header() { return { field: "1" }; } })).should.be.ok;
      expect(cond(OC({ get header() { return { field: "2" }; } }))).to.be.not.ok;
    });
  });

  describe("header(field, pred)", function() {
    it("delegates to predicate on field", function() {
      var request = OC({ get header() { return { field: "value" }; } });
      D.header("field", function() { return true; })(request).should.be.ok;
      expect(D.header("field", function() {})(request)).to.be.not.ok;
    });
    it("delegates only when field is present", function() {
      var cond = D.header("field", function() {
        throw new Error("predicate should not be called when field is not present in header");
      });
      cond(OC({ get header() { return {}; } }));
    });
  });
});

describe("hostname", function() {
  describe("hostname()", function() {
    it("checks presence of hostname", function() {
      D.hostname()(OC({
        get hostname() { return "hostname"; }
      })).should.be.ok;
      expect(D.hostname()(OC({
        get hostname() {}
      }))).to.be.not.ok;
    });
  });
  describe("hostname(...names)", function() {
    it("checks presence of hostname in ...names", function() {
      var cond = D.hostname("foo", "bar");
      cond(OC({ get hostname() { return "bar"; } })).should.be.ok;
      expect(cond(OC({ get hostname() { return "baz"; } }))).to.be.not.ok;
    });
  });
});

describe("typeIs()", function() {
  it("delegates to request.is", function() {
    var request = OC({ is: sinon.spy() });
    D.typeIs("foo", "bar")(request);
    request.is.should.have.been.calledOnce.and.calledWithExactly("foo", "bar");
  });
});

describe("charset(...sets)", function() {
  it("passes if charset is unknown", function() {
    D.charset()(OC({ get charset() {} })).should.be.ok;
  });
  it("checks presence of charset in ...sets", function() {
    var cond = D.charset("foo", "bar");
    cond(OC({ get charset() { return "bar"; } })).should.be.ok;
    expect(cond(OC({ get charset() { return "baz"; } }))).to.be.not.ok;
  });
});
