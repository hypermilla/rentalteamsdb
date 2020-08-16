import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    
    return (
        <div className="nav">
			<nav className="navbar navbar-default">
				<div className="container-fluid">
					<div className="navbar-header">
						<Link to="/">
							<a className="navbar-brand" href="#">
								<img alt="Rotomi.io" src={require("../img/rotomi_icon_256px.png")} />
							</a>
							<a className="navbar-brand title" href="#">
								<span className="rotom">Rotomi</span>.
								<span className="box">io</span>
							</a>
						</Link>
					</div>
					<div>
						
					</div>
					<Link to="/newteam" type="button" className="new-team-btn btn btn-primary">
						<i className="fas fa-plus-circle"></i>
						Add new team
					</Link>
				</div>
			</nav>
        </div>
    );
}

export default Navbar;