import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    
    return (
        <div className="header">
			<Link to="/newteam" type="button" className="new-team-btn btn btn-primary">
					<i className="fas fa-plus-circle"></i>
					Add new team
			</Link>
			<div className="logo">
				<Link to="/">
					<img align="center" src={require("../img/logo.png")}  nopin="nopin" />
				</Link>
			</div>
			<h1>
				<Link to="/" className="landing-title">
					<span className="rotom">Rotomi</span>.<span className="box">io</span>
				</Link>
			</h1>
        </div>
    );
}

export default Header;