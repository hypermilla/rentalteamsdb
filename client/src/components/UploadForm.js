import React, { useEffect, useState } from 'react';
import Message from './Message'; 
import ProgressBar from './ProgressBar';
import axios from 'axios';

const UploadForm = (props) => {
	const [file, setFile] = useState('');
	const [filename, setFilename] = useState('');
	const [message, setMessage] = useState('');
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [isInvalidImage, setIsInvalidImage] = useState(true);
	const [isUploading, setIsUploading] = useState(false);

	const onChange = e => {
		setFile(e.target.files[0]);
		setFilename(e.target.files[0].name);
		const reader = new FileReader(); 
		
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
				}
			});

			setMessage("Image uploaded. Generating team data...");
			setIsUploading(false);
			props.onUploadComplete(res.data.newTeamId);
		} 
		catch (err) {
			setMessage('There was a problem with the server');
			console.log(err);
		}
	}

	return (
		<div className='new-team-form'>
			<h3>Add your own team</h3>
			<p>Share your Rental Team image from your Nintendo Switch and upload the PNG file here. 
				<br />Rotom will read the image file, recognize the pokémon data and add your team to the database!
			</p>

			{ message ? 
				<Message msg={message} /> 
			: null }

			<form onSubmit={onSubmit}>
			<div className="custom-file">
				<input type="file" name="rentalTeamScreenshot" className="custom-file-input" id="customFile" onChange={onChange} />
				<label className="custom-file-label" htmlFor="customFile">
					{filename}
				</label>
			</div>
			<input type="submit" value="Upload Screenshot" className="btn btn-primary btn-block mt-4" />
			</form>

			{ isUploading ? <ProgressBar percentage={uploadPercentage} /> : null }
		</div>
	);
}

export default UploadForm; 





