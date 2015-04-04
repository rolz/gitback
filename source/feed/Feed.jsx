'use strict'

var util = require('../lib/util.jsx');

var LiveFeedItem = React.createClass({
  /*
  componentDidMount() {
    console.log('componentDidMount', this.props.index);
    this.getDOMNode().className += ' visible';
  },
  componentDidUpdate() {
    console.log('componentDidUpdate', this.props.index);
    if(this.props.index === 0) {

    } else {
      // console.log(this.getDOMNode());
      // this.getDOMNode().style.display = '';
    }
  },
  */
  render() {
    var {username, repo, avatarUrl, createdAt, commits} = this.props.user,
    contribAmountPerPush = 0.01;
    // console.log(this.props.user);
    return (
      <li className="userContrib clearfix">
        <div className="userContribItem">
          <span className="tbAvatar" style={{backgroundImage: `url(${avatarUrl})`}} />
        </div>
        <div className="userContribItem">
          <span className="username">{username}</span>
          <span className="gave">gave</span>
          <span className="amount">{`$${contribAmountPerPush}`}</span>
          <br/>
          <span className="repo"><a href={`http://github.com/${username}/${repo}`} traget="_blank">{`~/${username}/${repo}`}</a></span>
          <span className="timeElapsed">{util.timeago(createdAt)}</span>
        </div>
      </li>
    )
  }
});

var Feed = React.createClass({
  componentDidMount() {
    var self = this;
    setTimeout(() => {
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
              return <LiveFeedItem key={`LiveFeedItem${index}`} user={user} index={index} />
            }))}
          </ul>
        </div>
      </section>
    );
  }
});

module.exports = Feed;