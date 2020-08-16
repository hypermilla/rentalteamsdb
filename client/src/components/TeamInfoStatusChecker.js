import React, {useState, useEffect} from 'react';
import axios from 'axios';

const TeamInfoStatusChecker = (props) => {
	const [teamStatus, setTeamStatus] = useState('Getting team info...');

	useEffect(() => {
		const fetchTeamDataFromId = async () => {
			try {
				console.log('FETCHING DATA FROM ID', props.teamCode);
				let teamDataFromId = await axios.get(`${process.env.REACT_APP_SERVER_URL}/fetch_team_by_code/${props.teamCode}`); 

				if (teamDataFromId.data.msg != undefined) {
					setTeamStatus(teamDataFromId.data.msg); 
					document.getElementById("spinner").className = ""; 
				} 
				else {
					sendNewTeamData(teamDataFromId.data.team); 
					setTeamStatus('Team data retrieved!'); 
				}
			}
			catch(error) {
				setTimeout(fetchTeamDataFromId, 5000);
			}
		};

		const sendNewTeamData = (data) => {
			console.log('Team Data Fetched!'); 
			props.onFetchedTeamData(data); 
		};

		fetchTeamDataFromId();
	}, []);

	return (
		<div className="loading-status btn btn-primary btn-block mt-5 mx-auto" disabled>
			<span id="spinner" className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
				{teamStatus}
		</div>
	);
}

export default TeamInfoStatusChecker;





