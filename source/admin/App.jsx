'use strict'

var logger = Logger.get('admin.App');

var Actions = require('../actions/UserActions.jsx');

var Repo = React.createClass({
  render() {
    var {name, commits, webhookId} = this.props.model,
      login = this.props.login,
      buttonClass = (() => {
        switch(webhookId) {
          case null: case undefined: return '';
          case 'false': return 'add';
          default: return 'remove';
        }
      })();
    return (
      <div className={`repo ${buttonClass}`}>
        <span className="repoInfo">{name}: {webhookId} </span>
        <button className="remove" onClick={Actions.removeWebhook.bind(null, login, name, webhookId)}>remove webhook</button>
        <button className="add" onClick={Actions.addWebhook.bind(null, login, name)}>add webhook</button>
      </div>
    );
  }
});

var User = React.createClass({
  render() {
    var {_id, avatarUrl, email, login, repos} = this.props.model;
    return (
      <section className={'clearfix' + (login === GB.user.login? ' user' : '')}>
        <div className="icon">
          <img src={avatarUrl} />
        </div>
        <div className="about">
          <h2>{login}</h2>
          <p>{email}</p>
          <button onClick={Actions.removeUser.bind(null, login)}>remove this user</button>
        </div>
        <div className="repos">
        {_.map(repos, ((repo, index) => {
          return <Repo key={`repo${index}`} model={repo} login={login} />
        }))}
        </div>
      </section>
    );
  }
});

var App = React.createClass({
  mixins: [Reflux.connect(require('../store/UserStore.jsx'),'users')],
  removeUser(userId) {
    Actions.removeUser(userId);
  },
  render() {
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
      </div>
    );
  }
});

module.exports = App;