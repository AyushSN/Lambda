class Response {
    constructor(message, input) {
      this.message = message;
      this.input = input;
    }
  
    getMessage() {
      return this.message;
    }
  
    getInput() {
      return this.input;
    }
  }
  
  module.exports = Response;
  