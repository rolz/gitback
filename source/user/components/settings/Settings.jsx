'use strict'

var util = require('../../../lib/util.jsx'),
  logger = Logger.get('Settings'),
  UserActions = require('../../../actions/UserActions.jsx');

module.exports = React.createClass({
  mixins: [Reflux.connect(require('../../../store/UserStore.jsx'), 'user')],
  setAnonymous(flag) {
    var {login, anonymous} = this.state.user;
    if(flag === 'private' && anonymous !== true) {
      UserActions.setAnonymous(login, true);
    } else if(flag === 'public' && anonymous === true) {
      UserActions.setAnonymous(login, false);
    }
  },
  render() {
    var self = this,
      {email, login, anonymous} = this.state.user,
      {name, state, context} = this.props.params,
      {title, items} = context,
      getItem = ((item) => {
        if(item.id === 'accountType') {
          return (
            <span className={`types ${anonymous? 'anonymous' : ''}`}>
            {_.map(item.types, ((type, index) => {
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
        } else if(item.id === 'email') {
          return <span>{email}</span>;
        } else if(item.id === 'payment') {
          return <span></span>;
        } else if(item.id === 'partners') {
          return (
            <span className="partners">
            {_.map(item.partners, ((partner, index) => {
              return <a className={partner.id} key={`settingPartner${index}`} href={partner.url} target="getback">{partner.label}</a>;
            }))}
            </span>
          );
        } else {
          return null;
        }
      });
    return (
      <div className={name}>
        <h1>{title}</h1>
        <h2>{login}</h2>
        {_.map(items, ((item, index) => {
          return (
            <section className={item.id} key={`settingItem${index}`}>
              <p>{item.label}: {getItem(item)}</p>
            </section>
          );
        }))}
      </div>
    );
  }
});