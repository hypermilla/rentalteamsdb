import React from 'react';
import NewTeamInfoLoading from './NewTeamInfoLoading';
import TeamDataPanel from './TeamDataPanel';

const NewTeamInfo = (props) => {
	return (
		<div>
			{ props.isWaitingForTeamData ? 
				<NewTeamInfoLoading /> 
			:	<div className="new-team-info">
					<TeamDataPanel teamData={props.newTeamData} />
				</div>
			}
		</div>
	);
}

export default NewTeamInfo; 