const dbUtils = require('../../utils/dbUtils');
const logger = require('../../winston');
const AuthHandler = require('../../authHandler');
const Attributes = require('../models/attributes');

class OrdStatSetHandler {
    constructor(jsonQueryString) {
        this.jsonQueryString = jsonQueryString;
    }

    async handle(jsonQueryString) {
        return await this.processRequest(jsonQueryString);
    }

    async processRequest(jsonQueryString) {
        let dbConnection = null;
        let responseContent = "";

        // getting current time
        const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

        // getting list of OrdStatSet records from request query string
        const ordStatSetList = await this.getOrdStatSetList(jsonQueryString);
        dbConnection = await dbUtils.getConnection();

        try {
            for (const ordStatSet of ordStatSetList) {
                if (ordStatSet.action) {
                    if (ordStatSet.action === AuthHandler.ACTIONS.ADD) {
                        try {
                            responseContent += await insertQueryForOrderStatusSetting(ordStatSet, currentTime, dbConnection, jsonQueryString);
                        } catch (error) {
                            console.error("Failed to process insert request. Exception: ", error.message);
                        }
                    } else if (ordStatSet.action === AuthHandler.ACTIONS.UPDATE) {
                        try {
                            responseContent += await updateQueryForOrderStatusSetting(ordStatSet, currentTime, dbConnection, jsonQueryString);
                        } catch (error) {
                            console.error("Failed to process update request. Exception: ", error.message);
                        }
                    } else if (ordStatSet.action === AuthHandler.ACTIONS.DELETE) {
                        try {
                            responseContent += await deleteQueryForOrderStatusSetting(ordStatSet, dbConnection);
                        } catch (error) {
                            console.error("Failed to process delete request. Exception: ", error.message);
                            console.error(error.stack);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Exception: ", error);
            console.error(error.stack)
        } finally {
            if (dbConnection) {
                try {
                    await dbConnection.close();
                } catch (error) {
                    console.error("Failed to close connection. Exception: ", error);
                    console.error(error.stack)
                }
            }
        }

        console.log("===================== Final Result ==================");
        console.log(responseContent);
        console.log("===================== Finished ==================");
        return responseContent;
    }

    async getOrdStatSetList(json) {
        const ordStatSetList = [];
        const jsonOrderId = json.ordstatset;
    
        for (const key in jsonOrderId) {
            if (key) {
                try {
                    const ordStatSet = JSON.parse(JSON.stringify(jsonOrderId[key]));
                    ordStatSetList.push(ordStatSet);
                } catch (error) {
                    logger.debug("Got exception while parsing JSON for customer section: " + error.message);
                }
            }
        }
    
        logger.debug("OrdStatSet List: ", ordStatSetList);
        return ordStatSetList;
    }

    async insertQueryForOrderStatusSetting(ordStatSet, currentTime, dbConnection, jsonQueryString) {
        console.log("==========  inside insertQueryForOrderStatusSetting ==========");
        let responseBody = "";
        let userId = null;
    
        const query = `INSERT INTO order_status_setting (attribute, value, order_status_setup_no, order_status_no, customer_internal_id, created_at, updated_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`;
    
        try {
            const start = Date.now();
            const ordStatSetAttr = Attributes.orderStatusAttr;
    
            for (let cnt = 0; cnt < ordStatSetAttr.length; cnt++) {
                let temp = null;
                try {
                    temp = decodeURIComponent(jsonQueryString.ordstatset[decodeURIComponent(ordStatSet.ID_OrderStatusSetup)][ordStatSetAttr[cnt]]);
                    await dbConnection.execute(query, [
                        ordStatSetAttr[cnt],
                        temp.substring(0, Math.min(temp.length, 20)),
                        decodeURIComponent(ordStatSet.ID_OrderStatusSetup),
                        ordStatSet.ID_Serial ? parseInt(decodeURIComponent(ordStatSet.ID_Serial)) : null,
                        ordStatSet.Id_CustomerInternal ? parseInt(decodeURIComponent(ordStatSet.Id_CustomerInternal)) : null,
                        currentTime,
                        currentTime
                    ]);
                } catch (error) {
                    console.log("==== No value for key: " + ordStatSetAttr[cnt] + " ==== ex: " + error.message);
                }
            }
    
            await dbConnection.commit();
    
            console.log("=============== Records are inserted into order_status_setting table! ==================");
            console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
            responseBody = `\nRecords have been inserted successfully to order_status_setting for Serial Id no: ${ordStatSet.ID_Serial}`;
        } catch (error) {
            await dbConnection.rollback();
            responseBody = `\nFailed to save data in order_status_setting: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        }
    
        return responseBody;
    }

    async updateQueryForOrderStatusSetting(ordStatSet, currentTime, dbConnection, jsonQueryString) {
        console.log("==========  inside updateQueryForOrderStatusSetting ==========");
        let responseBody = "";
        let preparedStmt = null;
    
        const query = `UPDATE order_status_setting SET attribute = ?, value = ?, customer_internal_id = ?, order_status_setup_no = ?
                       WHERE order_status_no = ? AND order_status_setup_no = ? AND attribute = ? AND customer_internal_id = ?`;
    
        try {
            const start = Date.now();
            const ordStatSetAttr = Attributes.orderStatusAttr;
            preparedStmt = await dbConnection.query(query);
    
            for (let cnt = 0; cnt < ordStatSetAttr.length; cnt++) {
                let temp = null;
                try {
                    temp = decodeURIComponent(jsonQueryString.ordstatset[decodeURIComponent(ordStatSet.ID_OrderStatusSetup)][ordStatSetAttr[cnt]]);
    
                    await preparedStmt.bind([
                        ordStatSetAttr[cnt],
                        temp.substring(0, Math.min(temp.length, 20)),
                        ordStatSet.Id_CustomerInternal ? parseInt(decodeURIComponent(ordStatSet.Id_CustomerInternal)) : null,
                        decodeURIComponent(ordStatSet.ID_OrderStatusSetup),
                        ordStatSet.ID_Serial ? parseInt(decodeURIComponent(ordStatSet.ID_Serial)) : null,
                        decodeURIComponent(ordStatSet.ID_OrderStatusSetup),
                        ordStatSetAttr[cnt],
                        ordStatSet.Id_CustomerInternal ? parseInt(decodeURIComponent(ordStatSet.Id_CustomerInternal)) : null
                    ]);
    
                    await preparedStmt.addBatch();
                } catch (error) {
                    console.log("==== No value for key: " + ordStatSetAttr[cnt] + " ==== ex: " + error.message);
                }
            }
    
            // execute updated SQL statement
            const result = await preparedStmt.executeBatch();
            console.log("=============== Records are updated into order_status_setting table! ==================");
            console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
            responseBody += `\nRecords have been updated successfully to order_status_setting for Serial Id no: ${ordStatSet.ID_Serial}`;
        } catch (error) {
            responseBody = `\nFailed to save data in order_status_setting: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }
    
    async deleteQueryForOrderStatusSetting(ordStatSet, dbConnection) {
        console.log("==========  inside deleteQueryForOrderStatusSetting ==========");
        let responseBody = "";
        let preparedStmt = null;
    
        const query = `DELETE FROM order_status_setting WHERE customer_internal_id = ? AND order_status_no = ? AND attribute = ?`;
    
        try {
            const start = Date.now();
            const ordStatSetAttr = Attributes.orderStatusAttr;
    
            await dbConnection.beginTransaction();
    
            for (let cnt = 0; cnt < ordStatSetAttr.length; cnt++) {
                await dbConnection.execute(query, [
                    ordStatSet.Id_CustomerInternal ? parseInt(decodeURIComponent(ordStatSet.Id_CustomerInternal)) : null,
                    ordStatSet.ID_Serial ? parseInt(decodeURIComponent(ordStatSet.ID_Serial)) : null,
                    ordStatSetAttr[cnt]
                ]);
            }
    
            await dbConnection.commit();
    
            console.log("=============== Records deleted from order_status_setting table! ==================");
            console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
    
            responseBody += `\nRecords have been deleted successfully from order_status_setting for Serial Id no: ${ordStatSet.ID_Serial}`;
        } catch (error) {
            await dbConnection.rollback();
            responseBody = `\nFailed to delete data from order_status_setting table: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        }
    
        return responseBody;
    }
    
}

exports.handler = async (event, context) => {
    const handler = new OrdStatSetHandler();
    return handler.handle(event, context);
};

module.exports.OrdStatSetHandler = OrdStatSetHandler;