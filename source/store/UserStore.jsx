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

  /* Set */
  onSetAnonymous(userId, flag) {
    // logger.debug('setAnonymous', userId, flag);
    socket.emit('setAnonymous', userId, flag);
  },

  /* Add */
  onAddWebhook(userId, repoName) {
    // logger.debug('addWebhook');
    socket.emit('addWebhook', userId, repoName);
  },

  /* Remove */
  onRemoveWebhook(userId, repoName, webhookId) {
    // logger.debug(userId, repoName, webhookId);
    socket.emit('removeWebhook', userId, repoName, webhookId);
  },
  onRemoveUser(userId) {
    // logger.debug('onRemoveUser', userId);
    socket.emit('removeUser', userId);
  },

  /* Common */
  refreshUser(userId) {
    // logger.debug('refreshUser');
    socket.emit('findUser', userId);
  },
  updateUser(user){
    // logger.debug('updateUser', user);
    this.user = user;
    this.trigger(user);
  },
  getInitialState() {
    this.user = GB.user || _.find(GB.users, ((user) => {return user.login === GB.login})) || {};
    return this.user;
  }
});

module.exports = UserStore;