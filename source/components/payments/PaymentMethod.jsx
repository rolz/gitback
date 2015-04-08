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
    return (
      <div className={'paymentMethod' + (paymentMethod.status === 'show'? ' show' : '')}>
        <div className="helloPaymentWrapper">
          <div className="closeButton" onClick={PaymentsActions.hidePaymentMethod} />
          <div className="errorMessage">{this.state.errorMessage}</div>
          <form ref="helloPayment">
            <ul>
              <li className="cardholderName"><input name="cardholderName" defaultValue="John Smith" />&nbsp;cardholderName</li>
              <li className="number"><input name="number" defaultValue="4111111111111111" />&nbsp;number</li>
              <li className="expirationMonth"><input name="expirationMonth" defaultValue="10" />&nbsp;MM</li>
              <li className="expirationYear"><input name="expirationYear" defaultValue="20" />&nbsp;YY</li>
              <li className="cvv"><input name="cvv" defaultValue="100" />&nbsp;cvv</li>
              <li className="postalCode"><input name="postalCode" defaultValue="94107" />&nbsp;postalCode</li>
            </ul>
            <button onClick={this.add}>Add Payment Method</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = PaymentMethod;
