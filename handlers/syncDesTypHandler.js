const AbstractHandler = require('./abstractHandler');
const S3bucketUtils = require('../utils/s3bucketUtils');
const DBUtils = require('../utils/dbUtils'); // Assuming you have a dbUtils.js file for constants and such
const Response = require('../responses/response');
const ApiGatewayResponse = require('../responses/apiGatewayResponse');

class SyncDesTypHandler extends AbstractHandler {
async  handleRequest(input, context) {
    const validationResult = this.validate(input, context);

    if (!validationResult) {
      return this.buildBadAuthResponse();
    }

    const fileName = `syncdestyprequest${Math.random()}.json`;
    console.log(`Request File Name: ${DBUtils.S3BUCKET_BULKDESIGNTYPE}/${fileName}`);
  //  console.log(`Final JSON Content : ${this.jsonQueryString}`);
    await S3bucketUtils.uploadText(DBUtils.S3BUCKET_BULKDESIGNTYPE, fileName, this.jsonQueryString);

    const responseBody = new Response(DBUtils.SUCCESS_MESSAGE, null);

    return ApiGatewayResponse.builder()
      .setStatusCode(200)
      .setObjectBody(responseBody)
      .build();
  }
}

// Exporting the Lambda handler function
exports.handler = async (event, context) => {
  const handler = new SyncDesTypHandler();
  return handler.handleRequest(event, context);
};
