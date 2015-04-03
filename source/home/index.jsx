'use strict'

require('../style/main.scss');
require('./style.scss');

/*
 * temporary context data
 */
var context = require('../json/context');

var util = require('../lib/util.jsx');
util.setLogger();

function init() {
  var App = require('./App.jsx');
  React.render(<App context={_.extend(context.common, context.home)} />, document.getElementById('app'));
  delete GB.init;
}


if(GB.page === 'home') {
  init();
} else {
  GB.init = init;
}
