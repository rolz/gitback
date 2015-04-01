require('babel/register');
exports.server = require('./server/index.es6');
exports.github = require('./github/index.es6');
exports.mongodb = require('./mongodb/index.es6');
exports.payments = require('./payments/index.es6');
