import React, { useState, useEffect } from 'react';
import axios from 'axios';
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