const AbstractHandler = require('./abstractHandler');
const DBUtils = require('../utils/dbUtils');
const Response = require('../responses/response');
const ApiGatewayResponse = require('../responses/apiGatewayResponse');
const { getConnection } = require('../utils/dbUtils');
const {Util} = require('../utils/util');
const {ACTIONS} = require('../authHandler');

class SyncPayHandler extends AbstractHandler {

    async handleRequest(input, context) {
        let responseBody = '';
        let responseContent = '';

        // Validate the user
        const validationResult = this.validate(input, context);

        if (!validationResult) {
            return this.buildBadAuthResponse();
        }

        const pay = SyncPayHandler.getPay(this.jsonQueryString);

        if (pay && pay.action) {
            if (pay.action === ACTIONS.FETCH) {
                console.log("===== Inside fetch record process =====");
                try {
                    responseContent = await this.getRecordsFromCustomerPayments(pay);
                } catch (error) {
                    console.error("=== Failed to fetch customer internal id from customer_payments table for Id : " + pay.id);
                    responseContent = "Failed to fetch customer_payments";
                }
                console.log("===== Completed fetch record process =====");
            }

            if (pay.action === ACTIONS.UPDATE) {
                console.log("===== Inside update record process =====");
                try {
                    responseContent = await this.updateQueryForCustomerPayments(pay);
                } catch (error) {
                    console.error("=== Failed to update customer_payments table for Id : " + pay.id);
                    responseContent = "Failed to update customer_payments.";
                }
                console.log("===== Completed update record process =====");
            }
        }

        responseBody = new Response(responseContent, null);
        return ApiGatewayResponse
            .builder()
            .setStatusCode(200)
            .setObjectBody(responseBody)
            .build();
    }

    static async getRecordsFromCustomerPayments(pay) {
        console.log("================  inside getRecordsFromCustomerPayments  =================");

        const query = pay.approved
            ? "SELECT * FROM customer_payments cp INNER JOIN payments p ON p.id = cp.payment_id WHERE is_approved = ?"
            : "SELECT * FROM customer_payments cp INNER JOIN payments p ON p.id = cp.payment_id";

        let dbConnection;
        let jsonArray;

        try {
            dbConnection = await getConnection();
            const [rows] = await dbConnection.execute(query, pay.approved ? [decodeURIComponent(pay.approved)] : []);

            // Convert the result set directly to JSON
            jsonArray = JSON.stringify(rows);

        } catch (error) {
            console.error("=== Exception while fetching records from customer_payments table for customer Id : " + pay.id + "\n due to exception : " + error.message);
            return "Failed to fetch customer_payments";
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }

        console.log("================ completed ================");
        return jsonArray ? `{"status":"success","data":${jsonArray}}` : "Failed to change result into json format";
    }

    static async updateQueryForCustomerPayments(pay) {
        console.log("==========  inside updateQueryForCustomerPayments ==========");

        const query = "UPDATE customer_payments SET status = ?, updated_at = NOW() WHERE id = ?";
        let dbConnection;
        let responseBody = '';

        try {
            dbConnection = await getConnection();
            await dbConnection.execute(query, [
                decodeURIComponent(pay.status),
                parseInt(decodeURIComponent(pay.id))
            ]);

            responseBody = `Records have been updated successfully to customer_payments for id : ${pay.id}`;
            console.log("=============== Records are updated to customer_payments table! ==================");
        } catch (error) {
            responseBody = `Failed to save data in customer_payments: ${error.message}`;
            console.error("============  Got Exception : " + error.message + " =======================");
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }

        return responseBody;
    }

    static getPay(json) {
        const pay = {
            type: json.type,
            ...json.pay
        };

        console.log(JSON.stringify(pay));
        return pay;
    }
}

exports.handler = async (event, context) => {
    const handler = new SyncPayHandler();
    return handler.handleRequest(event, context);
};
module.exports.SyncPayHandler = SyncPayHandler;