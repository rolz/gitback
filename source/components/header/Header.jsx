'use strict'

var Header = React.createClass({
  componentDidMount: function() {
    this.setState({
      menuVisible: false
    });
  },
  toggleMenu() {
    console.log("menu clicked");
    var self = this,
      el = this.refs.menu.getDOMNode();

      if(this.state.menuVisible) {
        el.className = 'menu';
        this.setState({
          menuVisible: false
        });
      } else {
        el.className = 'menu visible';
        this.setState({
          menuVisible: true
        });
      }
  },
  render() {
    var self = this,
      Link = this.props.link;
    return (
      <div className="userNav">
        <section className="header clearfix">
          <a className="logo" href="/">Gitback</a>
          <span className="menuButton" onClick={this.toggleMenu}>Menu</span>
        </section>
        <div className="menu" ref="menu">
          <ul>
            <li><Link to="dashboard">Dashboard</Link></li>
            <li><Link to="leaderboard">Leaderboard</Link></li>
            <li><Link to="settings">Settings</Link></li>
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Header;
