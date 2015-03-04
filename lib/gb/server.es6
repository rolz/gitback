'use strict';

var _ = require('lodash-node'),
  colors = require('colors'),
  app;

function setStaticDir(express, options, dirname) {
  var set = (dir => {app.use('', express.static(dirname + dir));});
  if(_.isArray(options)) {
    options.forEach(dir => {set(dir);});
  } else if(_.isString(options)) {
    set(options);
  } else {
    throw Error('Error');
  }
}

function setBodyParser() {
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
  }));
}

function setHandlebars() {
  var exphbs = require('express-handlebars');
  // Create `ExpressHandlebars` instance with a default layout.
  var hbs = exphbs.create({defaultLayout: 'main'});
  // Register `hbs` as our view engine using its bound `engine()` function.
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
}

function setRoute() {
  app.get('/admin', (function(req, res) {
    res.render('admin', {version: 'hello'});
  }));
  app.get('/', (function(req, res) {
    res.render('user');
  }));
}

exports.connect = ((expressApp, express, options, dirname) => {
  app = expressApp;
  if(options.staticDir && dirname) setStaticDir(express, options.staticDir, dirname);
  app.listen(options.port);
  console.log(`Listening to ${options.port}`.green);
  setBodyParser();
  setHandlebars();
  setRoute();
});