import React, {  useEffect, useState} from 'react'; 
import TeamInfo from './TeamInfo'; 
import TeamInfoStatusChecker from './TeamInfoStatusChecker'; 
import Navbar from './Navbar';


const TeamPage = (props) => {
	const [team, setTeam] = useState(''); 
	const [hasFetchedTeam, setHasFetchedTeam] = useState(false); 

	function onFetchedTeamData(data) {
		console.log('TEAM FETCHED FROM ID:', data);
		setTeam(data); 
		setHasFetchedTeam(true);
	}

	return (
		<div className="team-page">
			<Navbar />
			{ hasFetchedTeam ?
				<TeamInfo teamData={team} isNewTeam={false} />
			:
				<TeamInfoStatusChecker teamCode={props.match.params.teamCode} onFetchedTeamData={(teamData) => onFetchedTeamData(teamData)} />
			}
		</div>
	);

}

export default TeamPage; 