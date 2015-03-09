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

  app.get('/remove-webhook/:repo/:id', ((req, res) => {
    hook.remove('6d2bc17d3256f5f9de8f164e16b2a09add6b7267', 'rolz', req.params.repo, req.params.id, (data) => {
      log(data, 'yellow');
    });
  }));

  // receive user commit messages
  app.post('/webhook', (req,res) => {
    log("data coming from webhool: "+ JSON.stringify(req.body), 'blue');
    // add to repo commit log
    res.end('.');
  });

}

var hook = {

  webhookOptions (token) {
    var json = {
      headers: {
        'user-agent': 'GitBackApp',
        'Authorization': 'token '+ token
      },
      json: {name: 'web', active: true, events: ['push'], config: {url: webhookUrl, content_type: 'json'}}
    }
    return json;
  },
  add (token, user, repo, callback) {
    request.post(apiUrl+'/repos/'+user+'/'+repo+'/hooks', this.webhookOptions(token), (err, data) => {
        log(`user: ${user}`, 'blue');
        log(`repo: ${repo}`, 'blue');
        log(`token: ${token}`, 'blue');
      callback(data);
    });
  },
  remove (token, user, repo, webhookId, callback) {
    request.del(apiUrl+'/repos/'+user+'/'+repo+'/hooks'+webhookId, this.webhookOptions(token, user, repo), (err, data) => {
      callback(data);
    });
  }
  // ,
  // update (token, user, repo, callback) => {
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
