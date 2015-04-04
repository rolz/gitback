'use strict'

var logger = Logger.get('App');

// actions
var UserActions = require('../../../actions/UserActions.jsx');
var PaymentsActions = require('../../../actions/PaymentsActions.jsx');

var UserOnboarding = React.createClass({
  render() {

    var self =this,
      {onboardingTitle, onboardingSteps, addPaymentsButton} = this.props.context,
      username = this.props.username;

    return (
      <div className="onboardingContainer">
        <div className="onboardingTitle">{onboardingTitle}</div>
        <div className="onboardingSteps">
        {_.map(onboardingSteps, ((step, index) => {
          var bullet =  (index + 1)+". ";
          return <div key={`step${index}`}><span>{bullet}</span><span>{step}</span></div>
        }))}
        </div>
        <button className="onboardingAddPayment" onClick={PaymentsActions.showPaymentMethod.bind(null, username)}>{addPaymentsButton}</button>
      </div>
    )
  }
});

var Repo = React.createClass({
  render() {
    var self = this,
      {name, webhookId, contribLog} = this.props.model,
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
      hasAddedPaymentMethod = false, //pull in data when new user model is done
      {greetings, subGreetings} = this.props.context;

      var onboardingContainer = hasAddedPaymentMethod ? null : <UserOnboarding username={username} context={this.props.context} />;

    return (
      <section className="userProfile">

        <div className="header">
          <div className="avatarWrapper">
            <img src={avatarUrl} />
          </div>
          <span className="username">{username}</span>
          <div className="greetings">{greetings[1]}</div>
          <div className="subGreetings">{subGreetings[1]}</div>
          <div className="totalContrib">$0.00</div>
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
