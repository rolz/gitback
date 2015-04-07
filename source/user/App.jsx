'use strict'

var Header = require('../components/header');
var PaymentMethod = require('../components/payments');
var {RouteHandler, Link} = Router,

App = React.createClass({
  render() {
    return (
      <div>
        <Header />
        <RouteHandler {...this.props}/>
        <PaymentMethod />
      </div>
    );
  }
});

module.exports = App;
