const gulp = require('gulp');
const zip = require('gulp-zip');

function packWin64(cb) {
  gulp
    .src('dist/win-unpacked/*')
    .pipe(zip('fc-injector_win64.zip'))
    .pipe(gulp.dest('dist'));
  cb();
}

function packWin32(cb) {
  gulp
    .src('dist/win-ia32-unpacked/*')
    .pipe(zip('fc-injector_win32.zip'))
    .pipe(gulp.dest('dist'));

  cb();
}

exports.packWin32 = packWin32;
exports.packWin64 = packWin64;

exports.default = gulp.parallel(packWin32, packWin64);
