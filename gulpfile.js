var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("dist", function() {
  return gulp.src("src/**/*.js")
    .pipe(babel({
      blacklist: ["regenerator"]
    }))
    .pipe(gulp.dest("lib"));
});

gulp.task("default", ["dist"]);
