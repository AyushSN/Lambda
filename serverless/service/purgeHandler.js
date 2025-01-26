const dbUtils = require('../../utils/dbUtils');
const OrderDeleteService  = require('../../serverless/service/orderDeleteService');
const orderDeleteService = new OrderDeleteService();
const s3bucketUtils  = require('../../utils/s3bucketUtils'); 

class PurgeHandler{
    constructor(jsonQueryString) {
        this.jsonQueryString = jsonQueryString;
    }

    async handle(jsonQueryString) {
        return await this.processRequest(jsonQueryString);
    }

    async processRequest(jsonQueryString) {
        let dbConnection = null;
    let responseContent = "";

    // Getting current time
    const currentTime = new Date().toISOString().replace('T', ' ').slice(0, 19);

    try {
        // Getting list of Employee records from request query string
        dbConnection = await dbUtils.getConnection();

        const isDeleteType = jsonQueryString.hasOwnProperty('delete');

        if (isDeleteType) {
            const deleteType = jsonQueryString.delete.type;
            const deleteList = await this.getOrderDeleteList(jsonQueryString);

            switch (deleteType) {
                case 'order':
                    console.log('==== Deleting data for order ======');

                    for (const order of deleteList) {
                        console.log(`======== Deleting order for order no.: ${order.ID_Order} =======`);
                        const customerInternalId = order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null;
                        const orderNo = order.ID_Order ? parseInt(decodeURIComponent(order.ID_Order)) : null;

                        try {
                            responseContent += await orderDeleteService.deleteOrder(dbConnection, orderNo, customerInternalId);
                        } catch (e) {
                            console.log(`Failed to delete order for order no.: ${order.ID_Order}`);
                        }
                    }
                    break;

                case 'line-item':
                    console.log('==== Deleting data for line-item (products) ======');

                    for (const product of deleteList) {
                        console.log(`======== Deleting products for product no.: ${product.ID_LineOE} =======`);
                        const customerInternalId = product.id_CustomerInternal ? parseInt(decodeURIComponent(product.id_CustomerInternal)) : null;
                        const productNo = product.ID_LineOE ? parseInt(decodeURIComponent(product.ID_LineOE)) : null;

                        try {
                            responseContent += await orderDeleteService.deleteLinesOE(dbConnection, productNo, customerInternalId, null, DELETE_TYPE_PRODUCT);
                        } catch (e) {
                            console.log(`Failed to delete product for product no.: ${product.getID_LineOE()}`);
                        }
                    }
                    break;

                case 'tracking':
                    console.log('==== Deleting data for tracking ======');

                    for (const track of deleteList) {
                        console.log(`======== Deleting tracking for packet import id: ${track.getID_PackImport()} =======`);
                        const customerInternalId = track.getId_CustomerInternal() ? parseInt(decodeURIComponent(track.getId_CustomerInternal())) : null;
                        const packImportId = track.getID_PackImport() ? parseInt(decodeURIComponent(track.getID_PackImport())) : null;

                        try {
                            responseContent += await orderDeleteService.deletePackImport(dbConnection, packImportId, customerInternalId, null, DELETE_TYPE_PACKIMPORTID);
                        } catch (e) {
                            console.log(`Failed to delete for packet import id: ${track.getID_PackImport()}`);
                        }
                    }
                    break;

                case 'employee':
                    console.log('==== Deleting data for employee ======');

                    for (const emp of deleteList) {
                        try {
                            responseContent += await orderDeleteService.deleteEmp(dbConnection, emp);
                        } catch (e) {
                            console.log(`Failed to delete employee for employee_no: ${emp.getID_Employee()}`);
                        }
                    }
                    break;

                case 'customer':
                    console.log('==== Deleting data for customer ======');

                    for (const cust of deleteList) {
                        try {
                            responseContent += await orderDeleteService.deleteCust(dbConnection, cust);
                        } catch (e) {
                            console.log(`Failed to delete customer for customer_no: ${cust.getID_Customer()}`);
                        }
                    }
                    break;

                case 'shipping':
                    console.log('==== Deleting data for shipping ======');

                    for (const addr of deleteList) {
                        console.log(`======== Deleting shipping for address id: ${addr.getID_Address()} =======`);
                        const customerInternalId = addr.getId_CustomerInternal() ? parseInt(decodeURIComponent(addr.getId_CustomerInternal())) : null;
                        const addressId = addr.getID_Address() ? parseInt(decodeURIComponent(addr.getID_Address())) : null;

                        try {
                            responseContent += await orderDeleteService.deleteAddr(dbConnection, addressId, customerInternalId, null, DELETE_TYPE_SHIPPING);
                        } catch (e) {
                            console.log(`Failed to delete for shipping for address id: ${addr.getID_Address()}`);
                        }
                    }
                    break;

                case 'designs':
                    console.log('==== Deleting data for designs ======');

                    for (const des of deleteList) {
                        try {
                            responseContent += await orderDeleteService.deleteOrderDesLoc(dbConnection, des);
                        } catch (e) {
                            console.log(`Failed to delete designs for design_no: ${des.getID_OrderDesLoc()}`);
                        }
                    }
                    break;

                case 'payments':
                    console.log('==== Deleting data for payments ======');

                    for (const pay of deleteList) {
                        console.log(`======== Deleting payments for subpayment id: ${pay.getID_Subpayment()} =======`);
                        const customerInternalId = pay.getId_CustomerInternal() ? parseInt(decodeURIComponent(pay.getId_CustomerInternal())) : null;
                        const subpaymentId = pay.getID_Subpayment() ? parseInt(decodeURIComponent(pay.getID_Subpayment())) : null;

                        try {
                            responseContent += await orderDeleteService.deleteSubPay(dbConnection, subpaymentId, customerInternalId, null, DELETE_TYPE_PAYMENT);
                        } catch (e) {
                            console.log(`Failed to delete for payments for subpayment id: ${pay.getID_Subpayment()}`);
                        }
                    }
                    break;

                case 'thumbnail':
                    console.log('==== Deleting data for thumbnail ======');

                    for (const thumb of deleteList) {
                        try {
                            responseContent += await orderDeleteService.deleteThumb(dbConnection, thumb);
                        } catch (e) {
                            console.log(`Failed to delete thumbnail serial-id: ${thumb.getID_Serial()}`);
                        }
                    }
                    break;

                case 'order-type':
                    console.log('==== Deleting data for order-type ======');

                    for (const ordType of deleteList) {
                        try {
                            responseContent += await orderDeleteService.deleteOrdTyp(dbConnection, ordType);
                        } catch (e) {
                            console.log(`Failed to delete for order-type for order-type-no: ${ordType.getID_OrderType()}`);
                        }
                    }
                    break;

                case 'design-type':
                    console.log('==== Deleting data for design-type ======');

                    for (const desType of deleteList) {
                        try {
                            responseContent += await orderDeleteService.deleteDesTyp(dbConnection, desType);
                        } catch (e) {
                            console.log(`Failed to delete for design-type for design-type-no: ${desType.getID_DesignType()}`);
                        }
                    }
                    break;

                default:
                    console.log(`Delete type: ${deleteType} not recognized.`);
            }
        } else {
            const purgeList = await this.getPurgeList(jsonQueryString);

            for (const key of purgeList) {
                try {
                    responseContent = await this.deleteOperation(dbConnection, responseContent, key);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (dbConnection) {
            try {
                await dbConnection.close();
            } catch (e) {
                console.error(e);
            }
        }
    }

    console.log('===================== Final Result ==================');
    console.log(responseContent);
    console.log('===================== Finished ==================');
    return responseContent;
    }

    async getOrderDeleteList(json){
        const deleteList = [];
        const deleteType = json.delete.type;
        let jsonOrderId = null;
    
        switch (deleteType) {
            case "order":
                console.log("==== delete for order ======");
                jsonOrderId = json.order;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const order = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(order);
                        } catch (error) {
                            console.log("got exception while parsing json for order section", error.message);
                        }
                    }
                }
                break;
    
            case "line-item":
                console.log("==== delete for lineoe ======");
                jsonOrderId = json.lineoe;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const lineoe = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(lineoe);
                        } catch (error) {
                            console.log("got exception while parsing json for lineoe section", error.message);
                        }
                    }
                }
                break;
    
            case "tracking":
                console.log("==== delete for tracking ======");
                jsonOrderId = json.track;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const tracking = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(tracking);
                        } catch (error) {
                            console.log("got exception while parsing json for track section", error.message);
                        }
                    }
                }
                break;
    
            case "employee":
                console.log("==== delete for employee ======");
                jsonOrderId = json.emp;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const employee = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(employee);
                        } catch (error) {
                            console.log("got exception while parsing json for emp section", error.message);
                        }
                    }
                }
                break;
    
            case "customer":
                console.log("==== delete for customer ======");
                jsonOrderId = json.cust;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const customer = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(customer);
                        } catch (error) {
                            console.log("got exception while parsing json for cust section", error.message);
                        }
                    }
                }
                break;
    
            case "shipping":
                console.log("==== delete for shipping ======");
                jsonOrderId = json.addr;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const shipping = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(shipping);
                        } catch (error) {
                            console.log("got exception while parsing json for addr section", error.message);
                        }
                    }
                }
                break;
    
            case "designs":
                console.log("==== delete for designs ======");
                jsonOrderId = json.des;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const design = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(design);
                        } catch (error) {
                            console.log("got exception while parsing json for designs section", error.message);
                        }
                    }
                }
                break;
    
            case "payments":
                console.log("==== delete for payments ======");
                jsonOrderId = json.pay;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const payment = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(payment);
                        } catch (error) {
                            console.log("got exception while parsing json for pay section", error.message);
                        }
                    }
                }
                break;
    
            case "thumbnail":
                console.log("==== delete for thumbnail ======");
                jsonOrderId = json.thumb;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const thumbnail = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(thumbnail);
                        } catch (error) {
                            console.log("got exception while parsing json for thumbnail section", error.message);
                        }
                    }
                }
                break;
    
            case "order-type":
                console.log("==== delete for order-type ======");
                jsonOrderId = json.ordtyp;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const orderType = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(orderType);
                        } catch (error) {
                            console.log("got exception while parsing json for order-type section", error.message);
                        }
                    }
                }
                break;
    
            case "design-type":
                console.log("==== delete for design-type ======");
                jsonOrderId = json.destyp;
    
                for (let key in jsonOrderId) {
                    if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                        try {
                            const designType = JSON.parse(JSON.stringify(jsonOrderId[key]));
                            deleteList.push(designType);
                        } catch (error) {
                            console.log("got exception while parsing json for design-type section", error.message);
                        }
                    }
                }
                break;
        }
    
        return deleteList;
    }

    async getPurgeList(json) {
        const purgeList = [];
        const jsonOrderId = json.customer;
    
        for (const key in jsonOrderId) {
            if (jsonOrderId.hasOwnProperty(key) && key.trim() !== '') {
                purgeList.push(parseInt(key, 10));
            }
        }
    
        return purgeList;
    }
    
    async selectQueryForOrderTypesTable(key, query, fieldName, dbConnection) {
        const resultList = [];
    
        try {
            const [rows] = await dbConnection.execute(query, [key]);
    
            rows.forEach(row => {
                if (query.includes('name')) {
                    resultList.push(row[fieldName] + row['name']);
                } else {
                    resultList.push(row[fieldName]);
                }
            });
    
        } catch (error) {
            console.error(`=== got exception while fetching image path from order_types : ${key} ==>> ${error.message}`);
        }
    
        return resultList;
    }

    async selectQueryForDesignImageTable(key, query, id_of, dbConnection) {
        const resultList = [];
    
        try {
            const [rows] = await dbConnection.execute(query, [key]);
    
            rows.forEach(row => {
                resultList.push(row[id_of]);
            });
    
        } catch (error) {
            console.error(`=== got exception while fetching data for internal id : ${key} ==>> ${error.message}`);
        }
    
        return resultList;
    }

    async selectQueryForTable(key, query, id_of, dbConnection) {
        const resultList = [];
    
        try {
            const preparedStatement = await dbConnection.prepare(query);
            if (!query.includes('products')) {
                preparedStatement.bind([key]);
            }
    
            const [rows] = await preparedStatement.execute();
    
            rows.forEach(row => {
                resultList.push(row[id_of]);
            });
    
        } catch (error) {
            console.error(`=== got exception while fetching data for internal id : ${key} ==>> ${error.message}`);
        } finally {
            if (preparedStatement) {
                await preparedStatement.close();
            }
        }
    
        return resultList;
    }

    async deleteQueryExecutor(query, tableName, key, dbConnection) {
        console.log("================  inside deleteQueryExecutor ================");
        let responseBody = "";
    
        try {
            const start = Date.now();
    
            const preparedStmt = await dbConnection.prepare(query);
            if (key !== null) {
                preparedStmt.bind([key]);
            }
            await preparedStmt.addBatch();
    
            // execute delete SQL statement
            const result = await preparedStmt.executeBatch();
            console.log(`=============== Records have been deleted from ${tableName} table! ==================`);
            console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
            responseBody = `\nRecords have been deleted successfully from ${tableName} table! `;
    
        } catch (error) {
            responseBody = `\nFailed to delete data in ${tableName} : ${error.message}`;
            console.error(`============  Exception : ${error.message} =======================`);
    
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
        return responseBody;
    }

    async deleteOperation(dbConnection, responseContent, key) {
        let imgFiles = [];
    
        const designImageSelectQuery = "SELECT path, name FROM design_image WHERE customer_internal_id = ?";
        const orderTypesSelectQuery = "SELECT image_path FROM order_types WHERE customer_internal_id = ?";
    
        imgFiles = await this.selectQueryForOrderTypesTable(key, orderTypesSelectQuery, 'image_path', dbConnection);
        imgFiles = imgFiles.concat(await this.selectQueryForOrderTypesTable(key, designImageSelectQuery, 'path', dbConnection));
    
        console.log("image_files  : ", imgFiles, "\n", imgFiles.length);
    
        const deleteQueries = [
            { query: "DELETE FROM c_customers WHERE customer_internal_id = ?", table: "c_customers" },
            { query: "DELETE FROM c_customer_permission WHERE customer_internal_id = ?", table: "c_customer_permission" },
            { query: "DELETE FROM users WHERE role_id in (3,4) AND internal_id = ?", table: "users" },
            { query: "DELETE FROM employees WHERE customer_internal_id = ?", table: "employees" },
            { query: "DELETE FROM employee_permission WHERE customer_internal_id = ?", table: "employee_permission" },
            { query: "DELETE FROM company_settings WHERE customer_internal_id = ?", table: "company_settings" },
            { query: "DELETE FROM design_image WHERE customer_internal_id = ?", table: "design_image" },
            { query: "DELETE FROM design_types WHERE customer_internal_id = ?", table: "design_types" },
            { query: "DELETE FROM system_settings WHERE customer_internal_id = ?", table: "system_settings" },
            { query: "DELETE FROM order_types WHERE customer_internal_id = ?", table: "order_types" },
            { query: "DELETE FROM order_shipping WHERE customer_internal_id = ?", table: "order_shipping" },
            { query: "DELETE FROM order_contact WHERE customer_internal_id = ?", table: "order_contact" },
            { query: "DELETE FROM designs WHERE customer_internal_id = ?", table: "designs" },
            { query: "DELETE FROM order_tracking WHERE customer_internal_id = ?", table: "order_tracking" },
            { query: "DELETE FROM payments WHERE customer_internal_id = ?", table: "payments" },
            { query: "DELETE FROM products WHERE customer_internal_id = ?", table: "products" },
            { query: "DELETE FROM order_attribute WHERE customer_internal_id = ?", table: "order_attribute" },
            { query: "DELETE FROM order_status_setting WHERE customer_internal_id = ?", table: "order_status_setting" },
            { query: "DELETE FROM product_attribute WHERE customer_internal_id = ?", table: "product_attribute" },
            { query: "DELETE FROM orders WHERE customer_internal_id = ?", table: "orders" }
        ];
    
        // Performing delete queries
        for (const { query, table } of deleteQueries) {
            responseContent += await this.deleteQueryExecutor(query, table, key, dbConnection);
        }
    
        // Deleting images from S3 bucket
        for (const imageKey of imgFiles) {
            await s3bucketUtils.deleteFile(imageKey)
        }
    
        return responseContent;
    }
}

exports.handler = async (event, context) => {
    const handler = new PurgeHandler();
    return handler.handle(event, context);
};

module.exports = PurgeHandler;