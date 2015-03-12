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
    login: String,
    avatarUrl: String,
    email: String,
    tokenId: String,
    anonymous: Boolean,
    lastLoggedIn: Number,
    createdAt: Number,
    repos: [{
      name: String,
      webhookId: String,
      createdWebhookAt: Number,
      lastPushedAt: Number,
      totalPushesCount: Number,
      pushesLog: [{
        time: String,
        firstPushDateOfTheMonth: Number,
        pushesCount: Number
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
        var dat = {
          avatarUrl: options.avatarUrl,
          email: options.email,
          lastLoggedIn: options.lastLoggedIn,
          tokenId: tokenId
        };
        updateUser(userId, dat, ((e) => {
          log(e.result);
          if(cb) {cb({
            status: 'error',
            message: `the user already exists: ${options.login}`
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
  PUser.remove({}, (err) => {
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
        log('Removed All webhook so remove app', 'green');
        auth.remove(token, ((e) => {
          log('Removed auth so remove user info from DB', 'green');
          PUser.findOneAndRemove({'login': userId}, (err, user) => {
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

function addWebhookId(userId, repoName, webhookId, cb) {
  log(`addWebhookId: ${userId, repoName, webhookId}`, 'blue');
  findOne(userId, ((e) => {
    var dat = e.result;
    log(dat.repos, 'green');
    var repo = _.find(dat.repos, (repo) => { return repo.name === repoName; });
    if(repo) {
      repo.webhookId = webhookId;
      repo.createdWebhookAt = Date.now();
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
      repo.createdWebhookAt = null;
      repo.lastPushedAt = null;
      repo.pushesCount = 0;
      repo.pushesLog = [];
      updateUser(userId, dat, ((e) => {
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


function updatePush(dat) {
  var repository = dat.repository,
    repoName = repository.name,
    userId = repository.owner.name,
    pusherName = dat.pusher.name;
  if(userId === pusherName) {
    findOne(userId, ((e) => {
      var dat = e.result;
      if(dat) {
        var repo = _.find(dat.repos, (repo) => { return repo.name === repoName; });
        if(repo) {
          var lastPushedAt = Date.now(),
            date = new Date(lastPushedAt),
            yyyy = date.getUTCFullYear(),
            mm = date.getUTCMonth() + 1;
          repo.lastPushedAt = lastPushedAt;
          repo.totalPushesCount++;
          var logItem = _.find(repo.pushesLog, ((item) => {
            var firstPushDateOfTheMonth = item.firstPushDateOfTheMonth,
              itemDate = new Date(firstPushDateOfTheMonth),
              itemyyyy = itemDate.getUTCFullYear(),
              itemmm = itemDate.getUTCMonth() + 1;
            return !!(yyyy === itemyyyy && mm === itemmm);
          }));
          if(logItem) {
            logItem.pushesCount++;
            // logItem.time = `${mm}/${yyyy}`;
          } else {
            logItem = {
              time: `${mm}/${yyyy}`,
              firstPushDateOfTheMonth: lastPushedAt,
              pushesCount: 1
            };
            repo.pushesLog.push(logItem);
          }
          updateUser(userId, dat, ((e) => {
            log('updated last push data!' + JSON.stringify(e), 'green');
          }));
        }
      }
    }));
  }
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
    updatePush: updatePush
  };
});
