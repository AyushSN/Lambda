const dbUtils = require('../../utils/dbUtils');
const { ACTIONS } = require('../../authHandler');
const { Util } = require('../../utils/util');
const Attributes = require('../models/attributes');

class CwideHandler {
    constructor(jsonQueryString) {
        this.jsonQueryString = jsonQueryString;
    }

    async handle(jsonQueryString) {
        return await this.processRequest(jsonQueryString);
    }

    async processRequest(jsonQueryString) {
        let responseContent = "";

        const attr = Attributes.cwideattr;
        const cwideList = await this.getCwideList(jsonQueryString);

        for (const cwideInstance of cwideList) {
            const action = cwideInstance.action;

            console.log("=====Got passed from Validating user ===== " + action);

            if (action) {
                try {
                    switch (action) {
                        case ACTIONS.ADD:
                            console.log("============== Proceeding to insert value in db ====================");
                            responseContent += await this.insertRecordIntoCustomerSetting(attr, cwideInstance, jsonQueryString);
                            console.log("============== done with insertRecordIntoDbUserTable ====================");
                            break;
                        case ACTIONS.UPDATE:
                            console.log("============== Proceeding to update value in db ====================");
                            responseContent += await this.updateRecordIntoCustomerSetting(attr, cwideInstance, jsonQueryString);
                            console.log("============== done with updateRecordIntoCustomerSetting ====================");
                            break;
                        case ACTIONS.DELETE:
                            console.log("============== Proceeding to delete value from db ====================");
                            responseContent += await this.deleteRecordsFromCustomerSetting(attr, cwideInstance);
                            console.log("============== done with deleteRecordsFromCustomerSetting ====================");
                            break;
                        default:
                            responseContent = "No valid action mentioned in URL";
                    }
                } catch (error) {
                    console.error(`Failed to process ${action} request. Exception: `, error.message);
                }
            }
        }

        console.log("===================== Final Result ==================");
        console.log(responseContent);
        console.log("===================== Finished ==================");
        return responseContent;
    }

    async getCwideList(json) {
        const cwideList = [];
        const jsonOrderId = json.cwide;

        for (const key in jsonOrderId) {
            if (jsonOrderId.hasOwnProperty(key) && key) {
                try {
                    cwideList.push(jsonOrderId[key]);
                } catch (error) {
                    console.log("Got exception while parsing JSON for order des section: " + error.message);
                }
            }
        }

        console.log("Cwide: ", cwideList);
        return cwideList;
    }

    async insertRecordIntoCustomerSetting(attr, cwideInstance, jsonQueryString) {
        console.log("================  inside insertRecordIntoCustomerSetting ================");

        let responseBody = "Failed to insert data";
        const query = `INSERT INTO company_settings(attribute, value, company_setting_no, customer_internal_id, created_at, updated_at)VALUES (?, ?, ?, ?, ?, ?)`;

        let dbConnection;
        try {
            dbConnection = await dbUtils.getConnection();
            const swCustomerId = await this.getSwCustomerId(parseInt(decodeURIComponent(cwideInstance.id_CustomerInternal)), dbConnection);

            if (swCustomerId === 0) {
                responseBody = `No such SW customer is present in records for id ${swCustomerId} >> Failed to insert company setting in database`;
                return responseBody;
            }

            const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

            for (let cnt = 0; cnt < attr.length; cnt++) {
                try {
                    const temp = decodeURIComponent(jsonQueryString.cwide[cwideInstance.ID_Serial][attr[cnt]]);
                    await dbConnection.execute(query, [
                        attr[cnt], 
                        temp, 
                        cwideInstance.ID_Serial ? parseInt(decodeURIComponent(cwideInstance.ID_Serial)) : null,
                        cwideInstance.id_CustomerInternal ? parseInt(decodeURIComponent(cwideInstance.id_CustomerInternal)) : null,
                        currentTime, currentTime]);
                } catch (e) {
                    console.log(`==== No value for key : ${attr[cnt]} ==== ex: ${e.message}`);
                }
            }

            responseBody = "Records have been inserted successfully.";
        } catch (e) {
            console.log(`============  Exception : ${e.message} =======================`);
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }

        return responseBody;
    }

