import React, {useState, useEffect} from 'react';
import axios from 'axios';

const JobStatusChecker = (props) => {
	const [jobStatus, setJobStatus] = useState('Analysing image...');
	const [statusUpdateCount, setStatusUpdateCount] = useState(0);

	useEffect(() => {
		const getNewTeamData = async (jobId) => {
			let status = await axios.get(`/api/team_job_status/${jobId}`); 
			return status;
		};

		const sendNewTeamData = (data) => {
			console.log('Team Created!'); 
			props.onTeamCreated(data); 
		};

		setTimeout(async () => {
			const status = await getNewTeamData(props.jobId);
			if (status.data.state == "completed") {	
				sendNewTeamData(status.data.result);

				if (status.data.result.savedStatus) {
					console.log('Rental Team created! Please check your new team.');
				} else {
					console.log("Rental Team already exists in the database.");	
				}				
			}
			else {
				setStatusUpdateCount(statusUpdateCount + 1);	
				setJobStatus(status.data.logs.logs[status.data.logs.count - 1]);
			}
		}, 1000);
	}, [statusUpdateCount]);

	return (
		<button className="btn btn-primary mt-5 mx-auto" type="button" disabled>
			<span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
			{jobStatus}
		</button>
	);
}

export default JobStatusChecker; 





