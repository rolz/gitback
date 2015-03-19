'use strict';

/**
 * Data from websocket
 *
  [{
      "_id": "5508d0df17b28fa5424ee6c4",
      "avatarUrl": "http://www.google.com",
      "username": "mayognaise",
      "repo": "hello",
      "createdAt": 1426641119390,
      "commits": ["cf3cda596bdf532f55b2c6191f", "5b2c6191f9fcc39a69babbb"],
      "__v": 0
  }]
 */

var util = require('../lib/util.jsx'),
  logger = Logger.get('LiveFeedStore'),
  socket;

var USERS = [
  {
    username: "craftedpixelz",
    name: "Abid Din",
    avatarUrl: "https://avatars2.githubusercontent.com/u/672890",
    repo: {
      name: "craftedpixelz/shibui",
      url: "http://github.com/craftedpixelz/shibui"
    },
    donation: 0.06,
    lastCommit: '9s'
  },
  {
    username: "rolz",
    name: "Zac Rolland",
    avatarUrl: "https://avatars2.githubusercontent.com/u/1561533",
    repo: {
      name: "rolz/BattleHackLA",
      url: "http://github.com/rolz/BattleHackLA"
    },
    donation: 0.03,
    lastCommit: '30s'
  },
  {
    username: "mayognaise",
    name: "Mayo Tobita",
    avatarUrl: "https://avatars2.githubusercontent.com/u/588874",
    repo: {
      name: "mayognaise/whats-svg",
      url: "http://github.com/mayognaise/whats-svg"
    },
    donation: 0.22,
    lastCommit: '53s'
  }
];

var LiveFeedStore = Reflux.createStore({
  listenables: [require('../actions/LiveFeedActions.jsx')],

  init() {
    setTimeout(() => {
      socket = require('../lib/socket.jsx')();
    });
  },

  /* Common */
  update(user) {
    logger.debug('update', user);
    this.users.unshift({
      username: user.username,
      avatarUrl: user.avatarUrl,
      repo: {
        name: `${user.username}/${user.repo}`,
        url: `http://github.com/${user.username}/${user.repo}`
      },
      donation: 0.01 * user.commits.length,
      lastCommit: (new Date(1426641119390)).toString()
    });
    this.trigger(this.users);
  },
  getInitialState() {
    this.users = USERS || [];
    return this.users;
  }
});

module.exports = LiveFeedStore;
