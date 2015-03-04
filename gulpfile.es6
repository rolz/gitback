'use strict';

var _ = require('lodash-node'),
  gulp = require('gulp'),
  shell = require('gulp-shell'),
  config = require('./json/config'),
  gb = require('./lib/gb'),
  colors = require('colors'),
  tinylr;

gulp.task('server', () => {
  var nodemon = require('gulp-nodemon');
  nodemon(config.nodemon).on('restart', () => {
    console.log('[gulp] ' + '[nodemon] restarted!'.blue);
  });
});

gulp.task('livereload', () => {
  tinylr = require('tiny-lr')();
  tinylr.listen(config.server.livereloadPort);
});

gulp.task('dev-webpack', shell.task([['webpack-dev-server --progress --colors --port ' + config.server.webpackServerPort]]));

gulp.task('webpack', shell.task(['webpack']));

gulp.task('watch', () => {
  var watch = require('gulp-watch');
  watch(['views/**/**', 'public/**/**'], (e) => {
    var fileName = require('path').relative(__dirname, e.path);
    console.log('[gulp] ' + '[watch] '.blue + fileName);
    tinylr.changed({body: {files: [fileName]}});
  });
});

gulp.task('default', ['dev-webpack', 'server', 'livereload', 'watch']);