'use strict'
var {Link} = Router;
var Header = React.createClass({
  getInitialState() {
    return {
      menuVisible: false
    }
  },
  toggleMenu() {
    this.setState({
      menuVisible: !this.state.menuVisible
    });
  },
  render() {
    var self = this;
    return (
      <div className="userNav">

        <section className="header clearfix">
          <div className="bgShader">
            <Link to="dashboard" className="logo">Gitback</Link>
            <span className="menuButton" onClick={this.toggleMenu}><img className="hmbr" src="/assets/images/menuButton.png"/></span>
          </div>
        </section>
        <div className={`menu ${this.state.menuVisible? 'visible':''}`}>
          <ul>
            <li><Link onClick={this.toggleMenu} to="dashboard">Dashboard</Link></li>
            <li><Link onClick={this.toggleMenu} to="leaderboard">Leaderboard</Link></li>
            <li><Link onClick={this.toggleMenu} to="settings">Settings</Link></li>
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Header;
