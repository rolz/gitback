'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  db = require ('../mongodb/index.es6'),
  webhook = require('./webhook.es6'),
  config = require('../../../json/config'),
  options = config.github,
  clientId = process.env.CLIENTID || options.clientId,
  clientSecret = process.env.CLIENTSECRET || options.clientSecret,
  oauthUrl = options.oauthUrl,
  util = require ('../util'),
  log = util.log('github.auth', 'GB'),
  GitHubApi = require('github'),
  github = new GitHubApi({
    version: '3.0.0',
    debug: true,
    headers: {'user-agent': 'GitBackApp'}
  }),
  app;

function setRoutes() {
  app.get('/login', (req, res) => {
    res.redirect(307, oauthUrl + '/authorize?client_id=' + clientId + '&scope=user,read:repo_hook,write:repo_hook,admin:repo_hook');
  });

  app.get('/callback', (req, res) => {
    var authCode = req.query.code;

    request.post({
      url: oauthUrl + '/access_token',
      form: {
        client_id: clientId,
        client_secret: clientSecret,
        code: authCode
      }
    }, (err, resp, body) => {


      var token = qs.parse(body).access_token;
      log(`this is the user token: ${token}`, 'blue');

      if(token) {

        request.get({
          headers: {
            'User-Agent': 'GitBackApp'
          },
          url: options.apiUrl + '/user?access_token='+token

        },
        (err, resp, body) => {
          // gup represents Github User Profile
          var gup = JSON.parse(body);
          var userId = gup.login;

          addUser(userId, token, (repos) => {
            // console.log(repos);
            db.user.add({
              tokenId: token,
              login: userId,
              avatarUrl: gup.avatar_url,
              email: gup.email,
              repos: repos,
              private: false
            }, ((e) => {
              if(e.status === 'success') {
                log(e.message, 'green');
                /* Add webhooks */
                addWebhooks(token, userId, _.cloneDeep(repos));
              } else {
                // User already exists.
                log(e.message, 'red');
              }
              /* Redirect to home */
              req.flash('gitlogin', userId);
              res.redirect('/');
            }));
          });

        });
      } else {
        throw Error('no token exists.');
      }

    });

  });

}

function addWebhooks(token, user, items) {
  if(_.isArray(items) && items.length > 0) {
    var item = items.shift();
    console.log(token, user, item.name);
    webhook.hook.add(token, user, item.name, ((data) => {
      // TODO: updateRepo in user API to add `webhookId`
      log(data, 'blue');
      if(data.statusCode === 201) {
        log('new webhook', 'green');
      } else if(data.statusCode === 422) {
        log(data.body.errors[0].message, 'red');
      }
      addWebhooks(token, user, items);
    }));
  } else {
    log('done for adding webhooks!', 'green');
  }
}

function addUser(user, token, callback) {
    // authenticate to github and get repos
    github.authenticate({
        type: 'oauth',
        token: token
    });

    // Get user repos and add to collection
    var repos = github.repos.getFromUser({
        user: user
    }, ((err, data) => {

        var initialReposData = [];
        _.each(data, ((item, index) => {
          initialReposData.push({
            name: item.name,
            commits: 0,
            webhook: null,
            commitslog: []
          });
        }));

        callback(initialReposData);

    }));
}

var auth = {
  authOptions (token) {
    var json = {
      headers: {
        'user-agent': 'GitBackApp',
        'Authorization': 'token '+ token
      }
    };
    return json;
  },
  add (token, callback) {
  },
  remove (token, callback) {
    log(`[TODO] remove auth token: ${token}. JUST CALL THE CALLBACK SO FAR`, 'yellow');
    callback();
  },
  setup(expressApp) {
    app = expressApp;
    setRoutes();
  }
};

module.exports = auth;

