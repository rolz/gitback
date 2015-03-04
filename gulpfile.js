'use strict';

/*
 * Gulp supports ES6 in the version 4.
 * For now we use babel.
 * Also we might change the extention from .es6 to other one such as .6to5.js
 * https://github.com/gulpjs/gulp/issues/830
 */

require('babel/register');
require('./gulpfile.es6');