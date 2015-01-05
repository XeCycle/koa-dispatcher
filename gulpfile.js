var gulp = require("gulp");
var umd = require("gulp-umd");
var to5 = require("gulp-6to5");

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
