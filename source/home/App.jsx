'use strict'

var App = React.createClass({
  render() {
    return (
      <div>
        <a href="/" className="logo">GitBack</a>
        <p>We’re uniting the dev community and teaching girls to code. Sign up with your GitHub account, and pledge donations for every commit you make. Let’s make the world a better place.</p>
        <div className="total-raised">
          <strong>$120.01</strong>
          <small>raised so far</small>
        </div>
        <a href="/login">Login with GitHub</a>
      </div>
    );
  }
});

module.exports = App;
