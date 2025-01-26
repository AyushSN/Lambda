class ApiGatewayResponse {
    constructor(statusCode, body, headers, isBase64Encoded) {
      this.statusCode = statusCode;
      this.body = body;
      this.headers = headers;
      this.isBase64Encoded = isBase64Encoded;
    }
  
    static builder() {
      return new Builder();
    }
  }
  
  class Builder {
    constructor() {
      this.statusCode = 200;
      this.headers = {};
      this.rawBody = null;
      this.objectBody = null;
      this.binaryBody = null;
      this.base64Encoded = false;
    }
  
    setStatusCode(statusCode) {
      this.statusCode = statusCode;
      return this;
    }
  
    setHeaders(headers) {
      this.headers = headers;
      return this;
    }
  
    setRawBody(rawBody) {
      this.rawBody = rawBody;
      return this;
    }
  
    setObjectBody(objectBody) {
      this.objectBody = JSON.stringify(objectBody);
      return this;
    }
  
    setBinaryBody(binaryBody) {
      this.binaryBody = Buffer.from(binaryBody).toString('base64');
      this.setBase64Encoded(true);
      return this;
    }
  
    setBase64Encoded(base64Encoded) {
      this.base64Encoded = base64Encoded;
      return this;
    }
  
    build() {
      const body = this.rawBody || this.objectBody || this.binaryBody || '';
      return new ApiGatewayResponse(this.statusCode, body, this.headers, this.base64Encoded);
    }
  }
  
  module.exports = ApiGatewayResponse;
  