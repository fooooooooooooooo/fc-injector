const gulp = require('gulp');
const zip = require('gulp-zip');
const spawn = require('cross-spawn');
var electron = require('gulp-electron');
var packageJson = require('./src/package.json');

function buildRenderer(done) {
  var cmd = spawn('yarn', ['build-renderer'], { stdio: 'inherit' });
  cmd.on('close', function (code) {
    console.log('buildRenderer exited with code ' + code);
    done(code);
  });
}

function buildPreload(done) {
  var cmd = spawn('yarn', ['build-preload'], { stdio: 'inherit' });
  cmd.on('close', function (code) {
    console.log('buildPreload exited with code ' + code);
    done(code);
  });
}

function buildElectron(done) {
  var cmd = spawn('yarn', ['build-electron'], { stdio: 'inherit' });
  cmd.on('close', function (code) {
    console.log('buildElectron exited with code ' + code);
    done(code);
  });
}

function publishWindows(done) {
  gulp
    .src('.')
    .pipe(
      electron({
        asar: true,
        src: './packages/**/dist/**',
        packageJson: packageJson,
        release: './release',
        cache: './cache',
        version: '13.2.2',
        packaging: true,
        platforms: ['win64-64', 'win32-ia32'],
        platformResources: {
          win: {
            'version-string': packageJson.version,
            'file-version': packageJson.version,
            'product-version': packageJson.version,
            icon: './buildResources/icon.png',
          },
        },
      }),
    )
    .pipe(gulp.dest('./dist/windows'));

  done();
}

function packWin64(done) {
  gulp
    .src('dist/win-unpacked/*')
    .pipe(zip('fc-injector_win64.zip'))
    .pipe(gulp.dest('dist'));
  done();
}

function packWin32(done) {
  gulp
    .src('dist/win-ia32-unpacked/*')
    .pipe(zip('fc-injector_win32.zip'))
    .pipe(gulp.dest('dist'));

  done();
}

exports.buildRenderer = buildRenderer;
exports.buildPreload = buildPreload;
exports.buildElectron = buildElectron;

exports.publishWindows = publishWindows;

exports.packWin32 = packWin32;
exports.packWin64 = packWin64;

exports.pack = gulp.parallel(packWin32, packWin64);
exports.build = gulp.series(buildRenderer, buildPreload, buildElectron);

exports.default = gulp.series(exports.build, exports.pack);
