'use strict';

/*
 * https://developer.github.com/v3/repos/hooks/
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  db = require ('../mongodb/index.es6'),
  config = require('../../../json/config'),
  options = config.github,
  util = require ('../util'),
  log = util.log('github.webhook', 'GB'),
  app, webhookUrl, apiUrl;

function setRoutes() {

  // receive user commit messages
  app.post('/webhook', (req,res) => {
    log("data coming from webhool: "+ JSON.stringify(req.body), 'blue');

    // add to repo commit log
    res.end('.');
  });

}

var hook = {

  url (user, repo) {
    return apiUrl+'/repos/'+user+'/'+repo+'/hooks';
  },
  webhookOptions (token) {
    var json = {
      headers: {
        'user-agent': 'My-Cool-GitHub-App',
        'Authorization': 'token '+ token
      },
      json: {name: 'web', active: true, events: ['push'], config: {url: webhookUrl, content_type: 'json'}}
    }
    return json;
  },
  add (token, user, repo, callback) {
    request.post(this.url(user, repo), this.webhookOptions(token), function (err, data) {
        log(`user: ${user}`, 'blue');
        log(`repo: ${repo}`, 'blue');
        log(`token: ${token}`, 'blue');
      callback(data);
    });
  }
  // ,
  // remove: (token, user, repo, callback) => {
  //   request.delete(this.url, this.webhookOptions(token, user, repo), function (err, data) {
  //     callback(data);
  //   });
  // },
  // update: (token, user, repo, callback) => {
  //   request.patch(this.url, this.webhookOptions(token, user, repo), function (err, data) {
  //     callback(data);
  //   });
  // }

}


exports.setup = ((expressApp) => {
  app = expressApp;
  webhookUrl = process.env.WEBHOOKURL || options.webhookUrl;
  apiUrl = options.apiUrl;
  setRoutes();
});

exports.hook = hook;
