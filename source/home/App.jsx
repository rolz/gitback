'use strict'

var Intro = React.createClass({
  render() {
    return (
      <section className="intro">
        <a href="/" className="logo">Gitback</a>
        <section className="tagline">
          <p>Empowering <em>female developers</em> to code with every commit.</p>
        </section>
      </section>
    );
  }
});

var LiveFeed = React.createClass({
  render() {
    var rows = [];

    this.props.users.forEach(function(user) {
      rows.push(<LiveFeedItem
        user={user}
        id={user.id}
        name={user.name}
        repoName={user.repo.name}
        repoUrl={user.repo.url}
        donation={user.donation}
        commiTime={user.lastCommit} />);
    }.bind(this));

    return (
      <section className="feed">
        <ul>
          {rows}
        </ul>
      </section>
    );
  }
});

var LiveFeedItem = React.createClass({
  render() {
    var avatarUrl = "https://avatars2.githubusercontent.com/u/" + this.props.user.id;
    return (
      <li className="user">
        <img className="user-img" src={avatarUrl} />
        <div className="user-info">
          <p className="user-contribution">{this.props.user.name} gave ${this.props.user.donation}</p>
          <p className="user-repo"><a href={this.props.user.repo.url}>{this.props.user.repo.name}</a></p>
        </div>
        <p className="time-elapsed">{this.props.user.lastCommit} ago</p>
      </li>
    )
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
  mixins: [
    Reflux.connect(require('../store/LiveFeedStore.jsx'), 'users')
  ],
  render() {
    return (
      <div className="container home">
        <div className="overlay">
          <div className="content">
            <Intro/>
            <LiveFeed users={this.state.users} />
            <Login/>
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
