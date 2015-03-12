'use strict'

var GB = window.GB = window.GB || {};

var qs = GB.qs = require('query-string').parse(location.search);

var util = require('./util.jsx');

util.setLogger();

var logger = Logger.get('lib');



function init(page) {
  // Get all users infomation
  util.getAllUserData((e) => {
    GB.page = page;
    GB.users = e.result;
    GB.init && GB.init();
  });
  Cookies.expire(GB_LOGIN_COOCKIE_KEY);
};

/*
 * Coockie setting for login
 * https://www.npmjs.com/package/cookies-js
 */
var GB_COOCKIE_KEY = 'gitback',
  GB_LOGIN_COOCKIE_KEY = GB_COOCKIE_KEY + '_login',
  HOME_PATH = '/',
  USER_PATH = '/user',
  LOGIN_PATH = '/login',
  ADMIN_PATH = '/admin';
var pathname = window.location.pathname;
var coockieValue = Cookies.get(GB_COOCKIE_KEY),
  loginCoockieValue = Cookies.get(GB_LOGIN_COOCKIE_KEY);
logger.info('coockieValue:', coockieValue);
logger.info('loginCoockieValue:', loginCoockieValue);
logger.info('gitlogin:', GB.gitlogin);


if(pathname === ADMIN_PATH) {
  // Ignore auth in admin page
  logger.info('admin app');
  GB.login = coockieValue;
  init('admin');
} else {
  // If user info is updated, go through.
  if(coockieValue) {
    // Get user information
    util.getUserData(coockieValue, ((e) => {
      if(e.status === 'success') {
        var lastLoggedIn = +new Date(e.result.lastLoggedIn),
          currentServerTime = +new Date(st),
          timeDifference = currentServerTime - lastLoggedIn;
        logger.info('timeDifference:', Math.floor(timeDifference /1000/60), 'min');
        // Check if user info is updated no longer than 1 day
        if(!loginCoockieValue && (timeDifference > 1000*60*60*24)) {
          // Update user info for token
          Cookies.set(GB_LOGIN_COOCKIE_KEY, true);
          window.location.replace(LOGIN_PATH);
        } else {
          if(('/' + pathname.split('/')[1]) === USER_PATH) {
            // Show user app
            logger.info('user app', e);
            GB.user = e.result;
            init('user');
          } else {
            // Redirect to user page
            window.location.replace(USER_PATH);
          }
        }
      } else {
        // there is no info so expire coockie and show homepage
        Cookies.expire(GB_COOCKIE_KEY);
        if(pathname === HOME_PATH) {
          logger.info('home app');
          init('home');
        } else {
          // Redirect to homepage
          window.location.replace(HOME_PATH);
        }
      }
    }));
  } else {
    // Check if there is GB.gitlogin
    if(GB.gitlogin) {
      // Add gitlogin in coockie
      Cookies.set(GB_COOCKIE_KEY, GB.gitlogin);
      logger.info('added coockie!!', GB_COOCKIE_KEY, GB.gitlogin);
      // Redirect to user page
      Cookies.set(GB_LOGIN_COOCKIE_KEY, true);
      window.location.replace(USER_PATH);
    } else {
      // Show homepage
      if(pathname === HOME_PATH) {
        logger.info('home app');
        init('home');
      } else {
        // Redirect to homepage
        window.location.replace(HOME_PATH);
      }
    }
  }
}