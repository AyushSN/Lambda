const { format } = require('date-fns');
const { parse } = require('json2csv');
const { designType } = require('../models/designTyp');
const  dbUtils  = require('../../utils/dbUtils');
const { ACTIONS } = require('../../authHandler');

class DesignTypeHandler{
    constructor(jsonQueryString) {
        this.jsonQueryString = jsonQueryString;
    }

    async handle(jsonQueryString) {
        return await this.processRequest(jsonQueryString);
    }

    async processRequest(jsonQueryString) {
        let dbConnection;
        let responseContent = "";

        const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const destypList = jsonQueryString;
        // const destypList = await this.getDesignTypeList(jsonQueryString);
        dbConnection = await dbUtils.getConnection();
        // console.log("==========  destypList ==========", destypList);
        try {
            for (const [key, destyp] of Object.entries(destypList.destyp)) {
                if (destyp.action) {
                    if (destyp.action === 'add') {
                        try {
                            console.log("==========  inside insertQueryForDesignType insert  ==========");
                            // responseContent += await this.insertQueryForDesignType(destyp, currentTime, dbConnection);
                        } catch (e) {
                            console.error(`Failed to process insert request. Exception: ${e.message}`);
                        }
                    } else if (destyp.action === 'UPDATE') {
                        try {
                            console.log("==========  inside insertQueryForDesignType update  ==========");
                            // responseContent += await this.updateQueryForDesignType(destyp, currentTime, dbConnection);
                        } catch (e) {
                            console.error(`Failed to process update request. Exception: ${e.message}`);
                        }
                    } else if (destyp.action === 'DELETE') {
                        try {
                            console.log("==========  inside insertQueryForDesignType delete  ==========");
                            // responseContent += await this.deleteQueryForDesignType(destyp, currentTime, dbConnection);
                        } catch (e) {
                            console.error(`Failed to process delete request. Exception: ${e.message}`);
                        }
                    }
                }
            }
        } catch (e) {
            console.error(`Error: ${e.message}`);
        } finally {
            if (dbConnection) {
                await dbConnection.end();
            }
        }

        console.log("===================== Final Result ==================");
        console.log(responseContent);
        console.log("===================== Finished ==================");
        return responseContent;
    }

    async insertQueryForDesignType(destyp, currentTime, dbConnection) {
        console.log("==========  inside insertQueryForDesignType ==========");
        let responseBody = "";

        const query = `INSERT INTO design_types (design_type_no, type, customer_internal_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;

        try {
            const [result] = await dbConnection.execute(query, [
                destyp.ID_DesignType ? parseInt(destyp.ID_DesignType) : null,
                destyp.DesignType,
                destyp.Id_CustomerInternal ? parseInt(destyp.Id_CustomerInternal) : null,
                currentTime,
                currentTime
            ]);

            console.log("=============== Records are inserted into design_types table! ==================");
            responseBody += `\nRecords have been inserted successfully to design_types for design type id: ${destyp.ID_DesignType}`;
        } catch (e) {
            responseBody = `\nFailed to save data in design_types: ${e.message}`;
            console.error(`============  Exception: ${e.message} =======================`);
        }

        return responseBody;
    }

    async updateQueryForDesignType(destyp, currentTime, dbConnection) {
        console.log("==========  inside updateQueryForDesignType ==========");
        let responseBody = "";

        const query = `UPDATE design_types SET design_type_no = ?, type = ?, customer_internal_id = ?, updated_at = ? WHERE design_type_no = ? AND customer_internal_id = ?`;

        try {
            const [result] = await dbConnection.execute(query, [
                destyp.ID_DesignType ? parseInt(destyp.ID_DesignType) : null,
                destyp.DesignType,
                destyp.Id_CustomerInternal ? parseInt(destyp.Id_CustomerInternal) : null,
                currentTime,
                destyp.ID_DesignType ? parseInt(destyp.ID_DesignType) : null,
                destyp.Id_CustomerInternal ? parseInt(destyp.Id_CustomerInternal) : null
            ]);

            console.log("=============== Records updated in design_types table! ==================");
            responseBody += `\nRecords have been updated successfully in design_types for design type id: ${destyp.ID_DesignType}`;
        } catch (e) {
            responseBody = `\nFailed to update data in design_types: ${e.message}`;
            console.error(`============  Exception: ${e.message} =======================`);
        }

        return responseBody;
    }

    async deleteQueryForDesignType(destyp, currentTime, dbConnection) {
        console.log("==========  inside deleteQueryForDesignType ==========");
        let responseBody = "";

        const query = `DELETE FROM design_types WHERE customer_internal_id = ? AND design_type_no = ?`;

        try {
            const [result] = await dbConnection.execute(query, [
                destyp.Id_CustomerInternal ? parseInt(destyp.Id_CustomerInternal) : null,
                destyp.ID_DesignType ? parseInt(destyp.ID_DesignType) : null
            ]);

            console.log("=============== Records deleted from design_types table! ==================");
            responseBody += `\nRecords have been deleted successfully from design_types for design type id: ${destyp.ID_DesignType}`;
        } catch (e) {
            responseBody = `\nFailed to delete data in design_types: ${e.message}`;
            console.error(`============  Exception: ${e.message} =======================`);
        }

        return responseBody;
    }
}

exports.handler = async (event, context) => {
    const handler = new DesignTypeHandler();
    return handler.handle(event, context);
};

module.exports.DesignTypeHandler = DesignTypeHandler;