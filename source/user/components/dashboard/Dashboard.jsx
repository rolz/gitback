'use strict'

var Dashboard = React.createClass({
  mixins: [Reflux.connect(require('../../../store/UserStore.jsx'), 'user')],
  render() {
    var self = this,
      {name, state, context} = this.props.params,
      {title} = context;
    return (
      <div className={name}>
        <h1>{title}</h1>
        <p>Now we just need to connect your donation method. Than you can adjust your repos, see your ranking, and start changing the world.</p>
      </main>
    );
  }
});

module.exports = Dashboard;
