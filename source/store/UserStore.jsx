'use strict';

var util = require('../lib/util.jsx');

/*
 * SOCKET.IO
 * http://socket.io/
 */
var socket = io();

socket.on('onRemoveUser', function(e){
  UserStore.onRemovedUser();
});

socket.on('onFindAllUsers', function(e){
  UserStore.updateUsers(e.result);
});

var UserStore = Reflux.createStore({
  listenables: [require('../actions/UserActions.jsx')],

  /* Remove */
  removeWebhook(userId, repoName, webhookId) {
    console.log(userId, repoName, webhookId);
    socket.emit('removeWebhook', userId, repoName, webhookId);
  },
  onRemovedUser(userId) {
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
    socket.emit('findAllUsers');
  },
  updateUsers(users){
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