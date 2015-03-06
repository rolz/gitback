'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  util = require ('../util'),
  log = util.log('github', 'GB'),
  app, auth, webhook;

exports.setup = ((expressApp, options) => {
  app = expressApp;
  auth = require('./auth.es6').setup(app, options);
  webhook = require('./webhook.es6').setup(app, options);
});
