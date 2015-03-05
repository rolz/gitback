'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  util = require ('../util'),
  log = util.log('github', 'GB'),
  app, db, auth, repos, user;

module.exports = ((expressApp, options, mongodb) => {
  db = mongodb;
  app = expressApp;
  auth = require('./auth.es6')(app, db, options);
});
