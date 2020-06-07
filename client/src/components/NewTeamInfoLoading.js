import React, { Component, useState } from 'react';
import axios from 'axios';


const NewTeamInfoLoading = () => {

	return (

		<button class="btn btn-primary mt-5 mx-auto" type="button" disabled>
			<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
			Waiting for new team data... 
		</button>
	);

}

export default NewTeamInfoLoading; 





