/*
 * We might switch web framework from express to koa.
 * http://koajs.com/
 */

'use strict';

var _ = require('lodash-node'),
  config = require('./json/config'),
  gb = require('./lib/gb'),
  express = require('express'),
  app = express();

gb.server.connect(app, express, config.server, __dirname);