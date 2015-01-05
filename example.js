var koa = require("koa");
var D = require("koa-dispatcher");

var server = koa();

var api;
{
  let {compose, when, route, method, accepts} = D;
  api = compose([
    when(route("/"), [
      when(method("get"), function*() { this.body = "GET"; }),
      when(method("post"), function*() { this.body = "POST"; }),
      function*() { this.body = "not supported"; }]),
    when(D.and(route("/:name"), method("get")), [
      when(accepts("json"), function*() { this.body = { name: this.request.params.name }; }),
      when(accepts("text"), function*() { this.body = "Name: "+this.request.params.name; })])
  ]);
}

server.use(function*(next) {
  console.log(this.request);
  yield next;
});
server.use(api);

server.listen(8080);
