'use strict';

var util = require('../lib/util.jsx'),
  logger = Logger.get('LiveFeedStore');

var USERS = [
  {
    id: 672890,
    name: "Abid Din",
    user: "craftedpixelz",
    repo: {
      name: "craftedpixelz/shibui",
      url: "http://github.com/craftedpixelz/shibui"
    },
    donation: 0.06,
    lastCommit: '9s'
  },
  {
    id: 1561533,
    name: "Zac Rolland",
    user: "rolz",
    repo: {
      name: "rolz/BattleHackLA",
      url: "http://github.com/rolz/BattleHackLA"
    },
    donation: 0.03,
    lastCommit: '30s'
  },
  {
    id: 588874,
    name: "Mayo Tobita",
    user: "mayognaise",
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

  /* Common */
  update(user) {
    logger.debug('update', user);
    this.users.unshift(user);
    // logger.debug(this.users);
    this.trigger(this.users);
  },
  getInitialState() {
    this.users = USERS || [];
    return this.users;
  }
});

module.exports = LiveFeedStore;
