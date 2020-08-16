import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import TeamCreationPage from './TeamCreationPage';
import TeamPage from './TeamPage';
import Footer from './Footer';


class App extends Component  
{
	render() {
		return (
			<div className="App container-fluid">
			<div className="content">
				<Switch>
					<Route exact path="/" component={LandingPage} />
					<Route path="/newteam" component={TeamCreationPage} />
					<Route path="/:teamCode" component={TeamPage} />	
				</Switch>
			</div>
			<Footer />
			</div>
		);
	}
}

export default App;
