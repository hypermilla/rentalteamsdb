import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import JobStatusChecker from './JobStatusChecker'; 
import TeamInfo from './TeamInfo'; 
import SaveTeamData from './SaveTeamData'; 

const TeamCreationPage = () => {
	const [newTeamId, setNewTeamId] = useState(''); 
	const [newTeamData, setNewTeamData] = useState('');
	const [isCreatingTeam, setCreatingTeam] = useState(false);

	function onUploadComplete(newTeamId) {
		setNewTeamId(newTeamId); 
		setCreatingTeam(true);
	}

	function onTeamCreated(data) {
		setNewTeamData(data);
		setCreatingTeam(false); 
	}

	function onUpdateTeamData(data) {
		console.log('Data should be updated!'); 
		setNewTeamData(data); 
	}

	return (
		<div className="new-team">
			<UploadForm 
				onUploadComplete={(jobId) => onUploadComplete(jobId)} 
			/>
			{ isCreatingTeam ? 
				<JobStatusChecker 
					jobId={newTeamId}
					onTeamCreated={(teamData) => onTeamCreated(teamData)} 
				/> 
			: null} 
			<SaveTeamData 
				teamId={newTeamId}
				teamData={newTeamData}
			/>
			<TeamInfo 
				newTeamId={newTeamId} 
				teamData={newTeamData} 
				isNewTeam={true}
				onUpdateTeamData={(data) => onUpdateTeamData(data)}
			/> 
		</div>
	);
}

export default TeamCreationPage;

