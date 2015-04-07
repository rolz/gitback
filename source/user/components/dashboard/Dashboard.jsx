'use strict'

var util = require('../../../lib/util.jsx'),
  logger = Logger.get('Settings'),
  UserActions = require('../../../actions/UserActions.jsx'),
  PaymentsActions = require('../../../actions/PaymentsActions.jsx');

var UserOnboarding = React.createClass({
  setContribAmountPerPush(val) {
    var {username, contribAmountPerPush} = this.props.model;
    if(val !== contribAmountPerPush) {
      UserActions.setContribAmountPerPush(username, val);
    }
  },
  render() {
    var self = this,
      {username, contribAmountPerPush} = this.props.model,
      {donationAmounts} = this.props.context,
      {addPaymentsButton, pushAmountExampleText, pushAmountExampleValue, selectDonationAmount} = this.props.context.onboardingSteps;
    return (
      <div className="onboardingContainer">
        <div className="onboardingSteps">
          <h3 dangerouslySetInnerHTML={{__html:pushAmountExampleText}} />
          <p>{selectDonationAmount}</p>
          <span className="contribAmountPerPush">
          {_.map(donationAmounts, ((amount, index) => {
            return <span key={`contrib${index}`} onClick={self.setContribAmountPerPush.bind(null, amount)} className={contribAmountPerPush === amount? 'active' : ''} dangerouslySetInnerHTML={{__html:util.convertCurrency(amount)}} />;
          }))}
          </span>
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

var Repo = require('./Repo.jsx');

var User = React.createClass({
  render() {
    var self = this,
      model = this.props.model,
      {username, avatarUrl, repos, contribAmountPerPush} = model,
      hasAddedPaymentMethod = false, //pull in data when new user model is done
      {totalText, greetings, reposSection} = this.props.context;

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

          {hasAddedPaymentMethod ? <RecentActivity /> : <UserOnboarding model={model} context={this.props.context} />}

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
      {this.state.user.username? <User model={this.state.user} context={context} />
        : <img className="loadingUserInfo" src="/assets/images/loading-spin.svg" />}
      </main>
    );
  }
});

module.exports = Dashboard;
