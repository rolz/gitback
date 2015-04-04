'use strict'

var LiveFeedItem = React.createClass({
  render() {
    var {username, repo, avatarUrl, createdAt, commits} = this.props.user,
    contribAmountPerPush = 0.01;
    // console.log(this.props.user);
    return (
      <li className="userContrib">
        <span className="tbAvatar" style={{backgroundImage: `url(${avatarUrl})`}} />
        <span className="username">{username}</span>
        <span className="gave">gave</span>
        <span className="amount">${contribAmountPerPush}</span>
        <span className="repo"><a href={`http://github.com/${username}/${repo}`} traget="_blank">{`${username}/${repo}`}</a></span>
        <span className="timeElapsed">{createdAt}</span>
      </li>
    )
  }
});

var Feed = React.createClass({
  componentDidMount: function() {
    var self = this;
    setTimeout(function(){
      self.refs.terminal.getDOMNode().className += ' visible';
    }, 500);
  },

  render() {
    var users = this.props.users || [];
    return (
      <section className="feed">
        <div className="terminal" ref="terminal">
          <div className="header">
            <span className="ui-btn red"></span>
            <span className="ui-btn yellow"></span>
            <span className="ui-btn green"></span>
          </div>
          <ul>
            {_.map(users, ((user, index) => {
              return <LiveFeedItem key={`LiveFeedItem${index}`} user={user} />
            }))}
          </ul>
        </div>
      </section>
    );
  }
});

module.exports = Feed;
