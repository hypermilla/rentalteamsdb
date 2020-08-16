import React, {useState} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Message from './Message';

const SaveTeamDataButton = (props) => {
	const [message, setMessage] = useState('');

	const BASE_URL = process.env.REACT_APP_BASE_URL;

	const saveTeamChanges = async () => {
		try {
			const res = await axios.post(`${BASE_URL}/api/update_team`, { teamData: props.teamData });
			setMessage(res.data.msg);
		} 
		catch (err) {
			setMessage('Something went wrong. Could not save your team data!'); 
		}
	};

	let title = 'Your new team has been created!';
	if (!props.savedStatus)
		title = 'This team already exists.';
	
	let description = `Now take your time to edit your team below. You can change each Pokémon's form (if available) and check if they're Shiny or not.`;
	if (!props.savedStatus) 
		description = `Unfortunately it's not possible to update the team data. This feature can be added later!`; 

	return (
		<div class="save-team card">
			<div class="card-body">
				<h4 class="card-title"> {title} </h4>
				<p class="card-text"> {description} </p>
				{ props.savedStatus ?
					<button class="btn btn-primary btn-lg" type="button" onClick={() => saveTeamChanges()}>
						Save Team
					</button>
				: null }
			</div>
			{ message ? 
				<Message msg={message} /> 
				: null 
			}
		</div>
	);
}

SaveTeamDataButton.propTypes = {
	teamData: PropTypes.string.isRequired,
	teamId: PropTypes.string.isRequired
}

export default SaveTeamDataButton; 





