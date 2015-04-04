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
    var {name, label, didMount, index} = this.props;
    if(index === 0) {
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
    var {name, label, index} = this.props;
    return (
      <span className={name} onClick={this.clickItem}>{index === 0? '' : label}</span>
    );
  }
});

var LiveFeedItem = React.createClass({
  componentWillUpdate() {
    if(this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      this.contribItems = [];
    }
  },
  startTyping(items) {
    var self = this;
    if(this.props.index === 0 && items.length > 0) {
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
    if(this.props.index === 0) {
      var contribItems = this.contribItems = this.contribItems || [];
      contribItems.push(items);
      if(contribItems.length === 5) {
        this.startTyping(contribItems);
        this.contribItems = [];
      }
    }
  },
  render() {
    var {index, user} = this.props,
      {username, repo, avatarUrl, createdAt, commits} = user,
      contribAmountPerPush = 0.01;
    return (
      <li className="userContrib clearfix">
        <div className="userContribItem">
          <span className="tbAvatar" style={avatarUrl? {backgroundImage: `url(${avatarUrl})`} : {}} />
        </div>
        <div className="userContribItem">
          <ContribItem didMount={this.didMountContribItem} index={index} name="username" label={username} />
          <ContribItem didMount={this.didMountContribItem} index={index} name="gave" label={'gave'} />
          <ContribItem didMount={this.didMountContribItem} index={index} name="amount" label={`$${contribAmountPerPush}`} />
          <br/>
          <ContribItem didMount={this.didMountContribItem} index={index} name="repo" label={`~/${username}/${repo}`} />
          <ContribItem didMount={this.didMountContribItem} index={index} name="timeElapsed" label={util.timeago(createdAt)} />
        </div>
      </li>
    );
  }
});

var Feed = React.createClass({
  componentDidMount() {
    var el = this.refs.terminal.getDOMNode();
    setTimeout(() => {
      el.className += ' visible';
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
