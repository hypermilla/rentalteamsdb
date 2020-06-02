import React from 'react';
import { connect } from 'react-redux';
import { size, toArray } from 'lodash';

const UploadItem = props => {
	const { file, progress } = props.file;

	return (
		<div className="wrapperitem">
			<div className="leftSide">
				<div className="progressbar">
					<div style={{ width: `${progress}%` }} />
				</div>
				<label>{file.name}</label>
			</div>
			<span className="percentage">{progress}%</span>
		</div>
	);
}

export default UploadItem;
