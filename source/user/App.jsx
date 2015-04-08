'use strict'

var Header = require('../components/header');
var {RouteHandler} = Router,

App = React.createClass({
  render() {
    return (
      <div>
        <Header />
        <RouteHandler {...this.props}/>
      </div>
    );
  }
});

module.exports = App;
