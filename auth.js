const ADD = 'add';
const UPDATE = 'update';
const DELETE = 'delete';

const validateUser = (paramAppID, paramAppKey) => {
  return paramAppID === process.env.APP_ID && paramAppKey === process.env.APP_KEY;
};

module.exports = { ADD, UPDATE, DELETE, validateUser };
