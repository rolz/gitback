'use strict'

var Dashboard = React.createClass({
  mixins: [Reflux.connect(require('../../../store/UserStore.jsx'), 'user')],
  render() {
    var self = this,
      {username, avatarUrl} = this.state.user,
      {name, state, context} = this.props.params,
      {title, greetings, subGreetings, introTitle, introSteps, addPaymentsButton} = context;
    console.log(context);
    console.log(title, greetings, subGreetings, introTitle, introSteps, addPaymentsButton);
    return (
      <main className={name}>
        <h1>{title}</h1>
        <h2>{username}</h2>
        <img src={avatarUrl} />

        <div>{greetings[1]}</div>
        <div>{subGreetings[1]}</div>

      </main>
    );
  }
});

module.exports = Dashboard;
