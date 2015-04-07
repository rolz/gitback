'use strict';

var util = require('../lib/util.jsx'),
  logger = Logger.get('UsersStore'),
  socket;

var UsersStore = Reflux.createStore({
  listenables: [require('../actions/UsersActions.jsx')],

  init() {
    var self = this;
    setTimeout(() => {
      socket = require('../lib/socket.jsx')();
      self.refreshUsers();
    });
  },

  /* Remove */
  onRemovedAllUsers() {
    socket.emit('removeAllUsers');
  },

  /* Common */
  refreshUsers() {
    // logger.debug('refreshUsers');
    socket.emit('findAllUsers');
  },
  updateUsers(users){
    // logger.debug('updateUsers', users);
    this.users = users;
    this.trigger(users);
  },
  getInitialState() {
    this.users = this.users || [];
    return this.users;
  }
});

module.exports = UsersStore;