const dbUtils = require('../../utils/dbUtils');
const { ACTIONS } = require('../../authHandler');
const S3bucketUtils = require('../../utils/s3bucketUtils');
const AuthHandler = require('../../authHandler');
const hashKey = "3zH14aB_9xF5za4";

class OrderTypeHandler {
    constructor(jsonQueryString) {
        this.jsonQueryString = jsonQueryString;
    }

    async handle(jsonQueryString) {
        return await this.processRequest(jsonQueryString);
    }

    async processRequest(jsonQueryString) {
        console.log("===================== inside processRequest ==================");
        let responseContent = "";

        const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const orderTypeList = await this.getOrderTypeList(jsonQueryString);
        let dbConnection = null;

        try {
            console.log("===================== inside try block ==================");
            dbConnection = await dbUtils.getConnection();
            for (const order of orderTypeList) {
                console.log("===================== inside for loop ==================");
                if (order.action) {
                    if (order.action === ACTIONS.ADD) {
                        try {
                            console.log("===================== inside add ==================");
                            responseContent += await this.insertQueryForOrderType(order, currentTime, dbConnection);
                        } catch (error) {
                            console.error(error);
                        }
                    } else if (order.action === ACTIONS.UPDATE) {
                        try {
                            responseContent += await this.updateQueryForOrderType(order, currentTime, dbConnection);
                        } catch (error) {
                            console.error(error);
                        }
                    } else if (order.action === ACTIONS.DELETE) {
                        try {
                            responseContent += await this.deleteQueryForOrderType(order, dbConnection);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            }
        } finally {
            if (dbConnection) {
                try {
                    await dbConnection.close();
                } catch (error) {
                    console.error(error);
                }
            }
        }

        console.log("===================== Final Result ==================");
        console.log(responseContent);
        console.log("===================== Finished ==================");
        return responseContent;
    }

    async getOrderTypeList(json) {
        const ordtypeList = [];
        const jsonOrderId = json.ordtyp;

        for (const key in jsonOrderId) {
            if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                try {
                    const ordtype = JSON.parse(JSON.stringify(jsonOrderId[key]));
                    ordtypeList.push(ordtype);
                } catch (error) {
                    console.log("Got exception while parsing JSON for order des section: " + error.message);
                }
            }
        }

        return ordtypeList;
    }

    async insertQueryForOrderType(order, currentTime, dbConnection) {
        console.log("================  inside insertQueryForOrderType ================");
        let responseBody = "Failed to insert data";

        const path = await this.uploadAndGetS3FilePath(order);

        const query = `
            INSERT INTO order_types (order_type_no, type, image_path, customer_internal_id, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, 1, ?, ?)
        `;

        try {
            const start = Date.now();
            if (path) {
                const [result] = await dbConnection.execute(query, [
                    order.ID_OrderType ? parseFloat(decodeURIComponent(order.ID_OrderType)) : null,
                    decodeURIComponent(order.OrderType),
                    path,
                    order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null,
                    currentTime,
                    currentTime
                ]);

                console.log("=============== Records are inserted into order_types table! ==================");
                console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
                responseBody = "\nRecords have been inserted successfully to order_types.";

            } else {
                responseBody = `\nSkipped record. Failed to upload image on S3 bucket for order type id: ${order.ID_OrderType}`;
            }
        } catch (error) {
            responseBody = `\nFailed to save data in order_types: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        }

        return responseBody;
    }

    async uploadAndGetS3FilePath(order) {
        const fileName = `${decodeURIComponent(order.FileName)}.${decodeURIComponent(order.FileExtension)}`;
        const hash1 = AuthHandler.hmacSha1(`_${decodeURIComponent(order.id_CustomerInternal)}`, hashKey);
        const reversehash1 = hash1.split('').reverse().join('');
        const hash2 = AuthHandler.hmacSha1(`this is a test${decodeURIComponent(order.id_CustomerInternal)}`, hashKey);
        const reversehash2 = hash2.split('').reverse().join('');
        const folder2 = reversehash1.substring(0, 20);
        const folder3 = reversehash2.substring(0, 20);
        const folderlocation = `${folder2}/${folder3}/order_types/`;
        const fileKeyLocation = `${folderlocation}${fileName}`;
        const path = `${dbUtils.BUCKETURL}${dbUtils.S3BUCKET_NAME}/${fileKeyLocation}`;
        
        // Decode and validate the base64 string
        const thumbBase64 = decodeURIComponent(order.ThumbBase64);
        if (!thumbBase64 || typeof thumbBase64 !== 'string') {
            console.error('Invalid or undefined thumbBase64 string');
            return null;
        }

        try {
            console.log(`Attempting to upload file to S3. File location: ${fileKeyLocation}`);
            const isFileUploaded = await S3bucketUtils.uploadFile(fileKeyLocation, thumbBase64);
            if (isFileUploaded) {
                console.log(`File successfully uploaded to S3. File path: ${path}`);
                return path;
            } else {
                console.log(`File upload failed for location: ${fileKeyLocation}`);
                return null;
            }
        } catch (error) {
            console.error(`Error occurred while uploading file to S3. Error: ${error.message}`);
            return null;
        }
    }

    async updateQueryForOrderType(order, currentTime, dbConnection) {
        console.log("================  inside updateQueryForOrderType ================");
        let responseBody = "Failed to update data";

        const path = await this.uploadAndGetS3FilePath(order);

        const query = `
            UPDATE order_types 
            SET order_type_no = ?, type = ?, image_path = ?, customer_internal_id = ?, updated_at = ? 
            WHERE order_type_no = ? AND customer_internal_id = ?
        `;

        try {
            const start = Date.now();
            if (path) {
                const [result] = await dbConnection.execute(query, [
                    order.ID_OrderType ? parseFloat(decodeURIComponent(order.ID_OrderType)) : null,
                    decodeURIComponent(order.OrderType),
                    path,
                    order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null,
                    currentTime,
                    order.ID_OrderType ? parseFloat(decodeURIComponent(order.ID_OrderType)) : null,
                    order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null
                ]);

                console.log("=============== Records have been updated in order_types table! ==================");
                console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
                responseBody = "Records have been updated successfully in order_types.";
            } else {
                responseBody = `\nSkipped record. Failed to upload image on S3 bucket for order type id: ${order.ID_OrderType}`;
            }
        } catch (error) {
            responseBody = `\nFailed to save data in order_types: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        }

        return responseBody;
    }

    async deleteQueryForOrderType(order, dbConnection) {
        console.log("================  inside deleteQueryForOrderType ================");
        let responseBody = "Failed to delete data";

        const imageKey = await this.selectQueryForOrderTypesTable(order, dbConnection);

        const query = `
            DELETE FROM order_types 
            WHERE customer_internal_id = ? AND order_type_no = ?
        `;

        try {
            const start = Date.now();

            const [result] = await dbConnection.execute(query, [
                order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null,
                order.ID_OrderType ? parseFloat(decodeURIComponent(order.ID_OrderType)) : null
            ]);

            console.log("=============== Records have been deleted from order_types table! ==================");
            console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
            responseBody = "Records have been deleted successfully from order_types.";

            for (const key of imageKey) {
                await S3bucketUtils.deleteFile(key);
            }
        } catch (error) {
            responseBody = `\nFailed to delete data in order_types: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        }

        return responseBody;
    }

    async selectQueryForOrderTypesTable(order, dbConnection) {
        const resultList = [];

        const query = `
            SELECT image_path 
            FROM order_types 
            WHERE customer_internal_id = ? AND order_type_no = ?
        `;

        try {
            const [rows] = await dbConnection.execute(query, [
                order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null,
                order.ID_OrderType ? parseFloat(decodeURIComponent(order.ID_OrderType)) : null
            ]);

            for (const row of rows) {
                resultList.push(row.image_path);
            }
        } catch (error) {
            console.log(`=== Got exception while fetching image path from order_types: ${order.id_CustomerInternal} ==>> ${error.message}`);
        }

        return resultList;
    }
}

exports.handler = async (event, context) => {
    const handler = new OrderTypeHandler();
    return handler.handle(event, context);
};

module.exports.OrderTypeHandler = OrderTypeHandler;
