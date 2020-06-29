import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    
    return (
        <div className="header navbar bg-darker">
			<Link to="/">
            	<h1>RotomBox</h1>
			</Link>

			<Link to="/newteam" type="button" className="new-team-btn btn btn-primary">
                Add New Rental Team
            </Link>
        </div>
    );
}

export default Header;