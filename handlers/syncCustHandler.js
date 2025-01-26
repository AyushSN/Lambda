const AbstractHandler = require('./abstractHandler');
const S3bucketUtils = require('../utils/s3bucketUtils');
const DBUtils = require('../utils/dbUtils');
const Response = require('../responses/response');
const ApiGatewayResponse = require('../responses/apiGatewayResponse');

class SyncCustHandler extends AbstractHandler {
    async handleRequest(input, context) {
        const validationResult = this.validate(input, context);

        if (!validationResult) {
            return this.buildBadAuthResponse();
        }

        const fileName = `synccustomerrequest${Math.random()}.json`;
        console.log(`Request File Name: ${DBUtils.S3BUCKET_BULKCUSTOMER}/${fileName}`);
        await S3bucketUtils.uploadText(DBUtils.S3BUCKET_BULKCUSTOMER, fileName, this.jsonQueryString);

        const responseBody = new Response(DBUtils.SUCCESS_MESSAGE, null);

        return ApiGatewayResponse.builder()
            .setStatusCode(200)
            .setObjectBody(responseBody)
            .build();
    }
}

exports.handler = async (event, context) => {
    const handler = new SyncCustHandler();
    return handler.handleRequest(event, context);
};
