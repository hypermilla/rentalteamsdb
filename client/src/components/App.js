import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import LandingPage from './LandingPage';
import NewTeamForm from './NewTeamForm';


class App extends Component  
{
	constructor (props) {
		super (props);
	}

	render() {
		return (
			<div className="App container-fluid bg-dark text-light">
			<Header />
			<div className="content">
				<div className="container bg-dark">
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
