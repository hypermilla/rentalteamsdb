import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    
    return (
        <div className="header bg-darker">
			<Link to="/newteam" type="button" className="new-team-btn btn btn-primary">
					Add New Rental Team
			</Link>
			<div className="logo">
				<Link to="/">
					<img align="center" src={require("../img/logo.png")}  nopin="nopin" />
				</Link>
			</div>
			<h1><span className="rotom">Rotom</span><span className="box">Box</span></h1>
        </div>
    );
}

export default Header;