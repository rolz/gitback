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
            // day of billing cycle
          res.json(result);

          //Add payment subscription to customer profile in braintree
          addPaymentSubscription(result.customer.creditCards[0].token);

        }
      }
    });
  });


  // Todo: UPDATE USER PAYMENT METHOD

}

// CREATE A SUBSCRIPTON SERVICE THAT BILLS THE CUSTOMER EVERY MONTH
function addPaymentSubscription(userCardToken) {

  // set subscription cycle to in one month.
  var today = new Date().getDate;
  // Billing Day of Month must be between 1 and 28, or 31.
  var dd;
  switch(today) {
    case 29:
      dd = 28
      break;
    case 30:
      dd = 28
      break;
    case 31:
      dd = 28
      break;
    default:
      dd = today - 1
  }

  // one time create subscription for user at 1 cent
  gateway.subscription.create({
    paymentMethodToken: userCardToken,
    planId: "standardplan",
    billingDayOfMonth: dd
  }, function (err, result) {
      if(err) {
        log(err, 'red');
        res.json({
          status: 'error'
        });
      } else {
        if(result.success) {
          log('subscription plan has been created' + JSON.stringify(result), 'green');

          // add this user is subscribed to user model
          // add user payment date cycle to user model

        } else {
          log('not error but not success: ' + JSON.stringify(result), 'red');
        }
      }
  });


};

// Todo : UPDATE THE SUBSCRIPTON PRICE MONTHLY BASED ON USER'S CURRENT CONTRIB AMOUNT
// PAYMENT DATE CYCLE
// RUN THIS FUNCTION AS A JOB ON THE SERVER (HOW?)
// NOT IMPLEMENTED YET
function updateDonationAmountForPaymentSubscription(user) {

  gateway.subscription.update({
    paymentMethodToken: userCardToken,
    planId: "standardplan",
    billingDayOfMonth: dd
  }, function (err, result) {
    if(result.success) {
      log('subscription plan has been created', 'green')
    }
  });


};

// Todo: send invoice to user.

exports.setup = ((expressApp) => {
  app = expressApp;
  setRoutes();
});
