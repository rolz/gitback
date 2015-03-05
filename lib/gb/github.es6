'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  app, github, clientId, clientSecret;

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
      }, (err, res, body) => {

        var token = qs.parse(body).access_token;
        console.log("this is the user token: "+token);
        request.get({
            headers: {
                'User-Agent': 'request-gitback'
            },
            url: options.apiUrl + '/user?access_token='+token,

        },
        (err, res, body) => {
          var loggedInUserData = body;
          console.log(body);
        });

      });

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
  clientId = process.env.CLIENTID || options.clientId;
  clientSecret = process.env.CLIENTSECRET || options.clientSecret;
  setRoutes(options);
});
