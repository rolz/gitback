'use strict';

/*
 * https://developer.github.com/v3/users/#get-a-single-user
 */

var _ = require('lodash-node'),
  util = require ('../util'),
  log = util.log('mongodb.user', 'GB'),
  PUser, mongoose;

function setupSchema() {
  PUser = mongoose.model('PowerUsers', new mongoose.Schema({
    login: String,
    avatarUrl: String,
    email: String,
    tokenId: String,
    repos: [{
      name: String,
      commits: Number,
      webhook: Boolean
    }]
  }));
}

function find(userId, cb) {
  return PUser.find({'login': userId}, {'tokenId': false}).exec((err, result) => {
    if(err) log(`Error on finding #{userId}`, 'red');
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result
    });}
  });
}

function findAll(cb) {
  return PUser.find({}, {'tokenId': false}).exec((err, result) => {
    if(err) log(`Error on finding`, 'red');
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result
    });}
  });
}

function add(options, cb) {
  if(options.login && options.tokenId) {
    find(options.login, (e) => {
      if(e.status === 'success' && e.result.length === 0) {
        var user = new PUser (_.extend(options));
        user.save((err) => {
          if(cb) {cb({
            status: (err? 'error': 'success'),
            userId: options.login
          });}
        });
      } else {
        if(cb) {cb({
          status: 'error',
          message: `the user already exists: ${options.login}`
        });}
      }
    });
  } else {
    if(cb) {cb({
      status: 'error',
      message: 'login and tokenId are required'
    });}
  }
}

function removeAll(cb) {
  PUser.remove({}, (err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

module.exports = ((mongooseDB) => {
  mongoose = mongooseDB;
  setupSchema();
  // removeAll();
  return {
    add: add,
    find: find,
    removeAll: removeAll,
    findAll: findAll,
  };
});
