const multer = require("multer");
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const keys = require('../config/keys');

aws.config.update({
	secretAccessKey: keys.AWSSecretKey,
	accessKeyId: keys.AWSAccessKeyId,
	region: 'us-east-1'
});

const s3 = new aws.S3();

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: keys.S3BucketName,
		acl: 'public-read',
		metadata: (req, file, cb) => {
			cb(null, {fieldName: file.fieldname});
		},
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: (req, file, cb) => {
			cb(null, Date.now().toString());
		}
	})
});

module.exports = upload;