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
    avatarUrl: String,
    hidden: Boolean,
    contribAmount: Number,
    raw: mongoose.Schema.Types.Mixed,
    createdAt: Date
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
          var contribData = {
            username: repo.owner.name,
            repo: repo.name,
            commits: e.logs,
            raw: dat,
            createdAt: new Date
          };
          db.user.updateContrib(contribData, ((e) => {
            var userData = e.result;
            contribData.hidden = userData.hidden;
            contribData.avatarUrl = userData.avatarUrl;
            contribData.contribAmount = userData.contribAmountPerPush;
            var model = new PContrib(contribData);
            log(userData, 'yellow');
            model.save((err) => {
              /* Update summary */
              db.summary.update(contribData, ((e) => {
                if(cb) {cb({
                  status: (err? 'error': 'success'),
                  message: `contrib added successfully.`
                });}
                /* Emit if it is a public data */
                if(userData.hidden !== 'true') {
                  socket.emit('onContributed', {
                    contribData: contribData,
                    userData: userData
                  });
                }
              }));
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
  return PContrib.find(dat, {raw: false}).sort({createdAt: -1}).exec(function(err, results){
    if(cb) {cb({
      status: (err? 'error': 'success'),
      message: err || '',
      results: results
    });}
  });
}

function findRecentContributions(cb) {
  return PContrib.find({hidden: false}, {raw: false}).sort({createdAt: -1}).exec(function(err, results){
    if(cb) {cb({
      status: (err? 'error': 'success'),
      message: err || '',
      results: results
    });}
  });
}

function remove(username, cb) {
  return PContrib.remove({username: username}, (err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

function removeAll(cb) {
  return PContrib.remove({}, (err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

function setHidden(username, boo) {
  find({username: username}, ((e) => {
    _.each(e.results, ((result) => {
      PContrib.findByIdAndUpdate(result.id, {hidden: boo}, ((err, item) => { /*log(item.hidden);*/ }));
    }));
  }));
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
}

module.exports = ((mongooseDB) => {
  mongoose = mongooseDB;
  setupSchema();
  // test();
  // setHidden('meowyo', false);
  // removeAll((e) => {log('removed')});
  return {
    add: add,
    find: find,
    findRecentContributions: findRecentContributions,
    remove: remove,
    removeAll: removeAll,
    setHidden: setHidden
  };
});
