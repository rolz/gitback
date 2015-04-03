'use strict'

var util = require('../../../lib/util.jsx'),
  logger = Logger.get('Settings'),
  UserActions = require('../../../actions/UserActions.jsx'),
  user,

Email = React.createClass({
  render() {
    return <span>{user.email}</span>
  }
}),

Payment = React.createClass({
  render() {
    return <span></span>
  }
}),

Partners = React.createClass({
  render() {
    return (
      <span className="partners">
      {_.map(this.props.item.partners, ((partner, index) => {
        return <a className={partner.id} key={`settingPartner${index}`} href={partner.url} target="getback">{partner.label}</a>;
      }))}
      </span>
    );
  }
}),

AccountType = React.createClass({
  setAnonymous(flag) {
    var {username, hidden} = this.state.user;
    if(flag === 'private' && hidden !== true) {
      UserActions.setAnonymous(username, true);
    } else if(flag === 'public' && hidden === true) {
      UserActions.setAnonymous(username, false);
    }
  },
  render() {
    var self = this;
    return (
      <span className={`types ${user.hidden? 'hidden' : ''}`}>
      {_.map(this.props.item.types, ((type, index) => {
        return (
          <span
            className={`type ${type.id}`}
            key={`settingAccountType${index}`}
            onClick={self.setAnonymous.bind(null, type.id)}
          >{type.label}</span>
        );
      }))}
      </span>
    );
  }
}),

Settings = React.createClass({
  mixins: [Reflux.connect(require('../../../store/UserStore.jsx'), 'user')],
  render() {
    user = this.state.user;
    var self = this,
      {username} = this.state.user,
      {name, state, context} = this.props.params,
      {title, items} = context,
      getItem = ((item) => {
        if(item.id === 'accountType') return <AccountType item={item} />;
        else if(item.id === 'email') return <Email item={item} />;
        else if(item.id === 'payment') return <Payment item={item} />;
        else if(item.id === 'partners') return <Partners item={item} />;
        else return null;
      });
    return (
      <main className={name}>
        <h1>{title}</h1>
        <h2>{username}</h2>
        {_.map(items, ((item, index) => {
          return (
            <section className={item.id} key={`settingItem${index}`}>
              <p>{item.label}: {getItem(item)}</p>
            </section>
          );
        }))}
        <button onClick={util.logout}>Logout</button>
      </main>
    );
  }
});

module.exports = Settings;