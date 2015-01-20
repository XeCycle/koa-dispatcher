# koa-dispatcher

[![Build Status](https://travis-ci.org/XeCycle/koa-dispatcher.svg?branch=master)](https://travis-ci.org/XeCycle/koa-dispatcher)
[![Dependency Status](https://img.shields.io/david/XeCycle/koa-dispatcher.svg)](https://david-dm.org/XeCycle/koa-dispatcher)
[![DevDependency Status](https://img.shields.io/david/dev/XeCycle/koa-dispatcher.svg)](https://david-dm.org/XeCycle/koa-dispatcher)

The name "dispatcher" is actually misleading.  It could be better
named "koa-composer", as it composes multiple handlers into one,
using flexible rules to decide the handler(s) to execute; but I
named it "dispatcher", to avoid unnecessary confusions with the
existing (and used in koa core) `koa-compose`.

Assuming you did `var D = require("koa-dispatcher")`:

- `D.when(condition, handler(s))` is the main entry to this
  library.  It returns the composed middleware from handler(s).
  `condition` is a value or function called with koa request
  object; if the value or returned value is truthy, `handler(s)`
  are executed, otherwise yield next.  `handler(s)` may be a
  single generator function, or an array of generator functions,
  in which case it is stacked up by `koa-compose`.  If
  `condition` is a function it is called only once for a request.

- `D.awhen(condition, handlers(s))` is similar to above, but for
  async values or functions.  The value or returned value shall
  be a ES6 compatible `Promise`.

- `D.compose` is exactly the same as `koa-compose`.

- `D.acceptCase([types], table like { type: handler, ... })` does
  `this.accepts(...types)`, if the returned type is found in
  table, executes that handler.  Also composes array handlers.
  If `types` is not given, it is obtained by
  `Object.keys(table)`.

The provided condition functions are:

- `D.route(path, opts)`: `path` and `opts` passed to
  `path-to-regexp`.  If the request route matches, sets params
  (if any) on `request.params`.

- `D.method(...methods)`: whether the request method is one of
  `methods`.

- `D.accepts(...types)`: same as `request.accepts(...types)`.

TODO
----

Add more condition functions.

Add unit tests.

`0.1.0` will be released when condition functions cover most of
koa request object, and unit tests cover all of them.  By that
release `and`, `or`, `not` will be removed.
