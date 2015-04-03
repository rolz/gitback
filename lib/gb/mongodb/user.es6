'use strict';

/*
 * https://developer.github.com/v3/users/#get-a-single-user
 */

var _ = require('lodash-node'),
  util = require ('../util'),
  auth = require('../github/auth.es6'),
  webhook = require('../github/webhook.es6'),
  log = util.log('mongodb.user', 'GB'),
  PUser, mongoose;

function setupSchema() {
  PUser = mongoose.model('PowerUsers', new mongoose.Schema({
    username: String,
    avatarUrl: String,
    email: String,
    tokenId: String,
    hidden: { type: Boolean, default: false },
    lastLoggedIn: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    repos: [{
      name: String,
      webhookId: String,
      createdWebhookAt: Date,
      lastContributedAt: Date,
      totalCommitCount: Number,
      contribLog: Array
    }]
  }));
}



function findToken(username, cb) {
  return PUser.findOne({'username': username}).exec((err, result) => {
    if(err) log(`Error on finding #{username}`, 'red');
    var token = result.tokenId;
    // log(`Check this token is not expired yet: ${token}`, 'blue');
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result && result.tokenId
    });}
  });
}

function findOne(username, cb, needToken) {
  return PUser.findOne({'username': username},
    needToken? {} : {'tokenId': false})
  .exec((err, result) => {
    if(err) log(`Error on finding #{username}`, 'red');
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result
    });}
  });
}

function updateUser(username, dat, cb) {
  log(dat, 'blue');
  return PUser.findOneAndUpdate({'username': username}, dat, ((err, result) => {
    if(err) log(`Error on finding #{username}`, 'red');
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
  var username = options.username,
    tokenId = options.tokenId;
  if(username && tokenId) {
    findOne(username, (e) => {
      if(!e.result) {
        var user = new PUser (options);
        user.save((err) => {
          if(cb) {cb({
            status: (err? 'error': 'success'),
            message: `user added successfully: ${options.username}`
          });}
        });
      } else {
        // Update user info
        var dat = {
          avatarUrl: options.avatarUrl,
          email: options.email,
          lastLoggedIn: options.lastLoggedIn,
          tokenId: tokenId
        };
        updateUser(username, dat, ((e) => {
          log(e.result);
          if(cb) {cb({
            status: 'error',
            message: `the user already exists: ${options.username}`
          });}
        }));
      }
    });
  } else {
    if(cb) {cb({
      status: 'error',
      message: 'username and tokenId are required'
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

function remove(username, cb) {
  findOne(username, ((e) => {
    var dat = e.result,
      token = dat.tokenId,
      username = dat.username;
    var removeWebhooks = ((repos) => {
      if(repos && repos.length > 0) {
        // Remove webhook
        var repo = repos.shift(),
          repoName = repo.name,
          webhookId = repo.webhookId;
        console.log(repo);
        if(webhookId && webhookId !== 'false') {
          log(`webhookId: ${webhookId}`, 'blue');
          webhook.hook.remove(token, username, repoName, webhookId, ((e) => {
            removeWebhooks(repos);
          }));
        } else {
          removeWebhooks(repos);
        }
      } else {
        // Removed All webhook so remove user info from DB
        log('Removed All webhook so remove app', 'green');
        auth.remove(token, ((e) => {
          log('Removed auth so remove user info from DB', 'green');
          PUser.findOneAndRemove({'username': username}, (err, user) => {
            if(cb) {cb({
              status: (err? 'error': 'success'),
              user: user
            });}
          });
        }));
      }
    });
    removeWebhooks(dat.repos);
  }), true);
}

function addWebhookId(username, repoName, webhookId, cb) {
  log(`addWebhookId: ${username, repoName, webhookId}`, 'blue');
  findOne(username, ((e) => {
    var dat = e.result;
    log(dat.repos, 'green');
    var repo = _.find(dat.repos, (repo) => { return repo.name === repoName; });
    if(repo) {
      repo.webhookId = webhookId;
      repo.createdWebhookAt = Date.now;
      updateUser(username, dat, ((e) => {
        log('updated!' + JSON.stringify(e), 'green');
        if(cb) cb(e);
      }));
    }
  }));
}



function removeWebhookId(username, repoName, cb) {
  log(`removeWebhookId: ${username, repoName}`, 'blue');
  findOne(username, ((e) => {
    var dat = e.result;
    log(dat.repos, 'green');
    var repo = _.find(dat.repos, (repo) => { return repo.name === repoName; });
    if(repo) {
      repo.webhookId = false;
      repo.createdWebhookAt = null;
      repo.lastContributedAt = null;
      repo.totalCommitCount = 0;
      repo.contribLog = [];
      updateUser(username, dat, ((e) => {
        log('updated!' + JSON.stringify(e), 'green');
        if(cb) cb(e);
      }));
    }
  }))
}

function test() {
  // var dat = require('../../../json/push');
  // updatePush(dat);
}



function updateContrib(model, cb) {
  var username = model.username;
  findOne(username, ((e) => {
    var dat = e.result;
    if(dat) {
      var repo = _.find(dat.repos, (repo) => { return repo.name === model.repo; });
      if(repo) {
        repo.lastContributedAt = Date.now;
        repo.totalCommitCount += model.commits.length;
        repo.contribLog.unshift(model);
      }
      updateUser(username, dat, ((e) => {
        // log('updated last push data!' + JSON.stringify(e), 'green');
        if(cb) cb({
          status: e.error? 'error': 'success',
          result: dat
        });
      }));
    }
  }));
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
    update: updateUser,
    removeAll: removeAll,
    remove: remove,
    addWebhookId: addWebhookId,
    removeWebhookId: removeWebhookId,
    updateContrib: updateContrib
  };
});
