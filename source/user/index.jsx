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

/*
 * Temporary contect data.
 */
var context = require('../json/context');

function init() {
  var { Route, DefaultRoute, NotFoundRoute } = Router,
    App = require('./App.jsx'),
    Dashboard = require('./components/dashboard'),
    Leaderboard = require('./components/leaderboard').index,
    LeaderboardRanking = require('./components/leaderboard').ranking,
    Settings = require('./components/settings');

  var routes = (
    <Route name="app" path="/user" handler={App}>
      <Route name="dashboard" handler={Dashboard} />
      <Route name="leaderboard" path="leaderboard" handler={Leaderboard}>
        <Route name="ranking" path=":ranking" handler={LeaderboardRanking}/>
        <DefaultRoute handler={LeaderboardRanking}/>
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
  router.run((Handler, state) => {
    /*
     * Dynamic Segments
     * We've used this alternative way to get params and for adding context.
     * You can access the params with this.props.params
     * https://github.com/rackt/react-router/blob/master/docs/guides/overview.md#dynamic-segments
     */
    var params = state.params || {},
      name = state.path.split('/')[2];
    params.name = name;
    params.state = state;
    params.context = _.extend(context.common, context.user[name]);
    React.render(<Handler params={params} />, document.getElementById('app'));
  });
  delete GB.init;
}

if(GB.page === 'user') {
  init();
} else {
  GB.init = init;
}
