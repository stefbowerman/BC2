const config = require('../config');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const bundleLogger = require('../lib/bundleLogger');
const gulp = require('gulp');
const es2015ie = require('babel-preset-es2015-ie');
const handleErrors = require('../lib/handleErrors');
const mergeStream = require('merge-stream');
const opts = require('minimist')(process.argv.slice(2));
const path = require('path');
const size = require('gulp-size');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const uglifyify = require('uglifyify');
const insert = require('gulp-insert');
const watchify = require('watchify');

const browserifyThis = (bundleConfig) => {
  const paths = {
    src: path.join(config.root.jsSrc, bundleConfig.entries),
    dest: path.join(config.root.jsDest)
  };

  // config our bundle setup.
  Object.assign(bundleConfig, watchify.args, { debug: false, entries: paths.src });

  let b = browserify(bundleConfig)
    .transform(babelify, {presets: [es2015ie], extensions: ['.js', '.ts']});

  if (opts.minify) {
    b.transform(uglifyify);
  }

  const bundle = () => {
    bundleLogger.start(paths.src);

    return b.bundle()
      .on('error', handleErrors)
      .pipe(source(bundleConfig.outputName))
      .pipe(buffer()) // optional, remove if no need to buffer file contents
      .pipe(gulpif(opts.minify, uglify()))
      .pipe(gulp.dest(paths.dest))
      .pipe(size({showFiles: true, title: 'JS size of'}));
  };

  b = watchify(b);
   // Rebundle on update
  b.on('update', bundle);
  bundleLogger.watch(paths.src);

  return bundle();
};


gulp.task('browserify', () => {
  // Start bundling with Browserify for each bundleConfig specified
  return mergeStream.apply(gulp, config.tasks.scripts.bundles.map(browserifyThis));
});
