'use strict';

var _ = require('lodash-node'),
  gulp = require('gulp'),
  shell = require('gulp-shell'),
  config = require('./json/config'),
  gb = require('./lib/gb'),
  colors = require('colors'),
  livereloadPort = 35729,
  tinylr;

gulp.task('server', () => {
  var express = require('express'),
    app = express();
  app.use(require('connect-livereload')({port: livereloadPort}));
  gb.server.connect(app, express, config.server, __dirname);
});

gulp.task('dev-server', () => {
  var nodemon = require('gulp-nodemon');
  nodemon(config.nodemon)
  .on('restart', () => {
    console.log('restarted!');
  });
});

gulp.task('livereload', () => {
  tinylr = require('tiny-lr')();
  tinylr.listen(livereloadPort);
});

gulp.task('webpack', shell.task(['webpack']));

gulp.task('watch', () => {
  var watch = require('gulp-watch'),
    batch = require('gulp-batch');
  watch('source/**/**', batch(() => { gulp.start('webpack'); }));
  watch(['dist/**', 'public/**/**'], (e) => {
    var fileName = require('path').relative(__dirname, e.path);
    tinylr.changed({body: {files: [fileName]}});
  });
});

gulp.task('dev', ['webpack', 'dev-server']);
gulp.task('default', ['webpack', 'server', 'livereload', 'watch']);