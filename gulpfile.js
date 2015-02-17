var gulp = require('gulp')
var connect = require('gulp-connect')
var watch = require('gulp-watch')
var stylus = require('gulp-stylus')
var plumber = require('gulp-plumber')
var gutil = require('gulp-util')
var watchify = require('watchify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')

var onError = function (err) {
  gutil.beep()
  gutil.log(gutil.colors.red('Error:\n ' + err.message))
}

var onTime = function(time) {
  gutil.log(gutil.colors.green('JS generated in ' + time + 'ms.'))
}

var bundler = watchify(browserify('./dev/js/app.js', watchify.args))

var bundle = function() {
  return bundler.bundle()
    .on('error', onError)
    .pipe(source('app.js'))
    .pipe(gulp.dest('build'))
}

bundler.on('update', bundle)
bundler.on('time', onTime)

var style = function() {
  gulp.src('dev/css/main.styl')
    .pipe(watch('dev/css/**/*.styl'))
    .pipe(plumber({errorHandler: onError}))
    .pipe(stylus())
    .pipe(gulp.dest('build'))
}

var connectServer = function() {
  connect.server({
    root: 'build',
    livereload: true,
  })
  watch('build/*').pipe(connect.reload())
}

gulp.task('js', bundle)
gulp.task('css', style)
gulp.task('server', connectServer)
gulp.task('dev', ['js', 'css', 'server'])

