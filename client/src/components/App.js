import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './Header';
import LandingPage from './LandingPage';
import NewTeamForm from './NewTeamForm';


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
					</Switch>
				</div>
			</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({

});

export default connect(null, mapDispatchToProps)(App);
