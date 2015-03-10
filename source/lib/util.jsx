var logger = Logger.get('lib.util');

/*
 * SuperAgent: a light-weight progressive ajax API
 * http://visionmedia.github.io/superagent/
 */
var request = require('superagent');

module.exports = {
  getUserData(userId, cb) {
    request.get(`/gitlogin/${userId}`, ((err, res) => {
      if (err) throw err;
      if (cb) cb(JSON.parse(res.text));
    }));
  },
  getAllUserData(cb) {
    request.get(`/gitlogins`, ((err, res) => {
      if (err) throw err;
      if (cb) cb(JSON.parse(res.text));
    }));
  }
}