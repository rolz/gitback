'use strict'

var USERS = [
  {
    id: 672890,
    name: "Abid Din",
    user: "craftedpixelz",
    repo: {
      name: "craftedpixelz/shibui",
      url: "http://github.com/craftedpixelz/shibui"
    },
    donation: 0.06,
    lastCommit: '9s'
  },
  {
    id: 1561533,
    name: "Zac Rolland",
    user: "rolz",
    repo: {
      name: "rolz/BattleHackLA",
      url: "http://github.com/rolz/BattleHackLA"
    },
    donation: 0.03,
    lastCommit: '30s'
  },
  {
    id: 588874,
    name: "Mayo Tobita",
    user: "mayognaise",
    repo: {
      name: "mayognaise/whats-svg",
      url: "http://github.com/mayognaise/whats-svg"
    },
    donation: 0.22,
    lastCommit: '53s'
  }
];

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
  render() {
    return (
      <div className="container home">
        <div className="overlay">
          <div className="content">
            <Intro/>
            <LiveFeed users={USERS} />
            <Login/>
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
