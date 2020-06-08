import React from 'react';
import NewTeamInfoLoading from './NewTeamInfoLoading';
import TeamDataPanel from './TeamDataPanel';

const NewTeamInfo = (props) => {
	return (
		<div>
			{ props.isWaitingForTeamData ? 
				<NewTeamInfoLoading /> 
			:	<TeamDataPanel teamData={props.newTeamData} />
			}
		</div>
	);
}

export default NewTeamInfo; 