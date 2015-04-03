'use strict';

/*
 * SuperAgent: a light-weight progressive ajax API
 * http://visionmedia.github.io/superagent/
 */
var request = require('superagent');

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
  }
}