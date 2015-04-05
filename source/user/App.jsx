'use strict'

var Header = require('../components/header');
var Menu = require('../components/menu');
var PaymentMethod = require('../components/payments');
var {RouteHandler, Link} = Router,

App = React.createClass({
  render() {
    return (
      <div>
        <Header link={Link}/>
        <RouteHandler {...this.props}/>
        <PaymentMethod />
      </div>
    );
  }
});

module.exports = App;
