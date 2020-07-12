import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    
    return (
        <div className="header bg-darker">
			<Link to="/newteam" type="button" className="new-team-btn btn btn-primary">
					Add New Rental Team
			</Link>
			<div className="logo">
				<img align="center" src={require("../img/logo.png")} />
			</div>
			<h1><spam className="rotom">Rotom</spam><spam className="box">Box</spam></h1>
        </div>
    );
}

export default Header;