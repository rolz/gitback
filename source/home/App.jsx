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
    var {username, repo, avatarUrl, createdAt, commits} = this.props.user;
    return (
      <li className="user">
        <img className="user-img" src={avatarUrl} />
        <div className="user-info">
          <p className="user-contribution">{username} gave ${commits.length * .01}</p>
          <p className="user-repo"><a href={`http://github.com/${username}/${repo}`}>{`${username}/${repo}`}</a></p>
        </div>
        <p className="time-elapsed">{(new Date(createdAt).toString())}</p>
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
