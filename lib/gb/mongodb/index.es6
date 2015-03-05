'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  mongoose = require ('mongoose'),
  util = require ('../util'),
  log = util.log('mongodb', 'GB'),
  app, user;

function setRoutes(options) {
}

function test() {
  /* Check mayognaise exists */
  var userId = 'mayognaise';
  user.find(userId, ((e) => {
    if(e.status === 'success') {
      console.log(e.result);
      if(e.result.length === 0) {
        /* Add user */
        user.add({login: userId}, ((e) => {
          console.log(e);
        }));
      }
    }
  }));
}

module.exports = ((expressApp, options, cb) => {
  app = expressApp;
  var uristring = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    options.localMongoURL;
  mongoose.connect(uristring, function (err, res) {
    if (err) {
      log(`error connected to: ${uristring}. ${err}`, 'red');
      if(cb) {
        cb({
          status: 'error'
        });
      }
    } else {
      log(`succeeded connected to: ${uristring}`, 'green');
      user = require('./user.es6')(mongoose);
      setRoutes();
      if(cb) {
        cb({
          status: 'success',
          db: {user: user}
        });
      }
    }
  });
});