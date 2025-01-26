const logger = require('../../utils/logger');
const  dbUtils  = require('../../utils/dbUtils');
const { ACTIONS } = require('../../authHandler');

class SysLabelsHandler{

    constructor(jsonQueryString){
        this.jsonQueryString = jsonQueryString
    }

    async handle(jsonQueryString){
        return await this.processRequest(jsonQueryString);
    }

    async processRequest(jsonQueryString) {
        let dbConnection = null;
        let responseContent = "";
    
        // getting current time
        const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
        // getting list of SysLabels records from request query string
        const labelsList = await this.getLabelsList(jsonQueryString);
        // dbConnection = await dbUtils.getConnection();
    
        try {
            for (const label of labelsList) {
                if (label.action) {
                    if (label.action === ACTIONS.ADD) {
                        try {
                            responseContent += await this.insertQueryForSystemSettings(label, currentTime, dbConnection);
                        } catch (error) {
                            console.error("Failed to process insert request. Exception: ", error.message);
                        }
                    } else if (label.action === ACTIONS.UPDATE) {
                        try {
                            responseContent += await this.updateQueryForSystemSettings(label, currentTime, dbConnection);
                        } catch (error) {
                            console.error("Failed to process update request. Exception: ", error.message);
                        }
                    } else if (label.action === ACTIONS.DELETE) {
                        try {
                            responseContent += await this.deleteQueryForSystemSettings(label, dbConnection);
                        } catch (error) {
                            console.error("Failed to process delete request. Exception: ", error.message);
                            console.error(error.stack)
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

    async getLabelsList(json) {
        const labelsList = [];
        const jsonOrderId = json.syslabels;
    
        for (const key in jsonOrderId) {
            if (jsonOrderId.hasOwnProperty(key) && key) {
                try {
                    const label = JSON.parse(JSON.stringify(jsonOrderId[key]));
                    labelsList.push(label);
                } catch (error) {
                    logger.debug("Got exception while parsing JSON for customer section: " + error.message);
                }
            }
        }
        logger.debug("Label List: ", labelsList);
        return labelsList;
    }
    
    async insertQueryForSystemSettings(labels, currentTime, dbConnection) {
        console.log("==========  inside insertQueryForSystemSettings ==========");
        let responseBody = "";
        let preparedStmt = null;
        let userId = null;
    
        const query = `INSERT INTO system_settings (system_setting_no, description, number, color, color_range, customer_internal_id, created_at, updated_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
        try {
            const start = Date.now();
            preparedStmt = await dbConnection.prepare(query);
    
            await preparedStmt.bind([
                labels.ID_SysLabel ? parseInt(Util.decodeURIComponent(labels.ID_SysLabel)) : null,
                Util.decodeURIComponent(labels.Label_HeaderProductDescription),
                Util.decodeURIComponent(labels.Label_HeaderProductNumber),
                Util.decodeURIComponent(labels.Label_ProductColor),
                Util.decodeURIComponent(labels.Label_ProductColorRange),
                labels.Id_CustomerInternal ? parseInt(Util.decodeURIComponent(labels.Id_CustomerInternal)) : null,
                currentTime,
                currentTime
            ]);
    
            const result = await preparedStmt.execute();
    
            // getting userId of created record
            const generatedKeys = await preparedStmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                userId = generatedKeys.getInt(1);
            }
            if (generatedKeys) {
                await generatedKeys.close();
            }
    
            console.log("=============== Records are inserted into system_settings table! ==================");
            console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
            responseBody = `\nRecords have been inserted successfully to system_settings for system setting no: ${labels.ID_SysLabel}`;
        } catch (error) {
            responseBody = `\nFailed to save data in system settings: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }
    
    async updateQueryForSystemSettings(labels, currentTime, dbConnection) {
        console.log("==========  inside updateQuerySystemSettings ==========");
        let responseBody = "";
        let preparedStmt = null;
    
        const query = `UPDATE system_settings SET system_setting_no = ?, description = ?, number = ?, color = ?, color_range = ?, customer_internal_id = ?, updated_at = ?
                       WHERE system_setting_no = ? AND customer_internal_id = ?`;
    
        try {
            const start = Date.now();
            preparedStmt = await dbConnection.prepare(query);
    
            await preparedStmt.bind([
                labels.ID_SysLabel ? parseInt(Util.decodeURIComponent(labels.ID_SysLabel)) : null,
                Util.decodeURIComponent(labels.Label_HeaderProductDescription),
                Util.decodeURIComponent(labels.Label_HeaderProductNumber),
                Util.decodeURIComponent(labels.Label_ProductColor),
                Util.decodeURIComponent(labels.Label_ProductColorRange),
                labels.Id_CustomerInternal ? parseInt(Util.decodeURIComponent(labels.Id_CustomerInternal)) : null,
                currentTime,
                labels.ID_SysLabel ? parseInt(Util.decodeURIComponent(labels.ID_SysLabel)) : null,
                labels.Id_CustomerInternal ? parseInt(Util.decodeURIComponent(labels.Id_CustomerInternal)) : null
            ]);
    
            const result = await preparedStmt.execute();
    
            console.log("=============== Records are updated into system_settings table! ==================");
            console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
            responseBody += `\nRecords have been updated successfully to system_settings for system setting no: ${labels.ID_SysLabel}`;
        } catch (error) {
            responseBody = `\nFailed to save data in system settings: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }
    
    async deleteQueryForSystemSettings(labels, dbConnection) {
        console.log("==========  inside deleteQueryForSystemSettings ==========");
        let responseBody = "";
        let preparedStmt = null;
    
        const query = `DELETE FROM system_settings WHERE customer_internal_id = ? AND system_setting_no = ?`;
    
        try {
            const start = Date.now();
            preparedStmt = await dbConnection.prepare(query);
    
            await preparedStmt.bind([
                labels.Id_CustomerInternal ? parseInt(Util.decodeURIComponent(labels.Id_CustomerInternal)) : null,
                labels.ID_SysLabel ? parseInt(Util.decodeURIComponent(labels.ID_SysLabel)) : null
            ]);
    
            const result = await preparedStmt.execute();
    
            console.log("=============== Records deleted from system_settings table! ==================");
            console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
    
            responseBody += `\nRecords have been deleted successfully from system_settings for system setting no: ${labels.ID_SysLabel}`;
        } catch (error) {
            responseBody = `\nFailed to delete data from system_settings table: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }
    
}

exports.handler = async (event, context) => {
    const handler = new SysLabelsHandler();
    return handler.handle(event, context);
};

module.exports.SysLabelsHandler = SysLabelsHandler;