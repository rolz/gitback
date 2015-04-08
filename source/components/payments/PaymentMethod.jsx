'use strict'

/*
 * SuperAgent: a light-weight progressive ajax API
 * http://visionmedia.github.io/superagent/
 */
var request = require('superagent');

var PaymentsActions = require('../../actions/PaymentsActions.jsx');
var UserActions = require('../../actions/UserActions.jsx');

var PaymentMethod = React.createClass({
  mixins: [Reflux.connect(require('../../store/PaymentsStore.jsx'), 'payments')],
  statics: {
    show(username) {
      PaymentsActions.showPaymentMethod(username);
    },
    hide() {
      PaymentsActions.hidePaymentMethod();
    }
  },
  getInitialState() {
    return {
      clientTokenFromServer: null,
      errorMessage: null
    };
  },
  componentDidUpdate() {
    var paymentMethod = this.state.payments.paymentMethod;
    if(paymentMethod.status !== 'show') {
      this.refs.loading.getDOMNode().style.display = 'none';
    }
  },
  componentDidMount() {
    request.get('/braintreeclienttoken', ((result) => {
      var body = JSON.parse(result.text);
      if(this.isMounted() && body.success === true) {
        this.setState({
          clientTokenFromServer: body.clientToken
        });
      }
    }).bind(this));
  },
  cancel(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if(this.props.cancel) {
      this.props.cancel();
    }
  },
  add(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    var self = this;

    // get currently logged in user's details
    var username = this.state.payments.username;


    // Do Form data validation
    // Get the payment details
    // user submits credit card details
      // number
      // mm/yy
      // cvv
      // avs

    var dat = this.refs.helloPayment.getDOMNode();

    var obj = {
      number: dat.number.value,
      cardholderName: dat.cardholderName.value,
      expirationMonth: dat.expirationMonth.value,
      expirationYear: dat.expirationYear.value,
      cvv: dat.cvv.value,
      billingAddress: {
        postalCode: dat.postalCode.value
      }
    };

    // console.log(obj);

    this.refs.loading.getDOMNode().style.display = 'block';

    var client = new braintree.api.Client({clientToken: this.state.clientTokenFromServer});
    client.tokenizeCard(obj, ((err, nonce) => {
      if(err) {
        console.log('error');
      } else {
        // send nonce
        request
          .post('/addcustomerandpaymentmethod')
          .send({username: username, nonce: nonce, last: obj.number.toString().slice(-4)})
          .end(function(err, res){
            if (res.ok) {
              var dat = res.body;
              if(dat.status === 'success') {
                PaymentsActions.hidePaymentMethod();
                UserActions.updateCardNumber(dat.result);
              } else {
                self.setState({
                  errorMessage: 'Try one more time'
                });
              }
            } else {
              console.log('Oh no! error ' + res.text);
              self.setState({
                errorMessage: 'Try one more time'
              });
            }
         });
      }
    }));


  },

  render() {
    var paymentMethod = this.state.payments.paymentMethod;
    // var self = this,
    //   {username, avatarUrl} = this.state.user,
    //   {name, state, context} = this.props.params,
    //   {title} = context;
    var showStyle = paymentMethod.status === 'show'? ' show' : '';
    return (
      <div className={`paymentMethod ${showStyle}`}>
        <div ref="loading" className="loading" />
        <div className="helloPaymentWrapper">
          <div className="closeButton" onClick={PaymentsActions.hidePaymentMethod} />
          <div className="errorMessage">{this.state.errorMessage}</div>
          <form ref="helloPayment">
            <ul>
              <li className="cardholderName">Cardholder Name&nbsp;<input name="cardholderName" defaultValue="John Smith"/></li>
              <li className="number">Number&nbsp;<input name="number" defaultValue="4111111111111111" /></li>
              <li className="expirationMonth">MM&nbsp;<input name="expirationMonth" defaultValue="10" /></li>
              <li className="expirationYear">YY&nbsp;<input name="expirationYear" defaultValue="20" /></li>
              <li className="cvv">CVV&nbsp;<input name="cvv" defaultValue="100" /></li>
              <li className="postalCode">Zip Code&nbsp;<input name="postalCode" defaultValue="94107" /></li>
            </ul>
            <button className="cancel" onClick={this.cancel}>Cancel</button>
            <button className="add" onClick={this.add}>Add</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = PaymentMethod;
