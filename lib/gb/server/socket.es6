'use strict';

var _ = require('lodash-node'),
  config = require('../../../json/config'),
  options = config.server,
  db = require ('../mongodb/index.es6'),
  util = require ('../util'),
  log = util.log('socket', 'GB'),
  io;

function setSocket() {
  io.on('connection', function(socket){
    log('a user connected', 'blue');
    socket.on('removeUser', function(userId){
      log(`removeUser: ${userId}`);
      db.user.remove(userId, ((e) => {
        io.emit('onRemoveUser', e);
      }));
    });
    socket.on('disconnect', function(){
      log('user disconnected', 'red');
    });
  });
}

exports.setup = ((http) => {
  io = require('socket.io')(http);
  setSocket();
});
