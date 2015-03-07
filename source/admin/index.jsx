'use strict'

require('../style/main.scss');
require('./style.scss');

function init() {
  var App = require('./App.jsx');
  React.render(<App />, document.getElementById('app'));
  delete GB.init;
}


if(GB.page === 'admin') {
  init();
} else {
  GB.init = init;
}