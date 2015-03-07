'use strict'

require('../style/main.scss');
var App = require('./App.jsx');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// TO BE IMPLEMENTED:
// var routes = (
//   <Route name="app" path="/" handler={home}>
//     <Route name="dashboard" handler={dashboard}/>
//     <Route name="settings" handler={settings}/>
//     <DefaultRoute handler={home}/>
//   </Route>
// );
//
// Router.run(routes, function (Handler) {
//   React.render(<App/>, document.getElementById('app'));
// });

React.render(<App />, document.getElementById('app'));
