'use strict';

/*
 * SuperAgent: a light-weight progressive ajax API
 * http://visionmedia.github.io/superagent/
 */
var request = require('superagent');

/*
 * timeago: A wrapper for Ryan McGeary's Pretty Date function
 * https://www.npmjs.com/package/timeago
 */
var timeago = require('timeago');
timeago.settings.strings = _.extend(timeago.settings.strings, {
  suffixAgo: null,
  suffixFromNow: '1s',
  seconds: '%ds',
  minute: '1m',
  minutes: '%dm',
  hour: '1h',
  hours: '%dh',
  day: '1d',
  days: '%dd',
  month: '1M',
  months: '%dM',
  year: '1y',
  years: '%dy',
});

module.exports = {
  setLogger() {
    /*
     * Logger setting
     * https://www.npmjs.com/package/js-logger
     */
    Logger.useDefaults();

    /*
     * Only debug if you have "debug=true" in query
     * https://www.npmjs.com/package/query-string
     */
    // if (qs.debug !== 'true') {
    //   Logger.setLevel(Logger.WARN);
    // }
    Logger.setLevel(Logger.DEBUG);
  },
  getUserData(username, cb) {
    request.get(`/users/${username}`, ((err, res) => {
      if (err) throw err;
      if (cb) cb(JSON.parse(res.text));
    }));
  },
  getAllUserData(cb) {
    request.get(`/users`, ((err, res) => {
      if (err) throw err;
      if (cb) cb(JSON.parse(res.text));
    }));
  },
  logout() {
    var HOME_PATH = '/', GB_COOCKIE_KEY = 'gitback';
    Cookies.expire(GB_COOCKIE_KEY);
    window.location.replace(HOME_PATH);
  },
  timeago(timestamp) {
    return timeago(+new Date(timestamp));
  },
  convertCurrency(val) {
    if(val < 1) {
      return `${val*100}&#162;`;
    } else {
      return `&#36;${val}`;
    }
  }
}