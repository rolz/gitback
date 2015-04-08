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
  merchantId: '5s3t2pzqy4kjmcps',
  publicKey: 'tw5p84mjv7qcx3dj',
  privateKey: '8914a5205592a56d90119eaa75e85c61'
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
    }, ((err, result) => {
      if(err) {
        log(err, 'red');
        res.json({
          status: 'error'
        });
      } else {
        if(result.success) {

          var customer = result.customer,
            customerId = customer.id,
            paymentMethodToken = customer.creditCards[0].token,
            billingDayOfMonth = getBillingCycleDate(),
            paymentMethod = {
              planId: 'standardplan',
              paymentMethodToken: paymentMethodToken,
              billingDayOfMonth: billingDayOfMonth
            };

          // log(paymentMethod, 'blue');

          // CREATE A SUBSCRIPTON SERVICE THAT BILLS THE CUSTOMER EVERY MONTH
          // one time create subscription for user at 1 cent
          gateway.subscription.create(paymentMethod, ((err, result) => {
            if(err) {
              log(err.message, 'red');
            } else {
              if(result.success) {
                var model = {
                  username: dat.username,
                  cardNumber: dat.last,
                  paymentMethod: _.extend(paymentMethod, {
                    customerId: customerId,
                    subscriptionId: result.subscription.id
                  })
                };
                // log(model, 'green');
                db.user.updatePaymentMethod(model, ((e) => {
                  log(`updatePaymentMethod: ${e.status}`, 'blue');
                  var result = e.result || {};
                  res.json({
                    status: e.status,
                    result: {
                      username: result.username,
                      cardNumber: result.cardNumber,
                    }
                  });
                }));
              }
            }
          }));
        }
      }
    }));
  });
}

// Get subscription cycle to in one month.
function getBillingCycleDate() {
  var today = (new Date()).getDate();
  // Billing Day of Month must be between 1 and 28, or 31.
  switch(today) {
    case 29: case 30: case 31: return 28;
    default: return today - 1;
  }
}


// Todo : UPDATE THE SUBSCRIPTON PRICE MONTHLY BASED ON USER'S CURRENT CONTRIB AMOUNT
// PAYMENT DATE CYCLE
// RUN THIS FUNCTION AS A JOB ON THE SERVER (HOW?)
// NOT IMPLEMENTED YET
function updateDonationAmountForPaymentSubscription(user) {


  // if user contrib amount = 0, update price to $0.00.

  gateway.subscription.update({
    paymentMethodToken: userCardToken,
    planId: "standardplan",
    billingDayOfMonth: dd
  }, function (err, result) {
    if(result.success) {
      log('subscription plan has been created', 'green')

      // update user SubscriptionId
    }
  });


};

// Todo: send invoice to user.

exports.setup = ((expressApp) => {
  app = expressApp;
  setRoutes();
});
