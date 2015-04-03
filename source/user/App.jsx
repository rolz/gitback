'use strict'

var PaymentMethod = require('../user/components/payments');
var {RouteHandler, Link} = Router,

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
        <RouteHandler {...this.props}/>
        <PaymentMethod />
      </div>
    );
  }
});

module.exports = App;
