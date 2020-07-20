import React, {useState, useEffect} from 'react';
import axios from 'axios';

const SaveTeamData = (props) => {
	if (!props.teamData) {
		return null;
	}

	const saveTeamChanges = async () => {
		try {
			const res = await axios.post('/api/update_team', {
				teamId: props.teamId,
				teamData: props.teamData
			});
			console.log(res);
		} 
		catch (err) {
			console.log(err);
		}
	};

	return (
		<button 
			class="btn btn-primary" 
			type="button" 
			onClick={() => saveTeamChanges()}
		>
			Save Team
		</button>
	);
}

export default SaveTeamData; 





