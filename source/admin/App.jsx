'use strict'

var logger = Logger.get('App');

var UserActions = require('../actions/UserActions.jsx');
var PaymentsActions = require('../actions/PaymentsActions.jsx');

var Repo = React.createClass({
  render() {
    var {name, webhookId, contribLog} = this.props.model,
      username = this.props.username,
      buttonClass = (() => {
        switch(webhookId) {
          case null: case undefined: case 'false': return 'add';
          default: return 'remove';
        }
      })();
    return (
      <div className={`repo ${buttonClass}`}>
        <span className="repoInfo">{name}: {webhookId} </span>
        <button className="remove" onClick={UserActions.removeWebhook.bind(null, username, name, webhookId)}>Remove</button>
        <button className="add" onClick={UserActions.addWebhook.bind(null, username, name)}>Add</button>
        <span>
        {_.map(contribLog.slice(0,3), ((item, index) => {
          // console.log(item);
          var time = new Date(item.createdAt);
          return <span key={item+index}>&nbsp;[{time.getMonth()+1}/{time.getDate()}: {item.commits.length}]</span>
        }))}
        </span>
      </div>
    );
  }
});

var User = React.createClass({
  mixins: [
    Reflux.connect(require('../store/UserStore.jsx'), 'user')
  ],
  render() {
    var {_id, avatarUrl, email, username, repos} = this.props.model;
    return (
      <section className={'clearfix' + (username === this.state.user.username? ' user' : '')}>
        <div className="icon">
          <img src={avatarUrl} />
        </div>
        <div className="about">
          <h2>{username}</h2>
          <p>{email}</p>
          <button onClick={UserActions.removeUser.bind(null, username)}>Remove</button>
          <br/>
          <button onClick={PaymentsActions.showPaymentMethod.bind(null, username)}>Update payment method</button>
        </div>
        <div className="repos">
        {_.map(repos, ((repo, index) => {
          return <Repo key={`repo${index}`} model={repo} username={username} />
        }))}
        </div>
      </section>
    );
  }
});

var PaymentMethod = require('../components/payments');

var App = React.createClass({
  mixins: [
    Reflux.connect(require('../store/PaymentsStore.jsx'), 'payments'),
    Reflux.connect(require('../store/UsersStore.jsx'), 'users')
  ],
  render() {
    var self = this;
    return (
      <div>
        <header>
          <h1>Admin</h1>
        </header>
        <main>
        {_.map(this.state.users, ((user, index) => {
          return <User key={`user${index}`} model={user} />
        }))}
        </main>
        <PaymentMethod />
      </div>
    );
  }
});

module.exports = App;
