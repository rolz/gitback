'use strict'

var util = require('../../../lib/util.jsx'),
  logger = Logger.get('Dashboard'),
  UserActions = require('../../../actions/UserActions.jsx'),
  PaymentMethod = require('../../../components/payments');

var UserOnboarding = React.createClass({
  setContribAmountPerPush(val) {
    var {username, contribAmountPerPush} = this.props.model;
    if(val !== contribAmountPerPush) {
      UserActions.setContribAmountPerPush(username, val);
    }
  },
  showPaymentMethod() {
    var {username} = this.props.model;
    PaymentMethod.show(username);
    this.setState({ showPayment: true });
  },
  componentDidUpdate () {
    if(this.props.model.cardNumber) {
      var el = this.getDOMNode();
      TweenMax.to(el, .5, {height: 0});
    }
  },
  getInitialState() {
    return {
      showPayment: false
    };
  },
  render() {
    var self = this,
      {username, contribAmountPerPush} = this.props.model,
      {donationAmounts} = this.props.context,
      {addPaymentsButton, pushAmountExampleText, pushAmountExampleValue, selectDonationAmount} = this.props.context.onboardingSteps;
    pushAmountExampleValue = pushAmountExampleValue.replace('#{amount}', `<span>${util.convertCurrency(contribAmountPerPush * 100)}</span>`);
    return (
      <div className={`onboardingContainer ${this.state.showPayment? 'showPayment': ''}`}>
        <div className="pushAmountContainer">
          <div className="onboardingSteps">
            <h3 dangerouslySetInnerHTML={{__html:pushAmountExampleText}} />
            <p>{selectDonationAmount}</p>
            <span className="contribAmountPerPush">
            {_.map(donationAmounts, ((amount, index) => {
              return <span key={`contrib${index}`} onClick={self.setContribAmountPerPush.bind(null, amount)} className={contribAmountPerPush === amount? 'active' : ''}>{util.convertCurrency(amount)}</span>;
            }))}
            </span>
          </div>
          <h3 className="pushAmountExampleValue" dangerouslySetInnerHTML={{__html: pushAmountExampleValue}} />
          <button className="onboardingAddPayment" onClick={this.showPaymentMethod}>{addPaymentsButton}</button>
        </div>
        <PaymentMethod />
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
  getInitialState () {
    return {
      hasAddedPaymentMethod: false,
      greetings: null
    };
  },
  componentDidUpdate (prevProps, prevState) {
    // console.log(prevProps, prevState);
    var self = this;
    if(!this.state.hasAddedPaymentMethod && this.props.model.cardNumber) {
      PaymentMethod.hide();
      setTimeout(() => {
        self.setState({
          hasAddedPaymentMethod: true
        });
      }, 800);
    }
    // Show greeting
    var greetings = this.getGreeting();
    if(greetings !== prevState.greetings) {
      this.setState({ greetings: greetings });
      var el = this.refs.greetings.getDOMNode();
      el.innerHTML = '';
      TweenMax.set(el, {
        opacity: 0,
        y: 20,
        onComplete() {
          el.innerHTML = greetings;
          TweenMax.to(el, .3, {
            opacity: 1,
            y: 0,
            delay: .5
          });
        }
      });
    }
  },
  componentDidMount () {
    this.setState({
      greetings: this.getGreeting(),
      hasAddedPaymentMethod: !!(this.props.model.cardNumber)
    });
  },
  getGreeting() {
    var {repos, cardNumber} = this.props.model,
      {greetings} = this.props.context;
    if(cardNumber) {
      var addedWebhook = false;
      _.each(repos, ((repo) => {
        if(repo.webhookId) {
          addedWebhook = true;
          return false;
        }
      }));
      if(addedWebhook) {
        var arr = greetings.genericGreetings;
        return arr[Math.floor(Math.random() * arr.length)];
      } else {
        return greetings.hasAddedPaymentMethod;
      }
    } else {
      return greetings.hasNotAddedPaymentMethod;
    }
  },
  render() {
    var self = this,
      model = this.props.model,
      {username, avatarUrl, repos, contribAmountPerPush, totalContribAmount, cardNumber} = model,
      {hasAddedPaymentMethod} = this.state, //pull in data when new user model is done
      {totalText, greetings, reposSection} = this.props.context;

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
            <div className="text amount">{util.convertCurrency(totalContribAmount)}</div>
          </div>

          <div className="greetings" ref="greetings"></div>

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
