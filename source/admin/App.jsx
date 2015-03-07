'use strict'

var logger = Logger.get('admin.App');

var Repo = React.createClass({
  render() {
    var {name, commits} = this.props.model;
    return (
      <div className="repo">
        <p>{name}: {commits}</p>
      </div>
    );
  }
});

var User = React.createClass({
  render() {
    var {_id, avatarUrl, email, login, repos} = this.props.model;
    return (
      <section className="clearfix">
        <div className="icon">
          <img src={avatarUrl} />
        </div>
        <div className="about">
          <h2>{login}</h2>
          <p>{email}</p>
        </div>
        <div className="repos">
        {_.map(repos, ((repo, index) => {
          return <Repo key={`repo${index}`} model={repo} />
        }))}
        </div>
        <div className="right">
          <button onClick={this.props.removeHandle.bind(null, login)}>
            remove
          </button>
        </div>
      </section>
    );
  }
});

var Actions = require('../actions/UserActions.jsx');

var App = React.createClass({
  mixins: [Reflux.connect(require('../store/UserStore.jsx'),'users')],
  removeUser(userId) {
    Actions.removeUser(userId);
  },
  // initialize() { },
  // onStatusChange(status) {
  //   this.setState({
  //     currentStatus: status
  //   });
  // },
  // componentDidMount() {
  //   this.unsubscribe = statusStore.listen(this.onStatusChange);
  // },
  // componentWillUnmount() {
  //   this.unsubscribe();
  // },
  render() {
    console.log(this.state.users);
    return (
      <div>
        <header>
          <h1>Admin</h1>
        </header>
        <main>
        {_.map(this.state.users, ((user, index) => {
          return <User key={`user${index}`} model={user} removeHandle={Actions.removeUser} />
        }))}
        </main>
      </div>
    );
  }
});

module.exports = App;