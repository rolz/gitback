'use strict'

var Hero = React.createClass({
  render() {

    var self = this,
      {projectTitle, heroSection, sectionTwo} = this.props.context;
      console.log(this.props.users);
    return (
      <section className="hero">
        <section className="header clearfix">
          <a className="logo" href="/">{projectTitle}</a>
          <ul>
            <li><a href="#getInvolved">{heroSection.nav[0]}</a></li>
            <li><a href="#ourMission">{heroSection.nav[1]}</a></li>
          </ul>
          <a href="/login" className="login">{heroSection.login}</a>
        </section>
        <section className="jumbotron">
          <div className="tagline" dangerouslySetInnerHTML={{__html:heroSection.tagline}}></div>
          <div className="userActions">
            <a href="/login"><span className="signUp">{heroSection.signUp}<img src="/assets/images/github-logo.svg"/></span></a>
          </div>
        </section>
        <section className="contribs">
          <div className="header">
            <div className="title">{heroSection.contribFeedTitle}</div>
            <div className="total">$0.87</div>
          </div>
          <div className="terminal">
            <div className="header">
              <span className="ui-btn red"></span>
              <span className="ui-btn yellow"></span>
              <span className="ui-btn green"></span>
            </div>

            <Feed users={this.props.users} />

          </div>
        </section>
      </section>
    );
  }
});

var Feed = React.createClass({
  render() {
    var rows = [];

    this.props.users.forEach(function(user) {
      rows.push(<LiveFeedItem user={user} />);
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
    var {username, repo, avatarUrl, createdAt, commits} = this.props.user,
    contribAmountPerPush = 0.01;

    console.log(this.props.user);
    return (
      <li className="userContrib">
        <span className="tbAvatar"><img src={avatarUrl} /></span>
        <span className="username">{username}</span>
        <span className="gave">gave</span>
        <span className="amount">${contribAmountPerPush}</span>
        <span className="repo"><a href={`http://github.com/${username}/${repo}`}>{`${username}/${repo}`}</a></span>
        <span className="timeElapsed">{(new Date(createdAt).toString())}</span>
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
    var self = this,
      context = this.props.context;

    return (
      <main className="home">

        <Hero context={context} users={this.state.users} />
        <Footer/>

      </main>
    );
  }
});

module.exports = App;
