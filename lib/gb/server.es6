'use strict';

var _ = require('lodash-node'),
  util = require ('./util'),
  log = util.log('server', 'GB'),
  app, express;

function setStaticDir(options) {
  if(app && express) {
    var set = (dir => {app.use(express.static(process.cwd() + dir));});
    if(_.isArray(options)) {
      options.forEach(dir => {set(dir);});
    } else if(_.isString(options)) {
      set(options);
    } else {
      throw Error('Error');
    }
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

function setRoute(options) {
  var obj = {
    version: require('../../package').version,
    options: options,
    development: !!(process.env.NODE_ENV === 'development')
  };
  // console.log(obj);
  app.get('/admin', (function(req, res) {
    res.render('admin', obj);
  }));
  app.get('/', (function(req, res) {
    res.render('user', obj);
  }));
}

exports.connect = ((expressApp, expressServer, options) => {
  if(expressApp && expressServer) {
    app = expressApp;
    express = expressServer;
    setBodyParser();
    setHandlebars();
    setRoute(options);
    if(_.isObject(options)) {
      if(options.port) {
        var port = process.env.PORT || options.port;
        app.listen(port);
        log(`listening to ${port}`, 'red');
      }
      if(options.staticDir) setStaticDir(options.staticDir);
    }
  } else {
    throw Error('Error');
  }
});

exports.setStaticDir = setStaticDir;