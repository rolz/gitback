'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  colors = require('colors'),
  app, github;

function setRoutes(options) {
  app.get('/login', function(req, res) {
    res.redirect(307, options.oauthUrl + '/authorize?client_id=' + options.clientId + '&scope=user:email');
  });
}

module.exports = ((expressApp, options) => {
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
  setRoutes(options);
});

