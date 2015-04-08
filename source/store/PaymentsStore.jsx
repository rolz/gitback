'use strict';

var util = require('../lib/util.jsx'),
  logger = Logger.get('PaymentsStore'),
  socket;

var PaymentsStore = Reflux.createStore({
  listenables: [require('../actions/PaymentsActions.jsx')],

  init() {
    setTimeout(() => {
      socket = require('../lib/socket.jsx')();
    });
  },

  onShowPaymentMethod(username) {
    // logger.debug(username);
    this.payments.username = username;
    this.payments.paymentMethod.status = 'show';
    this.trigger(this.payments);
  },

  onHidePaymentMethod() {
    this.payments.username = null;
    this.payments.paymentMethod.status = 'hide';
    this.trigger(this.payments);
  },

  onUpdatePaymentMethod() {
    // this.trigger(this.payments);
  },

  getInitialState() {
    this.payments = {
      username: null,
      paymentMethod: {
        status: null // to show this component
      }
    };
    return this.payments;
  }
});

module.exports = PaymentsStore;
