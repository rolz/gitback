'use strict'

var Feed = require('../feed');

/*
* Hero Section
*/

var Hero = React.createClass({
  render() {

    var self = this,
      {projectTitle, heroSection, sectionTwo} = this.props.context;
    return (
      <section className="hero">
        <Header context={this.props.context}/>
        <Jumbotron context={this.props.context}/>
        <UsersContribs context={this.props.context} users={this.props.users}/>
      </section>
    );
  }
});

var Header = React.createClass({
  render() {
    var self = this,
      {projectTitle, heroSection} = this.props.context;
    return(
      <section className="header clearfix">
        <a className="logo" href="/">{projectTitle}</a>
        <ul>
          <li><a href="#getInvolved">{heroSection.nav[0]}</a></li>
          <li><a href="#ourMission">{heroSection.nav[1]}</a></li>
        </ul>
        <a href="/login" className="login">{heroSection.login}</a>
      </section>
    )
  }
});

var Jumbotron = React.createClass({
  render() {
    var self = this,
      {heroSection} = this.props.context;
    return(
      <section className="jumbotron">
        <div className="tagline" dangerouslySetInnerHTML={{__html:heroSection.tagline}}></div>
        <div className="userActions">
          <a href="/login"><span className="signUp">{heroSection.signUp}<img src="/assets/images/github-logo.svg"/></span></a>
        </div>
      </section>
    )
  }
});

var UsersContribs = React.createClass({
    render() {
      var self = this,
        {heroSection} = this.props.context;
      return(
        <section className="usersContribs">
          <div className="header">
            <div className="title">{heroSection.contribFeedTitle}</div>
            <div className="total">$0.87</div>
          </div>

          <Feed users={this.props.users} />

        </section>
      )
    }
});

/*
* Footer Section
*/

var Footer = React.createClass({
  render() {
    return (
      <footer></footer>
    );
  }
});

/*
* Homepage App Component
*/

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
