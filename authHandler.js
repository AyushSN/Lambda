const crypto = require('crypto');


// Constants
const APP_ID = 'mac-pro';
const APP_KEY = '1234abcd';

const ACTIONS = {
  UPDATE: 'update',
  ADD: 'add',
  DELETE: 'delete',
  PURGE: 'purge',
  FETCH: 'fetch'
};

function validateUser(paramAppID, paramAppKey) {
  let resultMessage = true;

  if (!paramAppID) {
    resultMessage = false;
    console.log('Missing app id');
  }

  if (!paramAppKey) {
    resultMessage = false;
    console.log('Missing app key');
  }

  if (paramAppID !== APP_ID) {
    resultMessage = false;
    console.log('Mismatch APPID');
  }

  if (paramAppKey !== APP_KEY) {
    resultMessage = false;
    console.log('Mismatch app key');
  }

  return resultMessage;
}

function hmacSha1(value, key) {
  try {
    const hmac = crypto.createHmac('sha1', key);
    return hmac.update(value).digest('hex');
  } catch (e) {
    throw new Error(e);
  }
}

function getAuthInstance(json) {
  try {
  //  console.log(`json.auth ::: ${JSON.stringify(json.auth)}`);
    return json.auth;
  } catch (e) {
    console.log('Error while parsing JSON for auth:', e.message);
    return null;
  }
}

module.exports = { validateUser, hmacSha1, getAuthInstance, ACTIONS };
