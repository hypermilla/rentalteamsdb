module.exports = {
    googlevisionkey: {
        "type": "service_account",
        "project_id": "rental-teams-ocr",
        "private_key_id": process.env.GOOGLE_VISION_PRIVATE_KEY_ID,
        "private_key": process.env.GOOGLE_VISION_PRIVATE_KEY,
        "client_email": process.env.GOOGLE_VISION_CLIENT_EMAIL,
        "client_id": process.env.GOOGLE_VISION_CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/rental-teams%40rental-teams-ocr.iam.gserviceaccount.com"
    },
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT,
    redisURL: process.env.REDIS_URL,
    AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    AWSSecretKey: process.env.AWS_SECRET_KEY,
    S3BucketName: process.env.S3_BUCKET_NAME
}