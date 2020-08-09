import React, {useState, useEffect} from 'react';
import axios from 'axios';

const TeamInfoStatusChecker = (props) => {
	const [teamStatus, setTeamStatus] = useState('Getting team info...');

	useEffect(() => {
		const fetchTeamDataFromId = async () => {
			try {
				console.log('FETCHING DATA FROM ID', props.rentalCode);
				let teamDataFromId = await axios.get(`/api/fetch_team_by_rental_code/${props.rentalCode}`); 
				sendNewTeamData(teamDataFromId.data.team); 
				setTeamStatus('Team data retrieved!'); 
			}
			catch(error) {
				return error; 
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
			<span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
				{teamStatus}
		</div>
	);
}

export default TeamInfoStatusChecker;





