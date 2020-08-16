import React, {useState, useEffect} from 'react';
import axios from 'axios';

const JobStatusChecker = (props) => {
	const [jobStatus, setJobStatus] = useState('Analysing image...');
	const [statusUpdateCount, setStatusUpdateCount] = useState(0);

	useEffect(() => {
		console.log('Rendering Job Status');
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
				if (status.data.result.teamData != undefined)
					sendNewTeamData(status.data.result);
				else setJobStatus(status.data.result)				
			}
			else {
				setStatusUpdateCount(statusUpdateCount + 1);	
				setJobStatus(status.data.logs.logs[status.data.logs.count - 1]);
			}
		}, 4000);
	}, [statusUpdateCount]);

	return (
		<div className="loading-status btn btn-primary btn-block mx-auto" disabled>
			<span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
				{jobStatus}
		</div>
	);
}

export default JobStatusChecker; 





