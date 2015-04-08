'use strict'

var util = require('../../../lib/util.jsx'),
logger = Logger.get('Dashboard.Greeting'),

Greeting = React.createClass({
  getInitialState () {
    return {
      greetings: null
    };
  },
  componentDidUpdate (prevProps, prevState) {
    // console.log(prevProps, prevState);
    var self = this;
    var greetings = this.getGreeting();
    if(greetings !== prevState.greetings) {
      this.setState({ greetings: greetings });
      var el = this.getDOMNode();
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
      greetings: this.getGreeting()
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
    return (
      <div className="greeting"></div>
    );
  }

});

module.exports = Greeting;
