var gulp = require("gulp");
var umd = require("gulp-umd");
var to5 = require("gulp-6to5");
var $cp = require("child_process");

gulp.task("dist", function() {
  return gulp.src("src/*.js")
    .pipe(to5({
      blacklist: ["generators"]
    }))
    .pipe(umd({
      exports: function() { return "$d"; },
      namespace: function() { return "koaDispatcher"; }
    }))
    .pipe(gulp.dest("lib"));
});

gulp.task("default", ["dist"]);

gulp.task("test", ["default"], function(done) {
  var mocha = $cp.spawn("mocha", ["--harmony", "--require", "./test"], {
    stdio: "inherit"
  });
  mocha.on("exit", function(code, signal) {
    done(signal || code);
  });
});
