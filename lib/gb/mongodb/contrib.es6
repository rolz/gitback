'use strict';

/*
  [{
      "_id": "5508d0df17b28fa5424ee6c4",
      "username": "mayognaise",
      "repo": "hello",
      "createdAt": Date,
      "commits": ["cf3cda596bdf532f55b2c6191f", "5b2c6191f9fcc39a69babbb"],
      "__v": 0
  }]
 */

var _ = require('lodash-node'),
  util = require ('../util'),
  log = util.log('mongodb.contrib', 'GB'),
  db = require ('./index.es6'),
  socket = require ('../server/socket.es6'),
  PContrib, mongoose;

function setupSchema() {
  PContrib = mongoose.model('PowerContribs', new mongoose.Schema({
    username: String,
    repo: String,
    commits: Array,
    raw: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  }));
}

function addCommits(commits, repo, cb, logs) {
  logs = logs || [];
  if(commits.length > 0) {
    var commit = commits.shift();
    db.commit.add(commit, repo, ((e) => {
      log(e.message, e.status === 'success'? 'green' : 'red');
      if(e.status === 'success') {
        logs.push(commit.id);
      }
      addCommits(commits, repo, cb, logs);
    }));
  } else {
    if(cb) {cb({
      status: 'success',
      message: 'added commits',
      logs: logs
    });}
  }
}

function getValidCommits(dat) {
  if(dat.repository && dat.commits) {
    var owner = dat.repository.owner.name;
    return _.filter(dat.commits, (item) => {return item.committer.username === owner;});
  } else {
    return [];
  }
}

function add(dat, cb) {
  if(dat.repository && dat.commits) {
    var commits = getValidCommits(dat);
    if(commits && commits.length > 0) {
      var repo = dat.repository;
      addCommits(commits, repo, ((e) => {
        if(e.status === 'success' && e.logs.length > 0) {
          /* Add contrib model */
          var modelData = {
            username: repo.owner.name,
            repo: repo.name,
            commits: e.logs,
            raw: dat,
          };
          db.user.updateContrib(modelData, ((e) => {
            var userData = e.result,
              model = new PContrib(modelData);
            log(userData, 'yellow');
            model.save((err) => {
              if(cb) {cb({
                status: (err? 'error': 'success'),
                message: `contrib added successfully.`
              });}
              if(userData.hidden !== 'true') {
                modelData.avatarUrl = userData.avatarUrl;
                socket.emit('onContributed', modelData);
              }
            });
          }));
        } else {
          if(cb) {cb({
            status: 'error',
            message: 'there is no contrib to add.'
          });}
        }
      }));
    } else {
      if(cb) {cb({
        status: 'error',
        message: 'there is no commits'
      });}
    }
  } else {
    if(cb) {cb({
      status: 'error',
      message: 'there is no repo or commits'
    });}
  }
}

function find(dat, cb) {
  dat = dat || {};
  return PContrib.find(dat, {raw: false}).sort('-created').exec(function(err, results){
    if(cb) {cb({
      status: (err? 'error': 'success'),
      message: err || '',
      results: results
    });}
  });
}

function findRecentContributions(cb) {
  return PContrib.find({}, {raw: false}).sort('-created').exec(function(err, results){
    if(cb) {cb({
      status: (err? 'error': 'success'),
      message: err || '',
      results: results.slice(0,3)
    });}
  });
}

function removeAll(cb) {
  PContrib.remove({}, (err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

function test() {
  // if(db.commit) {
  //   var dat = require('../../../json/push');
  //   add(dat, ((e) => {
  //     log(e.message, e.status === 'success'? 'blue' : 'red');
  //   }));
  // } else {
  //   setTimeout(test, 1000);
  // }
  find({}, ((e) => {
    log(e.results.slice(0,3));
  }));
}

module.exports = ((mongooseDB) => {
  mongoose = mongooseDB;
  setupSchema();
  // test();
  removeAll((e) => {log('removed')});
  return {
    add: add,
    find: find,
    findRecentContributions: findRecentContributions
  };
});
