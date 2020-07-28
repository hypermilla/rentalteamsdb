import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import JobStatusChecker from './JobStatusChecker'; 
import TeamInfo from './TeamInfo'; 
import SaveTeamDataButton from './SaveTeamDataButton'; 

const TeamCreationPage = () => {
	const [newTeamId, setNewTeamId] = useState(''); 
	const [newTeamData, setNewTeamData] = useState('');
	const [isCreatingTeam, setCreatingTeam] = useState(false);
	const [newTeamSavedStatus, setNewTeamSavedStatus] = useState('');

	function onUploadComplete(newTeamId) {
		setNewTeamId(newTeamId); 
		setCreatingTeam(true);
	}

	function onTeamCreated(data) {
		setCreatingTeam(false); 
		setNewTeamData(data.teamData);
		setNewTeamSavedStatus(data.savedStatus); 
	}

	function onUpdateTeamData(data) {
		console.log('Data should be updated!'); 
		setNewTeamData(data); 
	}

	return (
		<div className="new-team">
			{ newTeamData ? 
				null :
				<UploadForm onUploadComplete={(jobId) => onUploadComplete(jobId)} />
			}
			{ isCreatingTeam ? 
				<JobStatusChecker 
					jobId={newTeamId}
					onTeamCreated={(teamData) => onTeamCreated(teamData)} 
				/> 
				: null 
			} 
			{ newTeamData ? 
				<div className='new-team-info'>
					<SaveTeamDataButton 
						teamId={newTeamId}
						teamData={newTeamData}
						savedStatus={newTeamSavedStatus}
					/>
					<TeamInfo 
						newTeamId={newTeamId} 
						teamData={newTeamData} 
						isNewTeam={true}
						onUpdateTeamData={(data) => onUpdateTeamData(data)}
					/>
				</div>

				: null 
			} 
		</div>
	);
}

export default TeamCreationPage;

