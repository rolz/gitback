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

var RecentActivity = React.createClass({
  render() {
    var self= this;
    return(
      <div className="activityContainer">
        <div className="title">Recent Activity</div>
      </div>
    )
  }
});

var Repo = React.createClass({
  render() {
    var self = this,
      {name, webhookId, contribLog} = this.props.model,
      username = this.props.username,
      amount = "$"+contribLog.length/100,
      raised = contribLog.length ? "raised yes" : "raised",
      buttonClass = (() => {
        switch(webhookId) {
          case null: case undefined: return '';
          case 'false': return 'add';
          default: return 'remove';
        }
      })();
    return(
        <tr className={`repo ${buttonClass}`}>
          <td className="name">{name}</td>
          <td className={raised}>{amount}</td>
          <td className="repoAction">
            <div className="button" id="remove" onClick={UserActions.removeWebhook.bind(null, username, name, webhookId)}></div>
            <div className="button" id="add" onClick={UserActions.addWebhook.bind(null, username, name)}></div>
          </td>
        </tr>
    )
  }
});

var User = React.createClass({
  render() {
    var self = this,
      {username, avatarUrl, repos} = this.props.model,
      hasAddedPaymentMethod = true, //pull in data when new user model is done
      {totalText, greetings, reposSection} = this.props.context;

      var onboardingContainer = hasAddedPaymentMethod ? null : <UserOnboarding username={username} context={this.props.context} />;

    return (
      <section className="container">

        <div className="userProfile">

          <div className="wings clearfix">
            <div className="text username">{username}</div>
            <div className="avatarWrapper">
              <img src={avatarUrl} />
            </div>
            <div className="text total">{totalText}</div>
            <hr />
            <div className="text amount">$0.00</div>
          </div>

          <div className="greetings">{greetings[0]}</div>
          <RecentActivity />

          {onboardingContainer}

          <table className="reposHeader">
            <tr>
              <th className="one">{reposSection[0]}</th>
              <th className="two">{reposSection[1]}</th>
              <th className="three">{reposSection[2]}</th>
            </tr>
          </table>
          <table className="repos">
            {_.map(repos, ((repo, index) => {
              return <Repo key={`repo${index}`} model={repo} username={username} />
            }))}
          </table>
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
