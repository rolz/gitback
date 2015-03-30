var _ = require('lodash-node'),
  request = require('request'),
  qs = require('querystring'),
  db = require ('../mongodb/index.es6'),
  config = require('../../../json/config'),
  util = require ('../util'),
  log = util.log('payments', 'GB'),
  braintree = require('braintree'),
  app;


// Problem: The user needs to be able to donate money when the contribute to github repos

// Solve: Use the Braintree Node SDK's to add a payment method that will be
// charged once a month with total git contrib value for that user.

// CREATE BRAINTREE GATE AND ADD APP CREDENTIALS
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "5s3t2pzqy4kjmcps",
  publicKey: "tw5p84mjv7qcx3dj",
  privateKey: "8914a5205592a56d90119eaa75e85c61"
});

// CREATE A CUSTOMER WITH CARD VALIDATION (test with admin page) https://developers.braintreepayments.com/javascript+node/sdk/server/customer-management/create

function setRoutes() {

  // receive user push messages
  // add secret session

  // GENERATE A UNIQUE BRAINTREE CLIENT TOKEN
  app.get('/braintreeclienttoken', (req,res) => {
    gateway.clientToken.generate({}, function (err, response) {
      res.json(response);
    });
  });


  // CREATE A CUSTOMER WITH CARD VERIFICATION (test with admin page)
  app.post('/addcustomerandpaymentmethod', (req,res) => {
    var dat = req.body;
    log('addcustomerandpaymentmethod : ' + JSON.stringify(dat), 'yellow');

    // CREATE CUSTOMER
    gateway.customer.create({
      firstName: dat.username,
      creditCard: {
        paymentMethodNonce: dat.nonce,
        options: {
          verifyCard: true
        }
      }
    }, function (err, result) {
      if(err) {
        log(err, 'red');
        res.json({
          status: 'error'
        });
      } else {
        if(result.success) {
          // true
          log('customer id : ' + result.customer.id, 'green');
          // e.g 160923

          log('customer card token : ' + result.customer.creditCards[0].token, 'green');
          // e.g f28wm

          // ADD CUSTOMER PAYMENT DETAILS TO USER PROFILE
          // save customer id/token
          res.json(result);
        }
      }
    });
  });


  // CREATE A SUBSCRIPTON SERVICE THAT BILLS THE CUSTOMER EVERY MONTH
    // update the subcription price monthly based on the user's current contib amount.
    // send invoice to user.

  // UPDATE PAYEMENT METHODS

}

exports.setup = ((expressApp) => {
  app = expressApp;
  setRoutes();
});
