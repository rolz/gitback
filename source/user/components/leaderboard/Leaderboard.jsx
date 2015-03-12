'use strict'

var {RouteHandler, Link} = Router,

Leaderboard = React.createClass({
  render: function () {
    var self = this,
      {name, state, context} = this.props.params,
      {rankings} = context;
    return (
      <main className={name}>
        <nav>
        {_.map(rankings, ((ranking, index) => {
          return <Link key={`leaderboardNav${index}`} to="ranking" params={{ranking: ranking.id}}>{ranking.label}</Link>;
        }))}
        </nav>
        <RouteHandler {...this.props}/>
      </main>
    );
  }
});

module.exports = Leaderboard;