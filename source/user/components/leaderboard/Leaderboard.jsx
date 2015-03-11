'use strict'

var Today = React.createClass({
  render() {
    return (
      <div>
        <h1>Leaderboard</h1>
        <h2>Today</h2>
      </div>
    );
  }
});

var Week = React.createClass({
  render() {
    return (
      <div>
        <h1>Leaderboard</h1>
        <h2>This Week</h2>
      </div>
    );
  }
});

var Month = React.createClass({
  render() {
    return (
      <div>
        <h1>Leaderboard</h1>
        <h2>This Month</h2>
      </div>
    );
  }
});

var AllTime = React.createClass({
  render() {
    return (
      <div>
        <h1>Leaderboard</h1>
        <h2>All Time</h2>
      </div>
    );
  }
});

module.exports = Today;
