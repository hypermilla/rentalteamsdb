import React, { Component } from "react";

const Footer = (props) => {
	return (
		<div className="footer">
			<p>
				Rotomi.io is a project by <a href="https://twitter.com/hypermilla" target="_blank" className="text-link">@hypermilla</a>.<br />
				Sprites are from <a href="https://www.pkparaiso.com/" target="_blank" className="text-link">PkParaiso</a>.<br />
			</p>
			<div className="donation">
				<div className="kofi">
					<a href='https://ko-fi.com/P5P5196AB' target='_blank'>
						<img src='https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/5ca5bf1dff3c03fbf7cc9b3c_Kofi_logo_RGB_rounded-p-500.png' height='24' />
						Buy me a coffee!
					</a>
				</div>
				<div className="donate-crypto">
					<p><b>ETH:</b> <a href="#" className="text-link">milla.eth</a></p>
					<p><b>BTC:</b> <a href="#" className="text-link">1FiXbrMAQ6RAyCEV43QJzs5HfuZhTyZBbk</a></p>
				</div>
			</div>
		</div>
	);
}

export default Footer; 