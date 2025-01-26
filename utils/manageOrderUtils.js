const { Util } = require('../utils/util');

function getJsonStringFromRequest(input) {
  const inputJson = JSON.parse(input.body);
  const body = inputJson.postdata;
  const result = Util.parseStr(body);
//  console.log(`===== Result after conversion ====== \n ${JSON.stringify(result)}`)
  return result;
}

module.exports = { getJsonStringFromRequest };
