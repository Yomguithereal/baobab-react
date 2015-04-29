'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

gulp.task("build:mixins", function() {
  var b = browserify({
    entries: './build.js'
  }).external(['react', 'react/addons']);

  return b.bundle()
    .on('error', gutil.log)
    .pipe(source('baobab-react-mixins.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build:mixins']);
