var logger = Logger.get('lib.util');

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
  getUserData(userId, cb) {
    request.get(`/users/${userId}`, ((err, res) => {
      if (err) throw err;
      if (cb) cb(JSON.parse(res.text));
    }));
  },
  getAllUserData(cb) {
    request.get(`/users`, ((err, res) => {
      if (err) throw err;
      if (cb) cb(JSON.parse(res.text));
    }));
  }
}