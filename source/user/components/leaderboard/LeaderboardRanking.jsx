'use strict'

var LeaderboardRanking = React.createClass({
  render: function () {
    var self = this,
      {name, state, context} = this.props.params,
      {title} = context;
    var ranking = this.props.params.ranking || 'today';
    return (
      <section className={`ranking ${ranking}`}>
        <h1>{title}</h1>
        <h2>{ranking}</h2>
      </section>
    );
  }
});

module.exports = LeaderboardRanking;
