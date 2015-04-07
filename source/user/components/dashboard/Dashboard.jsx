'use strict'

var logger = Logger.get('App');

// actions
var UserActions = require('../../../actions/UserActions.jsx');
var PaymentsActions = require('../../../actions/PaymentsActions.jsx');

var UserOnboarding = React.createClass({
  render() {

    var self =this,
      {onboardingTitle, onboardingSteps} = this.props.context,
      username = this.props.username;

    return (
      <div className="onboardingContainer">
        <div className="onboardingTitle">{onboardingTitle}</div>
        <div className="onboardingSteps">
        </div>
        <button className="onboardingAddPayment" onClick={PaymentsActions.showPaymentMethod.bind(null, username)}>{onboardingSteps.addPaymentsButton}</button>
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
  addLoadingIcon() {
    this.refs.loading.getDOMNode().setAttribute('show', 'true');
  },
  removeLoadingIcon() {
    this.refs.loading.getDOMNode().setAttribute('show', 'false');
  },
  isLoadingIconShown() {
    return !! (this.refs.loading.getDOMNode().getAttribute('show') === 'true');
  },
  removeWebhook() {
    if(!this.isLoadingIconShown()) {
      this.addLoadingIcon();
      var {name, webhookId} = this.props.repo,
        username = this.props.username;
      UserActions.removeWebhook(username, name, webhookId);
    }
  },
  addWebhook() {
    if(!this.isLoadingIconShown()) {
      this.addLoadingIcon();
      var {name, webhookId} = this.props.repo,
        username = this.props.username;
      UserActions.addWebhook(username, name);
    }
  },
  componentDidUpdate() {
    this.removeLoadingIcon();
  },
  render() {
    var self = this,
      {contribAmountPerPush} = this.props.model,
      {name, webhookId, contribLog} = this.props.repo,
      username = this.props.username,
      amount = contribLog.length * contribAmountPerPush,
      buttonClass = (() => {
        switch(webhookId) {
          case null: case undefined: case 'false': return 'add';
          default: return 'remove';
        }
      })(),
      raised = buttonClass === 'remove' ? 'raised yes' : 'raised';
    return(
        <tr className={`repo ${buttonClass}`}>
          <td className="name">{name}</td>
          <td className={raised}>{`$${amount}`}</td>
          <td className="repoAction">
            <div className="loading" ref="loading">
              <img src="/assets/images/loading-spin.svg" />
            </div>
            <div className="button" id="remove" onClick={this.removeWebhook}></div>
            <div className="button" id="add" onClick={this.addWebhook}></div>
          </td>
        </tr>
    )
  }
});

var User = React.createClass({
  render() {
    var self = this,
      model = this.props.model,
      {username, avatarUrl, repos, contribAmountPerPush} = model,
      hasAddedPaymentMethod = true, //pull in data when new user model is done
      {totalText, greetings, reposSection} = this.props.context;

    var onboardingContainer = hasAddedPaymentMethod ? null : <UserOnboarding username={username} context={this.props.context} />;

    var totalAmount = 0;
    _.each(repos, (repo) => {totalAmount += (repo.contribLog.length * contribAmountPerPush)});
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
            <div className="text amount">{`$${totalAmount}`}</div>
          </div>

          <div className="greetings">{greetings[Math.floor(Math.random() * greetings.length)]}</div>
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
              return <Repo key={`repo${index}`} model={model} repo={repo} username={username} />
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
      {(() => {
        return this.state.user.username? <User model={this.state.user} context={context} />
        : <img className="loadingUserInfo" src="/assets/images/loading-spin.svg" />
      })()}
      </main>
    );
  }
});

module.exports = Dashboard;
