require("dotenv").config();

const PORT = process.env.PORT;
const SOCKET_PORT = process.env.SOCKET;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const MAIL_USERNAME = process.env.SMTP_MAIL;
const MAIL_PASSWORD = process.env.SMTP_PASSWORD;
const MAIL_PORT = process.env.SMTP_PORT;
const MAIL_HOST = process.env.SMTP_HOST;
const MAIL_NOREPLAY = process.env.MAIL_NOREPLAY;

module.exports = {
  PORT,
  SOCKET_PORT,
  MONGO_URI,
  JWT_SECRET,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_HOST,
  MAIL_NOREPLAY
};
