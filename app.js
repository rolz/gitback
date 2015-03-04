'use strict';

/*
 * We might switch web framework from express to koa.
 * http://koajs.com/
 */

var _ = require('lodash-node'),
  config = require('./json/config'),
  gb = require('./lib/gb'),
  express = require('express'),
  app = express();

if(process.env.NODE_ENV === 'development') {
  // [TODO] Make liveload work!!
  require('express-livereload')(app, {watchDir: process.cwd() + '/views'});
}

gb.server.connect(app, express, config.server, __dirname);
gb.github(app, config.github);