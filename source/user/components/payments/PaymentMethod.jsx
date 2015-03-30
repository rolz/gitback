'use strict'

/*
 * SuperAgent: a light-weight progressive ajax API
 * http://visionmedia.github.io/superagent/
 */
var request = require('superagent');

var PaymentMethod = React.createClass({
  mixins: [Reflux.connect(require('../../../store/PaymentsStore.jsx'), 'payments')],
  getInitialState: function() {
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

    console.log(obj);


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
        <form ref="helloPayment">
          <input name="cardholderName" value="John Smith" />

          <input name="number" value="4111111111111111" />

          <input name="expirationMonth" value="10" />
          <input name="expirationYear" value="2020" />

          <input name="cvv" value="100" />
          <input name="postalCode" value="94107" />

          <button onClick={this.add}>Add Payment Method</button>
        </form>
      </div>
    );
  }
});

module.exports = PaymentMethod;
