'use strict';

var logger = Logger.get('UserStore');

var util = require('../lib/util.jsx');

/*
 * SOCKET.IO
 * http://socket.io/
 */
var socket = io();

socket.on('onRemoveUser', function(e){
  console.log('onRemoveUser', e);
});

// some variables and helpers for our fake database stuff
var todoCounter = 0,
  localStorageKey = 'todos';

function getItemByKey(user,itemKey){
  return _.find(user, function(item) {
      return item.key === itemKey;
  });
}

var UserStore = Reflux.createStore({
  listenables: [require('../actions/UserActions.jsx')],

  /* Remove */
  onRemovedUser(userId) {

  },
  removeUser(userId) {
    logger.info('removeUser: ', userId);
    socket.emit('removeUser', userId);
  },
  onRemovedAllUsers() {

  },
  removeAllUsers() {

  },

  /* Common */
  updateUsers(users){
    // if we used a real database, we would likely do the below in a callback
    this.users = users;
    this.trigger(users); // sends the updated list to all listening components (App)
  },
  getInitialState() {
    this.users = GB.users || [];
    return this.users;
  }
});

module.exports = UserStore;