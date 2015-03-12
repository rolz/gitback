'use strict'

var Today = React.createClass({
  render() {
    return (
      <div section="today">
        <h1>Leaderboard</h1>
        <h2>Today</h2>
      </div>
    );
  }
});

var Week = React.createClass({
  render() {
    return (
      <div section="week">
        <h1>Leaderboard</h1>
        <h2>This Week</h2>
      </div>
    );
  }
});

var Month = React.createClass({
  render() {
    return (
      <div section="month">
        <h1>Leaderboard</h1>
        <h2>This Month</h2>
      </div>
    );
  }
});

var AllTime = React.createClass({
  render() {
    return (
      <div section="alltime">
        <h1>Leaderboard</h1>
        <h2>All Time</h2>
      </div>
    );
  }
});

var { RouteHandler, Link } = Router;

var App = React.createClass({
  // mixins: [Router.State],
  render: function () {
    // console.log(this.getParams().time);
    return (
      <div>
        <nav>
          <ul>
            <li><Link to="today">Today</Link></li>
            <li><Link to="week">This Week</Link></li>
            <li><Link to="month">This Month</Link></li>
            <li><Link to="alltime">All time</Link></li>
          </ul>
        </nav>
        <RouteHandler/>
      </div>
    );
  }
});

module.exports = App;
