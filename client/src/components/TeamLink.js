import React from 'react';

const TeamLink = (props) => {
	return (
		<div className="team-link input-group">
		<input type="text" className="form-control" id="teamLink" ref={props.linkRef} value={props.teamURL} />
		<div className="input-group-append">
			<button className="btn btn-primary copy-link-btn" id="basic-addon2" onClick={(e) => props.onClick(e)}>
				Copy Link
			</button>
		</div>
	</div>
	);
}

export default TeamLink;