const { connectToDatabase } = require('./db');
const { ADD, UPDATE, DELETE, validateUser } = require('./auth');

const processRequest = async (jsonQueryString) => {
  const connection = await connectToDatabase();
  const destypList = getDesignTypeList(jsonQueryString);

  let responseContent = '';

  for (const destyp of destypList) {
    if (destyp.action) {
      try {
        switch (destyp.action) {
          case ADD:
            responseContent += await insertQueryForDesignType(destyp, connection);
            break;
          case UPDATE:
            responseContent += await updateQueryForDesignType(destyp, connection);
            break;
          case DELETE:
            responseContent += await deleteQueryForDesignType(destyp, connection);
            break;
          default:
            throw new Error('Unknown action');
        }
      } catch (error) {
        console.error(`Failed to process ${destyp.action} request. Exception: ${error.message}`);
      }
    }
  }

  await connection.end();

  return responseContent;
};

// Helper functions: insertQueryForDesignType, updateQueryForDesignType, deleteQueryForDesignType

module.exports = { processRequest };
