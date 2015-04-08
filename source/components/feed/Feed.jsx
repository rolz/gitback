'use strict'

var util = require('../../lib/util.jsx');

var ContribItem = React.createClass({
  clickItem() {
    var {name, label} = this.props;
    if(name === 'repo') {
      window.open(label.replace('~', 'http://github.com'), 'gitback');
    }
  },
  componentDidMount() {
    this.didMount();
  },
  componentDidUpdate() {
    this.didMount();
  },
  didMount() {
    var {name, label, didMount, isLast} = this.props;
    if(isLast) {
      var el = this.getDOMNode();
      el.innerHTML = '';
      didMount({
        el: el,
        name: name,
        label: label
      });
    }
  },
  render() {
    var {name, label, isLast} = this.props;
    return (
      <span className={name} onClick={this.clickItem}>{isLast? '' : label}</span>
    );
  }
});

var LiveFeedItem = React.createClass({
  componentWillUnmount() {
    this.resetTyping();
  },
  componentWillUpdate() {
    this.resetTyping();
  },
  resetTyping() {
    if(this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      this.contribItems = [];
    }
  },
  startTyping(items) {
    var self = this;
    if(this.props.isLast && items.length > 0) {
      var {el, name, label} = items.shift(),
        labels = label.split(''),
        type = (() => {
          if(labels.length > 0) {
            el.innerHTML += labels.shift();
            self.timeoutId = setTimeout(type, 50);
          } else {
            self.startTyping(items);
          }
        });
      type();
    }
  },
  didMountContribItem(items) {
    if(this.props.isLast) {
      var contribItems = this.contribItems = this.contribItems || [];
      contribItems.push(items);
      if(contribItems.length === 5) {
        this.startTyping(contribItems);
        this.contribItems = [];
      }
    }
  },
  render() {
    var {isLast, user} = this.props,
      {username, repo, avatarUrl, createdAt, commits, contribAmount} = user;
    return (
      <li className="userContrib clearfix">
        <div className="userContribItem">
          <span className="tbAvatar" style={avatarUrl? {backgroundImage: `url(${avatarUrl})`} : {}} />
        </div>
        <div className="userContribItem">
          <ContribItem didMount={this.didMountContribItem} isLast={isLast} name="timeElapsed" label={util.timeago(createdAt)} />
          <ContribItem didMount={this.didMountContribItem} isLast={isLast} name="username" label={username} />
          <ContribItem didMount={this.didMountContribItem} isLast={isLast} name="gave" label={'gave'} />
          <ContribItem didMount={this.didMountContribItem} isLast={isLast} name="amount" label={util.convertCurrency(contribAmount)} />
          <ContribItem didMount={this.didMountContribItem} isLast={isLast} name="repo" label={`~/${username}/${repo}`} />
        </div>
      </li>
    );
  }
});

var Feed = React.createClass({
  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  },
  componentDidMount() {
    var el = this.refs.terminal.getDOMNode();
    this.timeoutId = setTimeout(() => {
      el.className += ' visible';
    }, 500);
  },

  render() {
    var users = this.props.users || [];
    users = _(users.slice(0, 5)).reverse().value();
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
              return <LiveFeedItem key={`LiveFeedItem${index}`} user={user} isLast={users.length - 1 === index} />
            }))}
          </ul>
        </div>
      </section>
    );
  }
});

module.exports = Feed;
