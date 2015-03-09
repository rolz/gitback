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
    private: Boolean,
    repos: [{
      name: String,
      webhookId: String,
      createdAt: Date,
      lastLoggedIn: Date,
      commitsCount: Number,
      commitsLog: [{
        firstCommitDateOfTheMonth: Date,
        commits: Number
      }]
    }]
  }));
}

function findOne(userId, cb) {
  return PUser.findOne({'login': userId}, {'tokenId': false}).exec((err, result) => {
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
    findOne(options.login, (e) => {
      if(e.status === 'success') {
        var user = new PUser (options);
        user.save((err) => {
          if(cb) {cb({
            status: (err? 'error': 'success'),
            message: `user added successfully: ${options.login}`
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

function remove(userId, cb) {
  PUser.findOneAndRemove({'login': userId}, (err, user) => {
    if(cb) {cb({
      status: (err? 'error': 'success'),
      user: user
    });}
  });
}

module.exports = ((mongooseDB) => {
  mongoose = mongooseDB;
  setupSchema();
  // removeAll();
  return {
    add: add,
    findOne: findOne,
    removeAll: removeAll,
    remove: remove,
    findAll: findAll,
  };
});
