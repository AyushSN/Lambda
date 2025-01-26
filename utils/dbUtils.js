const mysql = require('mysql2/promise');
const AWS = require('aws-sdk');


// Constants
const DB_DRIVER = 'mysql';
const DB_CONNECTION = "mo-dev-01.cmp6jheni9oj.us-east-1.rds.amazonaws.com";
const DB_DATABASE_NAME = "manageorders";
const DB_PORT = "3306";
const DB_USER = "manageordersdb";
const DB_PASSWORD = "BFg89C^Ti(rg";
const AWS_ACCESS_KEY = "AKIAISHIXVLFRY57QNLQ";
const AWS_SECRET_KEY = "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";

const S3BUCKET_NAME = 'v3-morder-image-bucket';
const S3BUCKET_BULKORDER = 'v3-managebulksyncorders';
const S3BUCKET_BULKCUSTOMER = 'v3-managebulksyncustomer';
const S3BUCKET_BULKTHUMBS = 'v3-managebulksyncthumbs';
const S3BUCKET_BULKEMP = 'v3-managebulksyncemps';
const S3BUCKET_BULKCWIDE = 'v3-managebulksynccwide';
const S3BUCKET_BULKORDERTYPE = 'v3-managebulksyncordertype';
const S3BUCKET_BULKDESIGNTYPE = 'v3-managebulksyncdesigntype';
const S3BUCKET_BULKORDERSTATSET = 'v3-managebulksyncorderstatset';
const S3BUCKET_BULKSYSLABELS = 'v3-managebulksyncsyslabel';
const S3BUCKET_BULKACS = 'v3-managebulksyncacs';
const S3BUCKET_BULKDELETE = 'v3-managebulksyncdeletes';

const BUCKETURL = 'https://s3.amazonaws.com/';
const SUCCESS_MESSAGE = 'Submitted request';

const SES_SENDER_EMAILID = 'LAMBDA RESPONSE <sandydeveloper1@gmail.com>';
const SES_RECIPIENT_EMAILID = 'ssharma@prosperasoft.com';
const SES_MAIL_SUBJECT = 'Records get partially saved for request file: ';

// Function to get a connection to the database
async function getConnection() {
  console.log(`Trying to get connection for DB ${DB_CONNECTION}`);
  let connection;

  try {
    connection = await mysql.createConnection({
      host: DB_CONNECTION,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE_NAME,
      port: DB_PORT

    });
    console.log(`Connected to DB ${DB_CONNECTION}`);
  } catch (error) {
    console.log(`Error while connecting to DB ${DB_CONNECTION}: ${error.message}`);
    throw error;
  }

  return connection;
}

module.exports = {
  DB_DRIVER,
  DB_CONNECTION,
  DB_USER,
  DB_PASSWORD,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  S3BUCKET_NAME,
  S3BUCKET_BULKORDER,
  S3BUCKET_BULKCUSTOMER,
  S3BUCKET_BULKTHUMBS,
  S3BUCKET_BULKEMP,
  S3BUCKET_BULKCWIDE,
  S3BUCKET_BULKORDERTYPE,
  S3BUCKET_BULKDESIGNTYPE,
  S3BUCKET_BULKORDERSTATSET,
  S3BUCKET_BULKSYSLABELS,
  S3BUCKET_BULKACS,
  S3BUCKET_BULKDELETE,
  BUCKETURL,
  SUCCESS_MESSAGE,
  SES_SENDER_EMAILID,
  SES_RECIPIENT_EMAILID,
  SES_MAIL_SUBJECT,
  getConnection
};
