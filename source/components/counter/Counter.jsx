'use strict'

var util = require('../../lib/util.jsx');

var Counter = React.createClass({
  getInitialState() {
    return {
      amount: 0
    }
  },
  update() {
    var self = this,
      amount = this.props.amount || 0,
      currentAmount = this.state.amount;
    if(amount > currentAmount) {
      clearTimeout(this.tid);
      if(amount < .8) {
        currentAmount += .017;
      } else {
        var diff = amount - currentAmount;
        if(diff < 0.02) {
          currentAmount = amount;
        } else {
          currentAmount += diff / 5;
        }
      }
      currentAmount = Math.min(amount, currentAmount);
      this.tid = setTimeout(() => {
        self.setState({
          amount: currentAmount
        });
      }, 80);
    }
  },
  componentDidUpdate() {
    this.update();
  },
  componentDidMount() {
    if(this.props.amount) {
      this.setState({
        amount: this.props.amount
      });
    }
  },
  componentWillUnmount() {
    clearTimeout(this.tid);
  },
  render() {
    return (
      <div className="amountCounter">{util.convertCurrency(this.state.amount)}</div>
    );
  }

});

module.exports = Counter;