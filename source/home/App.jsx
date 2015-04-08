'use strict'

var Feed = require('../components/feed');

var util = require('../lib/util.jsx'),
  logger = Logger.get('Feed');

var feedData;

var Counter = require('../components/counter');

/*
* Hero Section
*/

var Hero = React.createClass({
  render() {
    var self = this;
    return (
      <section className="hero">
        <div className="bgShader">
          <Header context={this.props.context}/>
          <div className="content">
            <Jumbotron context={this.props.context}/>
            <UsersContribs context={this.props.context} users={this.props.users}/>
          </div>
        </div>
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
        <a className="logo">{projectTitle}</a>
        <ul>
          <li><a href={`#${heroSection.nav[0]}`}>{heroSection.nav[0]}</a></li>
          <li><a href={`#${heroSection.nav[1]}`}>{heroSection.nav[1]}</a></li>
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
        <div className="subline" dangerouslySetInnerHTML={{__html:heroSection.subline}}></div>
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
        {heroSection} = this.props.context,
        {totalPledgedAmount} = feedData.summary;
      return(
        <section className="usersContribs">
          <div className="header">
            <div className="title">{heroSection.contribFeedTitle}</div>
            <Counter amount={totalPledgedAmount} />
          </div>

          <Feed users={this.props.users} />

        </section>
      )
    }
});

/*
* Content Section
*/
var Content = React.createClass({
  render() {
    var self = this,
      context = this.props.context;
    return (
      <section className="contentContainer">
        <C1 context={context}/>
        <C2 context={context}/>
      </section>
    );
  }
});


var C1 = React.createClass({
  render() {
    var self = this,
      {content} = this.props.context;
    return(
      <section className="contentSection one clearfix">
        <a name={content.one.title} />
        <div className="title">{content.one.title}</div>
        <img className="line" src="/assets/images/line.png" />
        <div className="contentSteps">
          {_.map(content.one.steps, ((step, index) => {
            return <div key={`step${index}`} className="step">
              <div className="steptitle">{step.title}</div>
              <img src={step.image}/>
              <div className="text">{step.text}</div>
            </div>
          }))}
        </div>
      </section>
    )
  }
});

var C2 = React.createClass({
  render() {
    var self = this,
      {content} = this.props.context;
    return(
      <section name="two" className="contentSection two">
        <a name={content.two.title} />
        <div className="title">{content.two.title}</div>
        <img className="line" src="/assets/images/line.png" />
        {_.map(content.two.text, ((text, index) => {
          return <div key={`text${index}`} className="text">{text}</div>
        }))}
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
    Reflux.connect(require('../store/LiveFeedStore.jsx'), 'feed')
  ],
  render() {
    var self = this,
      context = this.props.context;
    feedData = this.state.feed;
    return (
      <main className="home">

        <Hero context={context} users={feedData.results} />
        <Content context={context}/>
        <Footer/>

      </main>
    );
  }
});

module.exports = App;
