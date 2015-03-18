'use strict'

var Intro = React.createClass({
  render() {
    return (
      <section className="intro">
        <a href="/" className="logo">GitBack</a>
        <section className="tagline">
          <p>Empowering <em>female developers</em> to code with every commit.</p>
        </section>
      </section>
    );
  }
});

var Feed = React.createClass({
  render() {
    return (
      <section className="feed">
        <ul>
          <li className="user">
            <img className="user-img" src="https://avatars2.githubusercontent.com/u/1561533?v=3&s=460" />
            <div className="user-info">
              <span className="user-contribution">Zac gave $0.4</span>
              <span className="user-repo"><a href="#">rolz/gitback</a></span>
            </div>
            <span className="time-elapsed">6s ago</span>
          </li>
          <li className="user">
            <img className="user-img" src="https://avatars3.githubusercontent.com/u/672890?v=3&s=460" />
            <div className="user-info">
              <span className="user-contribution">craftedpixelz gave $0.6</span>
              <span className="user-repo"><a href="#">craftedpixelz/website</a></span>
            </div>
            <span className="time-elapsed">20s ago</span>
          </li>
          <li className="user">
            <img className="user-img" src="https://avatars3.githubusercontent.com/u/588874?v=3&s=460" />
            <div className="user-info">
              <span className="user-contribution">mayognaise gave $0.10</span>
              <span className="user-repo"><a href="#">mayognaise/ES6</a></span>
            </div>
            <span className="time-elapsed">52s ago</span>
          </li>
        </ul>
      </section>
    );
  }
});

var Login = React.createClass({
  render() {
    return (
      <a href="/login" className="login-btn"><i className="icon"></i>Sign in with GitHub</a>
    );
  }
});

var Footer = React.createClass({
  render() {
    return (
      <footer></footer>
    );
  }
});

var App = React.createClass({
  render() {
    return (
      <div className="container home">
        <div className="overlay">
          <div className="content">
            <Intro/>
            <Feed/>
            <Login/>
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
