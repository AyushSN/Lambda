const mysql = require('mysql2/promise');
require('dotenv').config();
const { processRequest } = require('./utils');

exports.handler = async (event) => {
  try {
    const jsonQueryString = JSON.parse(event.body);
    const responseContent = await processRequest(jsonQueryString);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Request processed successfully', data: responseContent }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
