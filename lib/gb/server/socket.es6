'use strict';

var _ = require('lodash-node'),
  config = require('../../../json/config'),
  options = config.server,
  db = require ('../mongodb/index.es6'),
  util = require ('../util'),
  log = util.log('socket', 'GB'),
  io;

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

exports.setup = ((http) => {
  io = require('socket.io')(http);
  setSocket();
});

