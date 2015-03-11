'use strict'

var { RouteHandler, Link } = Router,

App = React.createClass({
  render() {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="dashboard">Dashboard</Link></li>
            <li><Link to="leaderboard">Leaderboard</Link></li>
            <li><Link to="settings">Settings</Link></li>
          </ul>
        </header>
        <main>
          <RouteHandler />
        </main>
      </div>
    );
  }
});

module.exports = App;
