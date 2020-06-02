import React from 'react';
import { connect } from 'react-redux';
import { size, toArray } from 'lodash';

import { uploadFile } from '../reducers/uploadFile/uploadFile.actions';
import UploadItem from './uploadItem';

const UploadProgress = props => {
	const { fileProgress } = props;
	const uploadedFileAmount = size(fileProgress);


	return uploadedFileAmount > 0 ? (
		<div>
			<h4>Uploading File</h4>
			{size(fileProgress)
				? toArray(fileProgress).map(file => (
					<UploadItem key={file.id} file={file} />
				))
				: null}
		</div>
	) : null;
}

const mapStateToProps = state => ({
	fileProgress: state.fileProgress,
})

export default connect(null, mapStateToProps)(UploadProgress);