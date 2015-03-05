'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  util = require ('../util'),
  log = util.log('github.auth', 'GB'),
  app, db, clientId, clientSecret;

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

            db.user.add({
              tokenId: token,
              login: gup.login,
              avatarUrl: gup.avatar_url,
              email: gup.email
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
        } else {
          throw Error('no token exists.');
        }

      });

  });

}

module.exports = ((expressApp, mongodb, options) => {
  app = expressApp;
  db = mongodb;
  clientId = process.env.CLIENTID || options.clientId;
  clientSecret = process.env.CLIENTSECRET || options.clientSecret;
  setRoutes(options);
});