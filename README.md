# koa-dispatcher

[![Build Status](https://travis-ci.org/XeCycle/koa-dispatcher.svg?branch=master)](https://travis-ci.org/XeCycle/koa-dispatcher)
[![Dependency Status](https://img.shields.io/david/XeCycle/koa-dispatcher.svg)](https://david-dm.org/XeCycle/koa-dispatcher)
[![DevDependency Status](https://img.shields.io/david/dev/XeCycle/koa-dispatcher.svg)](https://david-dm.org/XeCycle/koa-dispatcher)

The name "dispatcher" is actually misleading.  It could be better
named "koa-composer", as it composes multiple handlers into one,
using flexible rules to decide the handler(s) to execute; but I
named it "dispatcher", to avoid unnecessary confusions with the
existing (and used in koa core) `koa-compose`.

Documentation is to be updated to reflect the recent major refactor.
