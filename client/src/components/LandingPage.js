import React from 'react';
import SearchBar from './searchBar';
import { Link } from 'react-router-dom';


const LandingPage = () => {

    return (
        <div className="landing">
			<h1>Oi Edu!!!</h1>
            <Link to="/newteam" type="button" className="btn btn-primary">
                Add New Rental Team
            </Link>
			
            <SearchBar />
			<a href="/api/fetch_team_by_id/5edc479102ca4468ffc0d676" type="button" className="btn btn-primary">Test API</a>
        </div>
    );
}

export default LandingPage;