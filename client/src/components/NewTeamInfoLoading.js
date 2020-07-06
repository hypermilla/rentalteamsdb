import React from 'react';

const NewTeamInfoLoading = (props) => {
	return (
		<button class="btn btn-primary mt-5 mx-auto" type="button" disabled>
			<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
			{props.status}
		</button>
	);
}

export default NewTeamInfoLoading; 





