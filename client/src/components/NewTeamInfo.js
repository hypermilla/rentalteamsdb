import React, { Component, useState } from 'react';
import axios from 'axios';


const NewTeamInfo = () => {

	const fetchNewTeamData = () => {
		const res = await axios.post('/api/fetch_team/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'					
			},
			onUploadProgress: progressEvent => {
				setUploadPercentage(parseInt(Math.round(
					(progressEvent.loaded * 100) / progressEvent.total))
				);
				setTimeout(() => setUploadPercentage(0), 15000);
			}
		});
	}

	return (
		
	);
}

export default NewTeamInfo; 