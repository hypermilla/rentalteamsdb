import React from 'react';

const TeamDataPanel = (props) => {
	if (!props.teamData) {
		return null;
	}
	return (
		<div>
			<h3>This is your team info!</h3>
			<p>{JSON.stringify(props.teamData)}</p>
		</div>
	);
}

export default TeamDataPanel;