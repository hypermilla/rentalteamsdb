import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

import { setUploadFile } from '../reducers/uploadFile/uploadFile.actions';
import UploadProgress from './uploadProgress'; 


class NewTeamForm extends Component {

	constructor(props) {
		super(props);
	}

	uploadFile (e) {
		console.log(e.target.files);
		this.props.setUploadFile(e.target.files);
	}

	render () { 
		return (
			<div className="new-team-form">
				<h1>Import your Rental Team Screenshot</h1>
				<p>Share your Rental Team image from your Nintendo Switch and upload the PNG file here. 
					<br />We will read the file and add your team to the database!
				</p>
				<input type="file" multiple onChange={(e) => this.uploadFile(e)} name="rentalTeamScreenshot" />
				<UploadProgress />
			</div>
		);
	}
}


const mapDispatchToProps = dispatch => ({
	setUploadFile: files => dispatch(setUploadFile(files))
});

export default connect(null, mapDispatchToProps)(NewTeamForm);

