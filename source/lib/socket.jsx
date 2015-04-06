'use strict';

var util = require('./util.jsx');
var logger = Logger.get('Socket');
var UserActions = require('../actions/UserActions.jsx');
var UsersActions = require('../actions/UsersActions.jsx');
var LiveFeedActions = require('../actions/LiveFeedActions.jsx');

/*
 * SOCKET.IO
 * http://socket.io/
 */
var socket = io();

/* UserActions */
socket.on('onSetAnonymous', ((user) => {
  // logger.debug('onSetAnonymous', user);
  UsersActions.refreshUsers();
  UserActions.updateUser(user);
}));

socket.on('onAddWebhook', ((user) => {
  // logger.debug('onAddWebhook', user);
  UsersActions.refreshUsers();
  UserActions.updateUser(user);
}));

socket.on('onRemoveWebhook', ((user) => {
  // logger.debug('onRemoveWebhook', user);
  UsersActions.refreshUsers();
  UserActions.updateUser(user);
}));

socket.on('onRemoveUser', ((e) => {
  // logger.debug('onRemoveUser', e);
  UsersActions.refreshUsers();
}));


/* UsersActions */
socket.on('onRemoveAllUsers', ((e) => {
  // logger.debug('onRemoveAllUsers', e);
  UsersActions.refreshUsers();
}));

socket.on('onFindAllUsers', ((e) => {
  // logger.debug('onFindAllUsers', e);
  UsersActions.updateUsers(e.result);
}));


/* LiveFeedActions */
socket.on('onContributed', ((e) => {
  // logger.debug('onContributed', e);
  LiveFeedActions.updateUser(e.contribData);
  UserActions.updateUser(e.userData);
}));

socket.on('onFindRecentContributions', ((e) => {
  // logger.debug('onFindRecentContributions', e);
  LiveFeedActions.updateUsers(e.results);
}));



module.exports = (() => { return socket; });
