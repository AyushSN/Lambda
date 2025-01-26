const { validateUser, getAuthInstance } = require('../authHandler');
const { getJsonStringFromRequest } = require('../utils/manageOrderUtils');
const ApiGatewayResponse = require('../responses/apiGatewayResponse');
const Response = require('../responses/response');

class AbstractHandler {
  constructor() {
    this.querymap = null;
    this.jsonQueryString = null;
  }

  validate(input, context) {
    this.jsonQueryString = getJsonStringFromRequest(input);
  //  console.log(`jsonQueryString :::: ${this.jsonQueryString}`)
    const authInstance = getAuthInstance(this.jsonQueryString);
  //  console.log(`authInstance :::: ${authInstance}`)
    this.jsonQueryString = JSON.stringify(this.jsonQueryString);
    return validateUser(authInstance.app_id, authInstance.app_key);
  }

  buildBadAuthResponse() {
    const responseBody = new Response('Authentication failed', null);
    return this.buildApiResponse(403, responseBody);
  }

  buildApiResponse(responseCode, responseBody) {
    return ApiGatewayResponse.builder()
      .setStatusCode(responseCode)
      .setObjectBody(responseBody)
      .build();
  }
}

module.exports = AbstractHandler;
