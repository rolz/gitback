'use strict'

/*
 * SuperAgent: a light-weight progressive ajax API
 * http://visionmedia.github.io/superagent/
 */
var request = require('superagent');

var PaymentsActions = require('../../actions/PaymentsActions.jsx');

var PaymentMethod = React.createClass({
  mixins: [Reflux.connect(require('../../store/PaymentsStore.jsx'), 'payments')],
  getInitialState() {
    return {
      clientTokenFromServer: null
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
         .send({username: username, nonce: nonce})
         .end(function(err, res){
           if (res.ok) {
             console.log('yay got ' + JSON.stringify(res.body));
           } else {
             console.log('Oh no! error ' + res.text);
           }
         });
      }
      console.log(nonce);
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
          <form ref="helloPayment">
            <ul>
              <li><input name="cardholderName" defaultValue="John Smith" />&nbsp;cardholderName</li>
              <li><input name="number" defaultValue="4111111111111111" />&nbsp;number</li>
              <li><input name="expirationMonth" defaultValue="10" />&nbsp;expirationMonth</li>
              <li><input name="expirationYear" defaultValue="2020" />&nbsp;expirationYear</li>
              <li><input name="cvv" defaultValue="100" />&nbsp;cvv</li>
              <li><input name="postalCode" defaultValue="94107" />&nbsp;postalCode</li>
            </ul>
            <button onClick={this.add}>Add Payment Method</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = PaymentMethod;
