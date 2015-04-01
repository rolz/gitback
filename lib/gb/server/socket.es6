'use strict';

var _ = require('lodash-node'),
  // redis = require('socket.io-redis'),
  config = require('../../../json/config'),
  options = config.server,
  db = require ('../mongodb/index.es6'),
  webhook = require('../github/webhook.es6'),
  util = require ('../util'),
  log = util.log('socket', 'GB'),
  io;

/*
 * [TODO] Security setting!!!!
 * Setup coockie/sessionID
 * http://jxck.hatenablog.com/entry/20111226/1324905662
 * http://stackoverflow.com/questions/6502031/authenticate-user-for-socket-io-nodejs
 */

/*
 * Used to parse cookie
 */
function parse_cookies(_cookies) {
    var cookies = {};

    _cookies && _cookies.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return cookies;
}

function setSocket() {
  io.on('connection', ((socket) => {
    log(`a user connected: ${socket.id}`, 'blue');
    socket.on('setAnonymous', ((username, flag) => {
      log(`setAnonymous: ${username, flag}`, 'yellow');
      db.user.update(username, {hidden: flag}, ((e) => {
        log(e.result);
        io.emit('onSetAnonymous', e.result);
      }));
    }));
    socket.on('addWebhook', ((username, repoName) => {
      log(`addWebhook: ${username, repoName}`, 'yellow');
      db.user.findToken(username, ((e) => {
        var token = e.result;
        webhook.hook.add(token, username, repoName, ((e) => {
          db.user.findOne(username, ((e) => {
            io.emit('onAddWebhook', e.result);
          }));
        }));
      }));
    }));
    socket.on('removeWebhook', ((username, repoName, webhookId) => {
      log(`removeWebhook: ${username, repoName, webhookId}`, 'yellow');
      db.user.findToken(username, ((e) => {
        var token = e.result;
        webhook.hook.remove(token, username, repoName, webhookId, ((e) => {
          db.user.findOne(username, ((e) => {
            io.emit('onRemoveWebhook', e.result);
          }));
        }));
      }));
    }));
    socket.on('removeUser', ((username) => {
      log(`removeUser: ${username}`);
      db.user.remove(username, ((e) => {
        io.emit('onRemoveUser', username);
      }));
    }));
    socket.on('removeAllUsers', (() => {
      log('removeAllUsers');
      db.user.removeAll(((e) => {
        io.emit('onRemoveAllUsers', e);
      }));
    }));
    socket.on('findAllUsers', (() => {
      db.user.findAll((e) => {
        io.emit('onFindAllUsers', e);
      });
    }));
    socket.on('findRecentContributions', (() => {
      db.contrib.findRecentContributions((e) => {
        var arr = [],
          check = ((list) => {
            var cb = (() => {
              if(arr.length >= 3 || list.length === 0) {
                io.emit('onFindRecentContributions', {results: arr});
              } else {
                check(list);
              }
            });
            var user = list.shift();
            db.user.findOne(user.username, ((e) => {
              var result = e.result;
              if(result && result.hidden !== true) {
                arr.push(_.extend(result, user));
                cb();
              } else {
                cb();
              }
            }));
          });
          check(e.results);
      });
    }));
    socket.on('disconnect', (() => {
      log(`user disconnected: ${socket.id}`, 'red');
    }));
  }));
}

exports.emit = ((message, val) => {
  io.emit(message, val);
});


exports.setup = ((http, app) => {
  // var redis = require('socket.io-redis');
  io = require('socket.io')(http);
  // io.adapter(redis({ host: 'localhost', port: 6379 }));
  // io = require('socket.io').listen(app);
  // setConfigure();
  setSocket();
});

