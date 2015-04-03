'use strict'

var Hero = React.createClass({
  render() {

    var self = this,
      {projectTitle, heroSection, sectionTwo} = this.props.context;

    return (
      <section className="hero">
        <section className="header">
          <a href="/" className="logo">{projectTitle}</a>
          <a href="#getInvolved" className="nav">{heroSection.nav[0]}</a>
          <a href="#ourMission" className="nav">{heroSection.nav[1]}</a>
          <a href="/login" className="login">{heroSection.login}</a>
        </section>
      </section>
    );
  }
});

// var LiveFeed = React.createClass({
//   render() {
//     var rows = [];
//
//     this.props.users.forEach(function(user) {
//       rows.push(<LiveFeedItem
//         user={user}
//         id={user.id}
//         name={user.name}
//         repoName={user.repo.name}
//         repoUrl={user.repo.url}
//         donation={user.donation}
//         commiTime={user.lastCommit} />);
//     }.bind(this));
//
//     return (
//       <section className="feed">
//         <ul>
//           {rows}
//         </ul>
//       </section>
//     );
//   }
// });

// var LiveFeedItem = React.createClass({
//   render() {
//     var {username, repo, avatarUrl, createdAt, commits} = this.props.user;
//     console.log(this.props.user);
//     return (
//       <li className="user">
//         <img className="user-img" src={avatarUrl} />
//         <div className="user-info">
//           <p className="user-contribution">{username} gave ${commits.length * .01}</p>
//           <p className="user-repo"><a href={`http://github.com/${username}/${repo}`}>{`${username}/${repo}`}</a></p>
//         </div>
//         <p className="time-elapsed">{(new Date(createdAt).toString())}</p>
//       </li>
//     )
//   }
// });

// var Login = React.createClass({
//   render() {
//     return (
//       <a href="/login" className="login-btn"><i className="icon"></i>Sign in with GitHub</a>
//     );
//   }
// });

var Footer = React.createClass({
  render() {
    return (
      <footer></footer>
    );
  }
});

var App = React.createClass({
  mixins: [
    Reflux.connect(require('../store/LiveFeedStore.jsx'), 'users')
  ],
  render() {
    var self = this,
      context = this.props.context;

    return (
      <main className="home">
          <div className="content">
            <Hero context={context} />
            <Footer/>
          </div>
      </main>
    );
  }
});

module.exports = App;
