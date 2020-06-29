import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import LandingPage from './LandingPage';
import NewTeamForm from './NewTeamForm';
import TeamInfo from './TeamInfo';


class App extends Component  
{
	render() {
		return (
			<div className="App container-fluid bg-darker text-light">
			<Header />
			<div className="content">
				<div className="container bg-darker">
					<Switch>
						<Route exact path="/" component={LandingPage} />
						<Route path="/newteam" component={NewTeamForm} />
						<Route path="/team/:id" component={TeamInfo} />	
					</Switch>
				</div>
			</div>
			</div>
		);
	}
}

export default App;
