'use strict';

/**
  {
    "id": "cf3cda596bdf532f55b2c6191f9fcc39a69babaa",
    "distinct": true,
    "message": "ohayo",
    "timestamp": "2015-03-12T15:18:01-07:00",
    "url": "https://github.com/mayognaise/hello/commit/cf3cda596bdf532f55b2c6191f9fcc39a69babaa",
    "author": {
        "name": "Mayo Tobita",
        "email": "tobimayo@gmail.com",
        "username": "mayognaise"
    },
    "committer": {
        "name": "Mayo Tobita",
        "email": "tobimayo@gmail.com",
        "username": "mayognaise"
    },
    "added": [],
    "removed": [],
    "modified": ["README.md"]
  }
 */

var _ = require('lodash-node'),
  util = require ('../util'),
  log = util.log('mongodb.commit', 'GB'),
  PCommit, mongoose;

function setupSchema() {
  PCommit = mongoose.model('PowerCommits', new mongoose.Schema({
    username: String,
    repo: String,
    sha: String,
    message: String,
    raw: mongoose.Schema.Types.Mixed,
    committedAt: Number,
    createdAt: Number
  }));
}

function find(dat, cb) {
  return PCommit.findOne({'sha': dat.id}).exec((err, result) => {
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result
    });}
  });
}

function add(commit, repo, cb) {
  find(commit, ((e) => {
    if(e.result) {
      // already exists
      if(cb) {cb({
        status: 'error',
        message: `the commit has already added: ${commit.id}`
      });}
    } else {
      // add
      var model = new PCommit ({
        username: repo.owner.name,
        repo: repo.name,
        sha: commit.id,
        message: commit.message,
        raw: commit,
        committedAt: (new Date(commit.timestamp)).getUTCMilliseconds(),
        createdAt: Date.now()
      });
      model.save((err) => {
        if(cb) {cb({
          status: (err? 'error': 'success'),
          message: `commit added successfully: ${commit.id}`
        });}
      });
    }
  }));
}

function remove(username, cb) {
  return PCommit.remove({username: username}, (err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

function removeAll(cb) {
  return PCommit.remove({}, (err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

function test() {}

module.exports = ((mongooseDB) => {
  mongoose = mongooseDB;
  setupSchema();
  // test();
  // removeAll((e) => {log('removed')});
  return {
    add: add,
    find: find,
    remove: remove,
    removeAll: removeAll
  };
});
