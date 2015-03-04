'use strict';

var _ = require('lodash-node'),
  gulp = require('gulp'),
  config = require('./json/config'),
  gb = require('./lib/gb'),
  colors = require('colors'),
  livereloadPort = 4002,
  tinylr;

gulp.task('server', () => {
  var express = require('express'),
    app = express();
  app.use(require('connect-livereload')({port: livereloadPort}));
  gb.server.connect(app, express, config.server, __dirname);
});

gulp.task('livereload', () => {
  tinylr = require('tiny-lr')();
  tinylr.listen(livereloadPort);
});

gulp.task('watch', () => {
  var watch = require('gulp-watch'),
    shell = require('gulp-shell');
  watch('source/**/**', shell.task(['webpack']));
  watch(['dist/**', 'public/**/**'], (e) => {
    var fileName = require('path').relative(__dirname, e.path);
    tinylr.changed({body: {files: [fileName]}});
  });
});

gulp.task('default', ['server', 'livereload', 'watch']);