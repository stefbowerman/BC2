const gulp = require('gulp');
const eslint = require('gulp-eslint');
const config = require('../config');

gulp.task('eslint', () => {
  return gulp.src(['src/src_scripts/**/*.js'])
    .pipe(eslint('.eslintrc'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});