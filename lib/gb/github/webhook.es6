'use strict';

/*
 * https://developer.github.com/v3/repos/hooks/
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  db = require ('../mongodb/index.es6'),
  util = require ('../util'),
  log = util.log('github.webhook', 'GB'),
  app, webhookUrl, apiUrl;

function setRoutes(options) {

  // receive user commit messages
  app.post('/webhook', (req,res) => {
    log(req.body);

    // add to repo commit log
    res.end('.');
  });

}

function createWebhook(token, user, repo, callback) {
  log(`user: ${user}`, 'blue');
  log(`repo: ${repo}`, 'blue');
  log(`token: ${token}`, 'blue');
  var url = apiUrl+'/repos/'+user+'/'+repo+'/hooks';
  var options = {
    headers: {
      'user-agent': 'GitBackApp',
      'Authorization': 'token '+ token
    },
    name: 'web',
    active: true,
    config: {
      'url': webhookUrl,
      'content_type': 'json'
    },
    events: ['push']
  };

  // post webhook to repo
  request.post(url, options, function (err, data) {
    log('!!!!!-------', 'red');
    console.log(err);
    console.log(data);
    callback(data);
  });
}


exports.setup = ((expressApp, options) => {
  app = expressApp;
  webhookUrl = process.env.WEBHOOKURL || options.webhookUrl;
  apiUrl = options.apiUrl;
  setRoutes(options);
});

exports.createWebhook = createWebhook;