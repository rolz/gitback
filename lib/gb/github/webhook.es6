'use strict';

/*
 * https://developer.github.com/v3/repos/hooks/
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  util = require ('../util'),
  log = util.log('github.webhook', 'GB'),
  app, db, webhookUrl;

function setRoutes(options) {

  // receive user commit messages
  app.post('/webhook', (req,res) => {
    log(req.body);

    // add to repo commit log
    res.end('.');
  });

}

function createWebhook(token, user, repo, callback) {
  log(user, repo);
  var url = options.apiUrl+'/repos/'+user+'/'+repo+'/hooks';
  var options = {
    headers: {
        "user-agent": "My-Cool-GitHub-App",
        Authorization: 'token '+ token
    },
    data: {
        name: 'web'
    },
    active: true,
    config: {
        "url": webHookUrl
    },
    events: ['push'],
    user: user,
    repo: repo
  };

  // post webhook to repo
  request.post(url, options, function (err, data) {
    callback(data);
  });
}


module.exports = ((expressApp, mongodb, options) => {
  app = expressApp;
  db = mongodb;
  webhookUrl = process.env.WEBHOOKURL || options.webhookUrl;
  setRoutes(options);
});
