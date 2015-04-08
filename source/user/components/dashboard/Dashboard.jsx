'use strict'

var util = require('../../../lib/util.jsx'),
logger = Logger.get('Dashboard'),

UserActions = require('../../../actions/UserActions.jsx'),
PaymentMethod = require('../../../components/payments'),
Counter = require('../../../components/counter'),

UserOnboarding = require('./UserOnboarding.jsx'),
RecentActivity = require('./RecentActivity.jsx'),
Repo = require('./Repo.jsx'),
Greeting = require('./Greeting.jsx'),

User = React.createClass({
  getInitialState () {
    return {
      hasAddedPaymentMethod: false
    };
  },
  componentDidUpdate () {
    var self = this;
    if(!this.state.hasAddedPaymentMethod && this.props.model.cardNumber) {
      PaymentMethod.hide();
      setTimeout(() => {
        self.setState({
          hasAddedPaymentMethod: true
        });
      }, 500);
    }
  },
  componentDidMount () {
    this.setState({
      hasAddedPaymentMethod: !!(this.props.model.cardNumber)
    });
  },
  render() {
    var self = this,
      {model, context} = this.props,
      {username, avatarUrl, repos, contribAmountPerPush, totalContribAmount, cardNumber} = model,
      {hasAddedPaymentMethod} = this.state, //pull in data when new user model is done
      {totalText, greetings, reposSection} = context;
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
            <Counter amount={totalContribAmount} />
          </div>

          <Greeting model={model} context={context} />

          {hasAddedPaymentMethod ?
            <RecentActivity model={model} context={context} /> :
            <UserOnboarding model={model} context={context} />}

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

}),

Dashboard = React.createClass({
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
