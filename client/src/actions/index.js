import axios from 'axios';
import { FETCH_TEAM } from './types'; 
import { TEST } from './types';
import { UPLOAD_TEAM } from './types';

export const fetchTeam = () => async dispatch => {
	try {
		const res = await axios.get('/api/fetch_team');
		dispatch({ type: FETCH_TEAM, payload: res.data });
	}
	catch (error)
	{
		console.log(error);
	}
}

export const test = () => async dispatch => {
	const res = await axios.get('/api/test');
	dispatch({ type: TEST, payload: res.data });
}

export const uploadTeam = (file) => async dispatch => {
	const res = await axios.post('/api/upload');
	dispatch({ type: UPLOAD_TEAM, payload: res.data });
}
