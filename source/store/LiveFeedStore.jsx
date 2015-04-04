'use strict';

/**
 * Data from websocket
 *
[{
    "_id": "550a335f8d53f736ca48db0c",
    "username": "meowyo",
    "repo": "laser",
    "createdAt": 1426731870480,
    "avatarUrl": "https://avatars.githubusercontent.com/u/9475794?v=3",
    "commits": ["42de42a236df068488f5c875571c630ed079afa8"],
    "__v": 0
}]

 */

var util = require('../lib/util.jsx'),
  logger = Logger.get('LiveFeedStore'),
  socket;

var LiveFeedStore = Reflux.createStore({
  listenables: [require('../actions/LiveFeedActions.jsx')],

  init() {
    setTimeout(() => {
      socket = require('../lib/socket.jsx')();
      socket.emit('findRecentContributions');
    });
  },

  /* Common */
  updateUser(user) {
    // logger.debug('updateUser', user);
    this.users.unshift(user);
    this.users = this.users;
    this.trigger(this.users);
  },
  updateUsers(users) {
    // logger.debug('updateUsers', users);
    this.users = users;
    this.trigger(this.users);
  },
  getInitialState() {
    this.users = [];
    return this.users;
  }
});

module.exports = LiveFeedStore;
