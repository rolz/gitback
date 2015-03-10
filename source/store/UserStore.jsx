'use strict';

var util = require('../lib/util.jsx');
var logger = Logger.get('UserStore');

/*
 * SOCKET.IO
 * http://socket.io/
 */
var socket = io();

socket.on('onAddWebhook', function(e){
  logger.debug('onAddWebhook', e);
  UserStore.onAddedWebhook();
});

socket.on('onRemoveWebhook', function(e){
  logger.debug('onRemoveWebhook', e);
  UserStore.onRemovedWebhook();
});

socket.on('onRemoveAllUsers', function(e){
  logger.debug('onRemoveAllUsers', e);
  UserStore.onRemovedAllUsers();
});

socket.on('onRemoveUser', function(e){
  logger.debug('onRemoveUser', e);
  UserStore.onRemovedUser();
});

socket.on('onFindAllUsers', function(e){
  logger.debug('onFindAllUsers', e);
  UserStore.updateUsers(e.result);
});

var UserStore = Reflux.createStore({
  listenables: [require('../actions/UserActions.jsx')],

  /* Add */
  onAddedWebhook() {
    logger.debug('onAddWebhook');
    this.refreshUsers();
  },
  addWebhook(userId, repoName) {
    logger.debug('addWebhook');
    socket.emit('addWebhook', userId, repoName);
  },

  /* Remove */
  onRemovedWebhook() {
    this.refreshUsers();
  },
  removeWebhook(userId, repoName, webhookId) {
    logger.debug(userId, repoName, webhookId);
    socket.emit('removeWebhook', userId, repoName, webhookId);
  },
  onRemovedUser() {
    this.refreshUsers();
  },
  removeUser(userId) {
    socket.emit('removeUser', userId);
  },
  onRemovedAllUsers() {
    this.refreshUsers();
  },
  removeAllUsers() {
    socket.emit('removeAllUsers');
  },

  /* Common */
  refreshUsers() {
    logger.debug('refreshUsers');
    socket.emit('findAllUsers');
  },
  updateUsers(users){
    logger.debug('updateUsers', users);
    this.users = users;
    /* sends the updated list to all listening components (App) */
    this.trigger(users);
  },
  getInitialState() {
    this.users = GB.users || [];
    return this.users;
  }
});

module.exports = UserStore;