    async getSwCustomerId(customerInternalId, dbConnection) {
        let swCustomerId = 0;
        const getSwCustomerQuery = `SELECT customer_internal_id FROM sw_customers WHERE customer_internal_id = ${customerInternalId}`;

        try {
            const [rows] = await dbConnection.execute(getSwCustomerQuery);
            if (rows.length > 0) {
                swCustomerId = rows[0].customer_internal_id;
                console.log(`============ got swCustomer Id  : ${swCustomerId} ===============`);
            }
        } catch (e) {
            console.error(e);
        }

        return swCustomerId;
    }

    async updateRecordIntoCustomerSetting(attr, cwideInstance, jsonQueryString) {
        console.log("================  inside updateRecordIntoCustomerSetting ================");

        let responseBody = "Failed to update data";
        const query = `UPDATE company_settings SET attribute = ?, value = ?, customer_internal_id = ?, updated_at = ? WHERE company_setting_no = ? AND attribute = ? AND customer_internal_id = ?`;

        let dbConnection;
        try {
            dbConnection = await dbUtils.getConnection();
            const swCustomerId = await this.getSwCustomerId(parseInt(decodeURIComponent(cwideInstance.id_CustomerInternal)), dbConnection);
            if (swCustomerId === 0) {
                responseBody = `No such SW customer is present in records for id ${swCustomerId} >> Failed to update company setting in database`;
                return responseBody;
            }

            const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

            for (let cnt = 0; cnt < attr.length; cnt++) {
                try {
                    const temp = decodeURIComponent(jsonQueryString.cwide[cwideInstance.ID_Serial][attr[cnt]]);
                    await dbConnection.execute(query, [attr[cnt], temp, 
                        cwideInstance.id_CustomerInternal ? parseInt(decodeURIComponent(cwideInstance.id_CustomerInternal)) : null,
                        currentTime,
                        cwideInstance.ID_Serial ? parseInt(decodeURIComponent(cwideInstance.ID_Serial)) : null,
                        attr[cnt],
                        cwideInstance.id_CustomerInternal ? parseInt(decodeURIComponent(cwideInstance.id_CustomerInternal)) : null]);
                } catch (e) {
                    console.log(`==== No value for key : ${attr[cnt]} ==== ex: ${e.message}`);
                }
            }

            responseBody = "Records have been updated successfully.";
        } catch (e) {
            console.log(`============  Exception : ${e.message} =======================`);
            if (dbConnection) {
                await dbConnection.rollback();
            }
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }

        return responseBody;
    }

    async deleteRecordsFromCustomerSetting(attr, cwideInstance) {
        console.log("================  inside deleteRecordsFromCustomerSetting ================");
        let responseBody = "Failed to delete data";

        const query = `DELETE FROM company_settingsWHERE company_setting_no = ? AND customer_internal_id = ? AND attribute = ?`;

        let dbConnection;
        try {
            dbConnection = await dbUtils.getConnection();
            const swCustomerId = await this.getSwCustomerId(parseInt(decodeURIComponent(cwideInstance.id_CustomerInternal)), dbConnection);
            if (swCustomerId === 0) {
                responseBody = `No such SW customer is present in records for id ${swCustomerId} >> Failed to delete company setting in database`;
                return responseBody;
            }

            for (let cnt = 0; cnt < attr.length; cnt++) {
                await dbConnection.execute(query, [
                    cwideInstance.ID_Serial ? parseInt(decodeURIComponent(cwideInstance.ID_Serial)) : null,
                    cwideInstance.id_CustomerInternal ? parseInt(decodeURIComponent(cwideInstance.id_CustomerInternal)) : null,
                    attr[cnt]
                ]);
            }

            responseBody = "Records have been deleted successfully.";
        } catch (e) {
            console.log(`============  Exception : ${e.message} =======================`);
            if (dbConnection) {
                await dbConnection.rollback();
            }
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }

        return responseBody;
    }
}

exports.handler = async (event, context) => {
    const handler = new CwideHandler();
    return handler.handle(event, context);
};

module.exports.CwideHandler = CwideHandler;
