import React from 'react';

const TeamLink = (props) => {
	return (
		<div class="team-link input-group">
		<input type="text" class="form-control" id="teamLink" ref={props.linkRef} value={props.teamURL} />
		<div class="input-group-append">
			<button class="btn btn-primary copy-link-btn" id="basic-addon2" onClick={(e) => props.onClick(e)}>
				Copy Link
			</button>
		</div>
	</div>
	);
}

export default TeamLink;