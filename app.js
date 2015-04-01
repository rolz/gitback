'use strict';

/**
 * We might switch web framework from express to koa.
 * http://koajs.com/
 */

var _ = require('lodash-node'),
  config = require('./json/config'),
  gb = require('./lib/gb'),
  express = require('express'),
  app = express();

if (process.env.NODE_ENV === 'development') {
  /* Add livereload */
  // app.use(require('connect-livereload')({port: config.server.livereloadPort}));

  /* Get local enviroment variables */
  var env = require('node-env-file');
  env(__dirname + '/.env');
}

/* Connect server */
gb.server.connect(app, express);

/* Connect DB */
gb.mongodb.connect(app, (function(e) {
  if(e.status === 'success') {

    /* Setup server */
    gb.server.setup();

    /* Setup Gitub */
    gb.github.setup(app);

    /* Setup payments */
    gb.payments.setup(app);
  }
}));
