'use strict'

/*
 * React Router
 * A complete routing library for React.
 * https://github.com/rackt/react-router
 */

require('../style/main.scss');
require('./style.scss');

var util = require('../lib/util.jsx');
util.setLogger();

function init() {
  var { Route, DefaultRoute, NotFoundRoute } = Router,
    App = require('./App.jsx'),
    Dashboard = require('./components/dashboard'),
    Leaderboard = require('./components/leaderboard'),
    Settings = require('./components/settings');

  var routes = (
    <Route name="app" path="/user" handler={App}>
      <Route name="dashboard" handler={Dashboard} />
      <Route name="leaderboard" handler={Leaderboard}>
        <Route name="today" path="today" handler={Leaderboard} />
        <Route name="week" path="week" handler={Leaderboard} />
        <Route name="month" path="month" handler={Leaderboard} />
        <Route name="alltime" path="alltime" handler={Leaderboard} />
      </Route>
      <Route name="settings" handler={Settings} />
      <DefaultRoute handler={Dashboard}/>
      <NotFoundRoute handler={Dashboard}/>
    </Route>
  );

  var router = Router.create({
    routes: routes,
    location: Router.HistoryLocation
  });
  router.run((Handler) => {
    React.render(<Handler/>, document.getElementById('app'));
  });
  delete GB.init;
}

if(GB.page === 'user') {
  init();
} else {
  GB.init = init;
}
