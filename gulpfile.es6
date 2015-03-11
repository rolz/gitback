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
  nodemon({
    script: 'app.js',
    ext: 'handlebars js json es6',
    env: { NODE_ENV: 'development' },
    ignore: [
      'node_modules/**',
      'public/**',
      'source/**',
      'views/**',
      'dist/**',
      'webpack.config.js',
      'gulpfile.js',
      'gulpfile.es6',
      'package.json'
    ]
  // }).on('restart', () => {
  //   console.log('[gulp] ' + '[nodemon] restarted!'.blue);
  });
});

gulp.task('livereload', () => {
  tinylr = require('tiny-lr')();
  tinylr.listen(config.server.livereloadPort);
});

// CLI for webpack dev
// http://webpack.github.io/docs/webpack-dev-server.html#cli
gulp.task('dev-webpack', shell.task([['webpack-dev-server --quiet --port ' + config.server.webpackServerPort]]));

// CLI for webpack
// http://webpack.github.io/docs/cli.html
gulp.task('webpack', shell.task(['webpack']));

gulp.task('watch', () => {
  var watch = require('gulp-watch');
  watch(['views/**/**', 'public/**/**'], (e) => {
    var fileName = require('path').relative(__dirname, e.path);
    console.log('[gulp] ' + '[watch] '.blue + fileName);
    tinylr.changed({body: {files: [fileName]}});
  });
});

gulp.task('default', ['dev-webpack', 'server']);
// gulp.task('default', ['dev-webpack', 'server', 'livereload', 'watch']);