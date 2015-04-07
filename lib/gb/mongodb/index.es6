'use strict';

/*
 * https://github.com/mikedeboer/node-github
 */

var _ = require('lodash-node'),
  mongoose = require ('mongoose'),
  config = require('../../../json/config'),
  options = config.mongodb,
  util = require ('../util'),
  log = util.log('mongodb', 'GB'),
  app, user, contrib, commit, summary;

function setRoutes() {
  app.get('/users/:id', function (req, res, next) {
    var username = req.params.id;
    user.findOne(username, ((e) => {
      if(e.status === 'success') {
        if(e.result) {
          res.json({
            status: 'success',
            result: e.result
          });
        } else {
          res.json({
            status: 'error',
            message: 'invalid user'
          });
        }
      }
    }));
  });

  app.get('/users', function (req, res, next) {
    var username = req.params.id;
    user.findAll(((e) => {
      if(e.status === 'success') {
        if(e.result) {
          res.json({
            status: 'success',
            result: e.result
          });
        } else {
          res.json({
            status: 'error',
            message: 'no data'
          });
        }
      }
    }));
  });
}

function removeAll() {
  user.removeAll(((e) => {
    contrib.removeAll(((e) => {
      commit.removeAll(((e) => {
        summary.removeAll(((e) => {
          log('removed all!', 'green');
        }));
      }));
    }));
  }));
}

exports.connect = ((expressApp, cb) => {
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
      contrib = require('./contrib.es6')(mongoose);
      commit = require('./commit.es6')(mongoose);
      summary = require('./summary.es6')(mongoose);
      exports.user = user;
      exports.contrib = contrib;
      exports.commit = commit;
      exports.summary = summary;
      setRoutes();
      // removeAll();
      if(cb) {
        cb({
          status: 'success',
          db: {user: user}
        });
      }
    }
  });
});
