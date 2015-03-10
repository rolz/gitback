'use strict';

/*
 * https://developer.github.com/v3/users/#get-a-single-user
 */

var _ = require('lodash-node'),
  util = require ('../util'),
  webhook = require('../github/webhook.es6'),
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
    // log(`Check this token is not expired yet: ${token}`, 'blue');
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result && result.tokenId
    });}
  });
}

function findOne(userId, cb, needToken) {
  return PUser.findOne({'login': userId},
    needToken? {} : {'tokenId': false})
  .exec((err, result) => {
    if(err) log(`Error on finding #{userId}`, 'red');
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result
    });}
  });
}

function updateUser(userId, dat, cb) {
  log(dat, 'blue');
  return PUser.findOneAndUpdate({'login': userId}, dat, ((err, result) => {
    if(err) log(`Error on finding #{userId}`, 'red');
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result
    });}
  }));
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
  var userId = options.login,
    tokenId = options.tokenId;
  if(userId && tokenId) {
    findOne(userId, (e) => {
      if(!e.result) {
        var user = new PUser (options);
        user.save((err) => {
          if(cb) {cb({
            status: (err? 'error': 'success'),
            message: `user added successfully: ${options.login}`
          });}
        });
      } else {
        // Update user info
        log(options);
        var dat = {
          avatarUrl: options.avatarUrl,
          email: options.email,
          tokenId: tokenId
        };
        updateUser(userId, dat, ((e) => {
          log(e.result);
          if(cb) {cb({
            status: 'error',
            message: `the user already exists: ${options.login}`,
            private: e.result.private
          });}
        }));
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
  PUser.remove({private: false}, (err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

function remove(userId, cb) {
  findOne(userId, ((e) => {
    var dat = e.result,
      token = dat.tokenId,
      userId = dat.login;
    var removeWebhooks = ((repos) => {
      if(repos && repos.length > 0) {
        // Remove webhook
        var repo = repos.shift(),
          repoName = repo.name,
          webhookId = repo.webhookId;
        console.log(repo);
        if(webhookId && webhookId !== 'false') {
          log(`webhookId: ${webhookId}`, 'blue');
          webhook.hook.remove(token, userId, repoName, webhookId, ((e) => {
            removeWebhooks(repos);
          }));
        } else {
          removeWebhooks(repos);
        }
      } else {
        // Removed All webhook so remove user info from DB
        log('Removed All webhook so remove user info from DB', 'green');
        PUser.findOneAndRemove({'login': userId}, (err, user) => {
          if(cb) {cb({
            status: (err? 'error': 'success'),
            user: user
          });}
        });
      }
    });
    removeWebhooks(dat.repos);
    // log(e);
  }), true);
}

function test() {
  findOne('test', ((e) => {
    log(e, 'green');
  }));
}

function addWebhookId(userId, repoName, webhookId, cb) {
  log(`addWebhookId: ${userId, repoName, webhookId}`, 'blue');
  findOne(userId, ((e) => {
    var dat = e.result;
    log(dat.repos, 'green');
    var repo = _.find(dat.repos, (repo) => { return repo.name === repoName; });
    if(repo) {
      repo.webhookId = webhookId;
      updateUser(userId, dat, ((e) => {
        log('updated!' + JSON.stringify(e), 'green');
        if(cb) cb(e);
      }));
    }
  }));
}

function removeWebhookId(userId, repoName, cb) {
  log(`removeWebhookId: ${userId, repoName}`, 'blue');
  findOne(userId, ((e) => {
    var dat = e.result;
    log(dat.repos, 'green');
    var repo = _.find(dat.repos, (repo) => { return repo.name === repoName; });
    if(repo) {
      repo.webhookId = false;
      updateUser(userId, dat, ((e) => {
        log('updated!' + JSON.stringify(e), 'green');
        if(cb) cb(e);
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
    addWebhookId: addWebhookId,
    removeWebhookId: removeWebhookId
  };
});
