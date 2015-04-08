'use strict'

var util = require('../../../lib/util.jsx'),
  logger = Logger.get('Dashboard.UserOnboarding'),
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
  cancelPaymentMethod() {
    this.setState({ showPayment: false });
    this.tid = setTimeout(() => {
      PaymentMethod.hide();
    }, 800);
  },
  componentWillUnmount () {
    clearTimeout(this.tid);
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
            <h2>{selectDonationAmount}</h2>
            <h3 dangerouslySetInnerHTML={{__html:pushAmountExampleText}} />
            <span className="contribAmountPerPush">
            {_.map(donationAmounts, ((amount, index) => {
              return <span key={`contrib${index}`} onClick={self.setContribAmountPerPush.bind(null, amount)} className={contribAmountPerPush === amount? 'active' : ''}>{util.convertCurrency(amount)}</span>;
            }))}
            </span>
          </div>
          <h3 className="pushAmountExampleValue" dangerouslySetInnerHTML={{__html: pushAmountExampleValue}} />
          <button className="onboardingAddPayment" onClick={this.showPaymentMethod}>{addPaymentsButton}</button>
        </div>
        <PaymentMethod cancel={this.cancelPaymentMethod} />
      </div>
    )
  }
});

module.exports = UserOnboarding;
