'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  util = require ('../util'),
  log = util.log('github', 'GB'),
  app, db, github, auth, repos, user;

module.exports = ((expressApp, options, mongodb) => {
  db = mongodb;
  app = expressApp;
  var GitHubApi = require('github');
  github = new GitHubApi({
    // required
    version: '3.0.0',
    debug: true,
    headers: {
      'user-agent': 'GitBackApp'
    }
  });
  auth = require('./auth.es6')(app, db, options);
  // user = require('./user.es6')(app, db, github, options);
});
