import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Message from './Message';
import ProgressBar from './ProgressBar';

import NewTeamInfoLoading from './NewTeamInfoLoading';
import NewTeamInfo from './NewTeamInfo'; 

const NewTeamForm = () => {

	const [file, setFile] = useState('');
	const [filename, setFilename] = useState('');
	const [newTeamId, setNewTeamId] = useState(''); 
	const [newTeamData, setNewTeamData] = useState('');
	const [message, setMessage] = useState('');
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [isWaitingForTeamData, setWaitingForTeamData] = useState(false);
	const [isInvalidImage, setIsInvalidImage] = useState(true);
	const [jobStatus, setJobStatus] = useState('Analysing image...');
	const [statusUpdateCount, setStatusUpdateCount] = useState(0);

	const reader = new FileReader(); 

	const onChange = e => {

		setFile(e.target.files[0]);
		setFilename(e.target.files[0].name);

		if (!e.target.files[0] && !e.target.files) {
			setMessage('No file selected');
			setIsInvalidImage(false);
			return false;  
		}

		if (!e.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/)) {
			setMessage('Please select an image file.');
			setIsInvalidImage(false);
			return false;
		}

		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				if (img.width != 1280 || img.height != 720) {
					setMessage('Invalid image size!');
					console.log(img.width, img.height);
					setIsInvalidImage(false);
					return false; 
				}
			};

			img.onerror = () => {
				setMessage ('Invalid image content');
				setIsInvalidImage(false);
				return false; 
			};
			img.src = e.target.result;	 
		};
		reader.readAsDataURL(e.target.files[0]);
		setMessage('');
		setIsInvalidImage(true);
	}

	const onSubmit = async e => {
		e.preventDefault();

		if (file == '') {
			setMessage("No file uploaded");
			return; 
		}

		if (!isInvalidImage) {
			setMessage(message);
			return;
		} 

		const formData = new FormData(); 
		formData.append('rentalTeamScreenshot', file);
		setMessage("Uploading file...");
		setIsUploading(true);

		try {
			const res = await axios.post('/api/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'					
				},
				onUploadProgress: progressEvent => {
					setUploadPercentage(parseInt(Math.round(
						(progressEvent.loaded * 100) / progressEvent.total))
					);
					//setTimeout(() => setUploadPercentage(0), 55000);
				}
			});

			setNewTeamId(res.data.newTeamId);
			//setNewTeamData(res.data.newTeamData);
			setMessage("Image uploaded. Generating team data...");
			setIsUploading(false);
			setWaitingForTeamData(true);
			setStatusUpdateCount(1);
			setJobStatus("Generating Team Data from image...");
			//console.log(res.data);
		} 
		catch (err) {
			setMessage('There was a problem with the server');
			console.log(err);
		}
	}

	useEffect(() => {
		const getNewTeamData = async (newTeamId) => {
			const url = '/api/team_job_status/' + newTeamId;
			console.log("Fetching Job Status!", statusUpdateCount, url);
			let status = await axios.get(url); 
			console.log(status);
			return status;
		};

		if (isWaitingForTeamData) {
			setTimeout(async () => {
				const status = await getNewTeamData(newTeamId);
				console.log("Data:", status.data);	
				console.log("Logs: ", status.data.logs);
				if (status.data.state == "completed") {
					//fetch completed job data 		
					setWaitingForTeamData(false);
					setNewTeamData(status.data.result);
					setJobStatus("Team Data Generated!");
					setMessage("Team data generated! Please check your new team.");
				}
				else {
					setStatusUpdateCount(statusUpdateCount + 1);
					setWaitingForTeamData(true);	
					setJobStatus(status.data.logs.logs[status.data.logs.count - 1]);
				}
			}, 1000);
		}
	}, [statusUpdateCount]);

	return (
		<div className="new-team-form">
			<h1>Import your Rental Team Screenshot</h1>
			<p>Share your Rental Team image from your Nintendo Switch and upload the PNG file here. 
				<br />We will read the file and add your team to the database!
			</p>

			{ message ? <Message msg={message} /> : null }

			<form onSubmit={onSubmit}>
			<div className="custom-file">
				<input type="file" name="rentalTeamScreenshot" className="custom-file-input" id="customFile" onChange={onChange} />
				<label className="custom-file-label" htmlFor="customFile">
					{filename}
				</label>
			</div>
			<input type="submit" value="upload" className="btn btn-primary btn-block mt-4" />
			</form>

			{ isUploading ? <ProgressBar percentage={uploadPercentage} /> : null }
 
			<NewTeamInfo 
				newTeamId={newTeamId} 
				isWaitingForTeamData={isWaitingForTeamData}
				newTeamData={newTeamData} 
				status={jobStatus}
			/> 

		</div>
	);
}

export default NewTeamForm;

