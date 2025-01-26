const AbstractHandler = require('./abstractHandler');
const DBUtils = require('../utils/dbUtils');
const ApiGatewayResponse = require('../responses/apiGatewayResponse');
const SyncSetupCustResponse = require('../responses/syncSetupCustResponse');
const {Util} = require('../utils/util');

class SyncSetupCustHandler extends AbstractHandler {

    async handleRequest(input, context) {
        let responseBody = null;
        let output = {};

        // Validate the user
        const validationResult = this.validate(input, context);

        if (!validationResult) {
            return this.buildBadAuthResponse();
        }

        const customerId = SyncSetupCustHandler.getCustIdList(this.jsonQueryString);

        if (customerId && customerId.action && customerId.action === 'FETCH') {
            try {
                output = await this.getCustomerInternalId(customerId);
            } catch (error) {
                console.error(`=== Failed to fetch customer internal id from sw_customers table for customer Id : ${customerId.ID_Customer}`);
                output = {}; // Ensure output is initialized even on error
            }
        }

        console.log(output.customer_internal_id);
        console.log(output.sts_purge);
        responseBody = new SyncSetupCustResponse(output.customer_internal_id, output.sts_purge);

        return ApiGatewayResponse
            .builder()
            .setStatusCode(200)
            .setObjectBody(responseBody)
            .build();
    }

    static async getCustomerInternalId(customerId) {
        console.log("================  inside getCustomerInternalId ================");
        const output = {};
        let dbConnection = null;

        const query = "SELECT sts_purge, customer_internal_id FROM sw_customers WHERE customer_no = ? AND status = 1";

        try {
            dbConnection = await DBUtils.getConnection();
            
            const customerNo = customerId.ID_Customer && !Util.isBlank(customerId.ID_Customer)
                ? parseInt(decodeURIComponent(customerId.ID_Customer))
                : null;

            const [rows] = await dbConnection.execute(query, [customerNo]);

            if (rows.length > 0) {
                const row = rows[0];
                output.customer_internal_id = row.customer_internal_id;
                output.sts_purge = row.sts_purge;
            }

            await this.setStsPurgeToNull(customerId, dbConnection);

        } catch (error) {
            console.error(`=== Exception while retrieving customer internal id from sw_customers table for customer Id : ${customerId.ID_Customer} \n due to exception : ${error.message}`);
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }

        console.log("================ completed ================");
        return output;
    }

    static async setStsPurgeToNull(customerId, dbConnection) {
        console.log("================  inside setStsPurgeToNull ================");
        const query = "UPDATE sw_customers SET sts_purge = ? WHERE customer_no = ? AND status = 1";

        try {
            const customerNo = customerId.ID_Customer && !Util.isBlank(customerId.ID_Customer)
                ? parseInt(decodeURIComponent(customerId.ID_Customer))
                : null;

            await dbConnection.execute(query, [null, customerNo]);

        } catch (error) {
            console.error(`=== Exception while updating sts_purge value in sw_customers table for customer Id : ${customerId.ID_Customer} \n due to exception : ${error.message}`);
        }
    }

    static getCustIdList(json) {
        const customerId = {
            type: json.type,
            ...json.cust
        };

        console.log(JSON.stringify(customerId));
        return customerId;
    }
}

exports.handler = async (event, context) => {
    const handler = new SyncSetupCustHandler();
    return handler.handleRequest(event, context);
};

module.exports.SyncSetupCustHandler = SyncSetupCustHandler;
