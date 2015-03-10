'use strict'

require('../style/main.scss');
require('./style.scss');

var util = require('../lib/util.jsx');
util.setLogger();

function init() {
  var App = require('./App.jsx');
  React.render(<App />, document.getElementById('app'));
  delete GB.init;
}


if(GB.page === 'home') {
  init();
} else {
  GB.init = init;
}