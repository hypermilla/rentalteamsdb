import React from 'react';
import NewTeamInfoLoading from './NewTeamInfoLoading';
import TeamInfo from './TeamInfo';

const NewTeamInfo = (props) => {
	return (
		<div>
			{ props.isWaitingForTeamData ? 
				<NewTeamInfoLoading /> 
			:	<div className="new-team-info">
					<TeamInfo teamData={props.newTeamData} />
				</div>
			}
		</div>
	);
}

export default NewTeamInfo; 