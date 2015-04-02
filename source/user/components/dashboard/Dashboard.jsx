'use strict'

var logger = Logger.get('App');

// actions
var UserActions = require('../../../actions/UserActions.jsx');

var UserOnboarding = React.createClass({
  render() {

    var {onboardingTitle, onboardingSteps} = this.props.context;

    console.log(onboardingSteps);
    return (
      <div className="onboarding-container">
        <div className="onboarding-title">{onboardingTitle}</div>
        <div className="onboarding-steps">
        {_.map(onboardingSteps, ((step, index) => {
          console.log(step);
        }))}
        </div>
      </div>
    )
  }
});

var Repo = React.createClass({
  render() {
    var {name, webhookId, contribLog} = this.props.model,
      username = this.props.username,
      donated = "$"+contribLog.length/100,
      buttonClass = (() => {
        switch(webhookId) {
          case null: case undefined: return '';
          case 'false': return 'add';
          default: return 'remove';
        }
      })();
    return(
      <div className={`repo ${buttonClass}`}>
        <span className="info">{name}</span>
        <span className="donated">{donated}</span>
        <button className="remove" onClick={UserActions.removeWebhook.bind(null, username, name, webhookId)}>remove webhook</button>
        <button className="add" onClick={UserActions.addWebhook.bind(null, username, name)}>add webhook</button>
      </div>
    )
  }
});

var User = React.createClass({
  render() {
    var self = this,
      {username, avatarUrl, repos} = this.props.model,
      hasPaymentMethod = true, //pull in data when new user model is done
      {greetings, subGreetings} = this.props.context;

      var onboardingContainer = hasPaymentMethod ? <UserOnboarding context={this.props.context} /> : null;

    return (
      <section className="user-profile">

        <div className="header">
          <div className="avatar-wrapper">
            <img src={avatarUrl} />
          </div>
          <span className="username">{username}</span>
          <div className="greetings">{greetings[1]}</div>
          <div className="sub-greetings">{subGreetings[1]}</div>
          <div className="total-contrib">$0.00</div>
        </div>

        {onboardingContainer}

        <div className="repos">
        {_.map(repos, ((repo, index) => {
          return <Repo key={`repo${index}`} model={repo} username={username} />
        }))}
        </div>

      </section>
    );
  }

});

var Dashboard = React.createClass({
  mixins: [Reflux.connect(require('../../../store/UserStore.jsx'), 'user')],
  render() {
    var self = this,
      {name, state, context} = this.props.params;
    return (
      <main className={name}>
        <User model={this.state.user} context={context} />
      </main>
    );
  }
});

module.exports = Dashboard;
