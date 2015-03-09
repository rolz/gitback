'use strict';

var _ = require('lodash-node'),
  // redis = require('socket.io-redis'),
  config = require('../../../json/config'),
  options = config.server,
  db = require ('../mongodb/index.es6'),
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
    log('a user connected', 'blue');
    socket.on('removeUser', ((userId) => {
      log(`removeUser: ${userId}`);
      db.user.remove(userId, ((e) => {
        io.emit('onRemoveUser', e);
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
    socket.on('disconnect', (() => {
      log('user disconnected', 'red');
    }));
  }));
}

exports.setup = ((http, app) => {
  // var redis = require('socket.io-redis');
  io = require('socket.io')(http);
  // io.adapter(redis({ host: 'localhost', port: 6379 }));
  // io = require('socket.io').listen(app);
  // setConfigure();
  setSocket();
});

