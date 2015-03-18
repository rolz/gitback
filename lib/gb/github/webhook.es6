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
  webhookUrl = (process.env.LOCAL_URL || options.webhookUrl) + '/webhook',
  apiUrl = options.apiUrl,
  util = require ('../util'),
  log = util.log('github.webhook', 'GB'),
  app;

function setRoutes() {

  app.get('/remove-webhook/:repo/:id', ((req, res) => {
    // https://api.github.com/repos/rolz/board/hooks/4295073
    hook.remove('6d2bc17d3256f5f9de8f164e16b2a09add6b7267', 'rolz', req.params.repo, req.params.id, (data) => {
      log('webhook has been removed: ' + JSON.stringify(dat), 'yellow');
    });
  }));

  // receive user push messages
  app.post('/webhook', (req,res) => {
    var dat = req.body;
    log('data coming from webhook : ' + JSON.stringify(dat), 'yellow');
    if(dat.pusher) {
      db.contrib.add(dat);
    }
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
    };
    return json;
  },
  add (token, user, repo, callback) {
    log(`${apiUrl}/repos/${user}/${repo}/hooks`);
    request.post(`${apiUrl}/repos/${user}/${repo}/hooks`, this.webhookOptions(token), (err, data) => {
      log(`user: ${user}`, 'blue');
      log(`repo: ${repo}`, 'blue');
      log(`token: ${token}`, 'blue');
      log(data, 'blue');
      if(data.statusCode === 201) {
        var webhookId = data.body.id;
        log(`Webhook has been added: ${webhookId}`, 'green');
        db.user.addWebhookId(user, repo, webhookId, ((e) => {
          callback({
            status: 'success',
            result: data
          });
        }));
      } else if(data.statusCode === 422) {
        log(data.body.errors[0].message, 'red');
        callback({
          status: 'error',
          result: data
        });
      }
    });
  },
  remove (token, user, repo, webhookId, callback) {
    log(`remove: ${token, user, repo, webhookId}`, 'yellow');
    request.del(`${apiUrl}/repos/${user}/${repo}/hooks/${webhookId}`, this.webhookOptions(token, user, repo), (err, data) => {
      log(data, 'blue');
      if(data.statusCode === 204) {
        log('Webhook has been removed.', 'green');
        db.user.removeWebhookId(user, repo, ((e) => {
          callback({
            status: 'success',
            result: data
          });
        }));
      } else if(data.statusCode === 404) {
        log(data.body.message, 'red');
        db.user.removeWebhookId(user, repo, ((e) => {
          callback({
            status: 'error',
            result: data
          });
        }));
      }
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
  setRoutes();
});

exports.hook = hook;
