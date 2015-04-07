'use strict';

var _ = require('lodash-node'),
  util = require ('../util'),
  log = util.log('mongodb.summary', 'GB'),
  PSummary, mongoose;

function setupSchema() {
  PSummary = mongoose.model('PowerSummary', new mongoose.Schema({
    totalPledgedAmount: { type: Number, default: 0 }
  }));
}

function find(cb) {
  return PSummary.findOne({}).exec((err, result) => {
    if(cb) {cb({
      status: (err? 'error': 'success'),
      result: result
    });}
  });
}

function add(cb) {
  var model = new PSummary ();
  model.save((err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

function update(dat, cb) {
  find((e) => {
    if(e.result) {
      var model = e.result;
      model.totalPledgedAmount += dat.contribAmount;
      return PSummary.findOneAndUpdate({}, model, ((err, result) => {
        if(cb) {cb({
          status: (err? 'error': 'success'),
          result: result
        });}
      }));
    }
  });
}

function removeAll(cb) {
  return PSummary.remove({}, (err) => {
    if(cb) {cb({
      status: (err? 'error': 'success')
    });}
  });
}

function init() {
  find((e) => {
    if(!e.result) {
      add((e) => { log(e); });
    } else {
      log(`totalPledgedAmount: ${e.result.totalPledgedAmount}`);
    }
  });
}

module.exports = ((mongooseDB) => {
  mongoose = mongooseDB;
  setupSchema();
  init();
  // removeAll((e) => {log('removed')});
  return {
    find: find,
    update: update,
    removeAll: removeAll
  };
});
