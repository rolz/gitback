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



function findToken(userId, cb) {
  return PUser.findOne({'login': userId}).exec((err, result) => {
    if(err) log(`Error on finding #{userId}`, 'red');
    var token = result.tokenId;
    log(`Check this token is not expired yet: ${token}`, 'blue');
    // if(cb) {cb({
    //   status: (err? 'error': 'success'),
    //   result: result && result.tokenId
    // });}
  });
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

function updateUser(userId, dat, cb) {
  return PUser.findOneAndUpdate({'login': userId}, dat, {'tokenId': false}).exec((err, result) => {
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
      if(e.status === 'success' && !e.result) {
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

function test() {
  findOne('test', ((e) => {
    log(e, 'green');
  }));
}

function addWebhook(webhookId, repository) {
  var repoName = repository.name,
    userId = repository.owner.login;
  findOne(userId, ((e) => {
    var dat = e.result;
    log(dat.repos, 'green');
    var repo = _.find(dat.repos, (repo) => { return repo.name === repoName; });
    if(repo) {
      repo.webhookId = webhookId;
      updateUser(userId, dat, ((e) => {
        log('updated!' + JSON.stringify(e), 'green');
      }));
    }
  }))
}

module.exports = ((mongooseDB) => {
  mongoose = mongooseDB;
  setupSchema();
  // test();
  // removeAll();
  return {
    add: add,
    findOne: findOne,
    findAll: findAll,
    findToken: findToken,
    removeAll: removeAll,
    remove: remove,
    addWebhook: addWebhook
  };
});
