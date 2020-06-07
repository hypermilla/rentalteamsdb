const fs = require("fs");
const path = require('path');
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



const uploadToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: keys.S3BucketName,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          // let imagePath = Date.now().toString();
          // imagePath += "_";
          // imagePath += file.originalname;
        cb(null, Date.now().toString());
        }
    })
  });

const uploadRentalTeamImage = uploadToS3.single('rentalTeamScreenshot');

module.exports.uploadRentalTeamImage = uploadRentalTeamImage;
module.exports.uploadToS3 = uploadToS3;