'use strict'

var util = require('../../../lib/util.jsx'),
  logger = Logger.get('Dashboard.Repo');

// actions
var UserActions = require('../../../actions/UserActions.jsx');

var Repo = React.createClass({
  addLoadingIcon() {
    this.refs.loading.getDOMNode().setAttribute('show', 'true');
  },
  removeLoadingIcon() {
    this.refs.loading.getDOMNode().setAttribute('show', 'false');
  },
  isLoadingIconShown() {
    return !! (this.refs.loading.getDOMNode().getAttribute('show') === 'true');
  },
  removeWebhook() {
    if(!this.isLoadingIconShown()) {
      this.addLoadingIcon();
      var {name, webhookId} = this.props.repo,
        username = this.props.username;
      UserActions.removeWebhook(username, name, webhookId);
    }
  },
  addWebhook() {
    if(!this.isLoadingIconShown()) {
      this.addLoadingIcon();
      var {name, webhookId} = this.props.repo,
        username = this.props.username;
      UserActions.addWebhook(username, name);
    }
  },
  componentDidUpdate() {
    this.removeLoadingIcon();
  },
  render() {
    var self = this,
      {contribAmountPerPush} = this.props.model,
      {name, webhookId, contribLog, totalContribAmount} = this.props.repo,
      username = this.props.username,
      buttonClass = (() => {
        switch(webhookId) {
          case null: case undefined: case 'false': return 'add';
          default: return 'remove';
        }
      })(),
      raised = buttonClass === 'remove' ? 'raised yes' : 'raised';
    return(
        <tr className={`repo ${buttonClass}`}>
          <td className="name">{name}</td>
          <td className={raised}>{util.convertCurrency(totalContribAmount)}</td>
          <td className="repoAction">
            <div className="loading" ref="loading">
              <img src="/assets/images/loading-spin.svg" />
            </div>
            <div className="button" id="remove" onClick={this.removeWebhook}></div>
            <div className="button" id="add" onClick={this.addWebhook}></div>
          </td>
        </tr>
    )
  }
});

module.exports = Repo;
