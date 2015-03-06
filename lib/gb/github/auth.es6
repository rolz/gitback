'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  db = require ('../mongodb/index.es6'),
  webhook = require('./webhook.es6'),
  util = require ('../util'),
  log = util.log('github.auth', 'GB'),
  GitHubApi = require('github'),
  github = new GitHubApi({
    version: '3.0.0',
    debug: true,
    headers: {'user-agent': 'GitBackApp'}
  }),
  app, clientId, clientSecret;

function setRoutes(options) {
  app.get('/login', (req, res) => {
    res.redirect(307, options.oauthUrl + '/authorize?client_id=' + clientId + '&scope=user,read:repo_hook,write:repo_hook');
  });

  app.get('/callback', (req, res) => {
    var authCode = req.query.code;

    request.post({
      url: options.oauthUrl + '/access_token',
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
                  'User-Agent': 'request-gitback'
              },
              url: options.apiUrl + '/user?access_token='+token

          },
          (err, resp, body) => {
            // gup represents Github User Profile
            var gup = JSON.parse(body);

            addUser(gup.login, token, function (repos) {
              // console.log(repos);
              db.user.add({
                tokenId: token,
                login: gup.login,
                avatarUrl: gup.avatar_url,
                email: gup.email,
                repos: repos
              }, ((e) => {
                if(e.status === 'success') {
                  /* Get user information */
                  db.user.find(e.userId, ((e) => {
                    log(e, 'yellow');
                  }));
                } else {
                  log(e.message, 'red');
                }

                res.redirect('/admin');
              }));
            });

          });
        } else {
          throw Error('no token exists.');
        }

      });

  });

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
          if(index === 0) {
            webhook.hook.add(token, user, item.name, ((e) => {
              log('woohoo------!!!!', 'blue');
              console.log(e);
              log('end of woohoo------!!!!', 'blue');
            }));
          }
        }));
        callback(initialReposData);
    }));
}

exports.setup = ((expressApp, options) => {
  app = expressApp;
  clientId = process.env.CLIENTID || options.clientId;
  clientSecret = process.env.CLIENTSECRET || options.clientSecret;
  setRoutes(options);
});
