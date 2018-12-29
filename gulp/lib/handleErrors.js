const browserSync = require('browser-sync');// .create();
const notify = require('gulp-notify');

module.exports = (errorObject) => {
  const errSting = errorObject.toString().split(': ').join(':\n');

  // var sep = gutil.colors.black("\n\n"+'---------------------------------------'+"\n\n");

  // gutil.log(sep, errSting, sep);
  console.log(errorObject);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: errSting
  });

  // Keep gulp from hanging on this task
  // if (typeof this.emit === 'function') this.emit('end');

  browserSync.notify(errSting);
};
