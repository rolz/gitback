'use strict';

var util = require('../lib/util.jsx'),
  logger = Logger.get('UserStore'),
  UsersActions = require('../actions/UsersActions.jsx'),
  socket;

var UserStore = Reflux.createStore({
  listenables: [require('../actions/UserActions.jsx')],

  init() {
    setTimeout(() => {
      socket = require('../lib/socket.jsx')();
    });
  },

  /* Anonymous */
  onSetAnonymous(username, flag) {
    // logger.debug('setAnonymous', username, flag);
    socket.emit('setAnonymous', username, flag);
  },

  /* Payments */
  onAddPaymentMethod(username) {
    // logger.debug('addPayments');
    socket.emit('addPaymentMethod', username);
  },

  /* Webhook */
  onAddWebhook(username, repoName) {
    // logger.debug('addWebhook');
    socket.emit('addWebhook', username, repoName);
  },

  onRemoveWebhook(username, repoName, webhookId) {
    // logger.debug(username, repoName, webhookId);
    socket.emit('removeWebhook', username, repoName, webhookId);
  },

  /* User */
  onRemoveUser(username) {
    // logger.debug('onRemoveUser', username);
    socket.emit('removeUser', username);
  },

  /* Common */
  refreshUser(username) {
    // logger.debug('refreshUser');
    socket.emit('findUser', username);
  },
  updateUser(user){
    // logger.debug('updateUser', user);
    if(!this.user.username || this.user.username === user.username) {
      this.user = user;
      this.trigger(user);
    }
  },
  getInitialState() {
    this.user = GB.user || _.find(GB.users, ((user) => {return user.username === GB.username})) || {};
    return this.user;
  }

});

module.exports = UserStore;
