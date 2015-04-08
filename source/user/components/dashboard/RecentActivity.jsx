'use strict'

var util = require('../../../lib/util.jsx'),
  logger = Logger.get('Dashboard.RecentActivity'),
  UserActions = require('../../../actions/UserActions.jsx'),
  PaymentMethod = require('../../../components/payments');

var RecentActivity = React.createClass({
  update() {
    if(_.isArray(this.activities) && this.activities.length > 0) {
      var timestamp = +new Date(this.activities[0].createdAt);
      var diff = Date.now() - timestamp;
      if(diff < 1000 * 10) {
        // if the latest activity is less than 10 seconds, show blink animation.
        clearTimeout(this.tid);
        var el = this.refs.activity0.getDOMNode();
        this.tid = setTimeout(() => {
          el.setAttribute('animation', true);
        }, 100);
      }
    }
  },
  componentDidUpdate() {
    if(this.activities) this.update();
  },
  componentDidMount() {
    if(this.activities) this.update();
  },
  componentWillMount() {
    clearTimeout(this.tid);
  },
  componentWillUpdate() {
    if(this.refs.activity0) {
      var el = this.refs.activity0.getDOMNode();
      el.removeAttribute('animation');
    }
  },
  render() {
    var self = this,
      {model, context} = this.props,
      {username, repos, totalContribAmount} = model,
      {recentActivityTitle, recentActivityMessage} = context;
    if(totalContribAmount) {
      var activities = [];
      _.each(repos, (repo) => {activities = activities.concat(repo.contribLog)});
      activities = _.sortBy(activities, (activity) => {+new Date(activity.createdAt)});
      activities = activities.slice(0, 3);
      this.activities = activities;
      return(
        <div className="activityContainer">
          <h2 className="title">{recentActivityTitle}</h2>
          <ul className="activitiesItems">
          {_.map(activities, ((item, index) => {
            var message = recentActivityMessage
              .replace('#{amount}', util.convertCurrency(item.contribAmount))
              .replace('#{username}', item.username)
              .replace('#{repo}', item.repo)
              .replace('#{timeago}', util.timeago(item.createdAt));
            return (
              <li ref={`activity${index}`} key={`activity${index}`} dangerouslySetInnerHTML={{__html: message}} />
            );
          }))}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
});

module.exports = RecentActivity;
