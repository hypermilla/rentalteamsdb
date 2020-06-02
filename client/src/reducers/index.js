import { combineReducers } from 'redux';
import reducer from './appReducer';
import UploadFile from './uploadFile/uploadReducer'; 

export default combineReducers ({
	reducer: reducer,
	UploadFile: UploadFile
});