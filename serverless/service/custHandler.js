const { format } = require('date-fns');
const DBUtils = require('../../utils/dbUtils');
const util = require('util');
const responseFromOtherSource = require('../../serverless/service/responseFromOtherSourcehandler');
const ResponseFromOtherSourcehandler = new responseFromOtherSource();
const { ACTIONS } = require('../../authHandler');
const Customer = require('../../serverless/models/cust');
const mysql2 = require('mysql2/promise');

class CustHandler{

    constructor(jsonQueryString){
        this.jsonQueryString = jsonQueryString;
        this.POST_URL = "https://manageorders.com/get_crypt_password";
        this.ROLE_CC = 3;
    }

    async handle(jsonQueryString) {
        return await this.processRequest(jsonQueryString);
    }

    async processRequest(jsonQueryString) {
        console.log("===================== inside processRequest ==================");
        let dbConnection = null;
        let responseContent = "";
    
        // getting current time
        
        const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    
        // getting list of customer records from request query string
        const customerList = await this.getCustomerList(jsonQueryString);
        dbConnection = await DBUtils.getConnection();
    
        try {
            console.log("=============== inside try block ===============");
            for (const cust of customerList) {
                const POST_PARAMS = `password=${decodeURIComponent(cust.getOrdersLinkPassword())}`;
                const cryptPassword = await ResponseFromOtherSourcehandler.sendPOST(this.POST_URL, POST_PARAMS);
    
                if (cryptPassword) {
                    if (cust.getAction()) {
                        if (cust.getAction() === ACTIONS.ADD) {
                            try {
                                console.log("=============== inside ADD block ===============");
                                responseContent += await this.insertQueryForUsers(cust, currentTime, cryptPassword, dbConnection);
                            } catch (e) {
                                console.log(`Failed to process insert request. Exception: ${e.message}`);
                            }
                        } else if (cust.getAction() === ACTIONS.UPDATE) {
                            try {
                                const userId = await this.selectQueryForUsersTable(cust, dbConnection);
                                const customerId = await this.selectQueryForCCustomersTable(cust, dbConnection);
    
                                responseContent += await this.updateQueryForUsers(cust, currentTime, cryptPassword, userId, dbConnection);
                                responseContent += await this.updateQueryForCCustomers(cust, currentTime, dbConnection, userId);
                                responseContent += await this.updateQueryForCCustomerPermission(cust, currentTime, dbConnection, customerId);
                            } catch (e) {
                                console.log(`Failed to process update request. Exception: ${e.message}`);
                            }
                        } else if (cust.getAction() === ACTIONS.DELETE) {
                            try {
                                responseContent += await this.deleteQueryForCustomerPermission(cust, dbConnection);
                                responseContent += await this.deleteQueryForCCustomersTable(cust, dbConnection);
                                responseContent += await this.deleteQueryForUsersTable(cust, dbConnection);
                            } catch (e) {
                                console.log(`Failed to process delete request. Exception: ${e.message}`);
                            }
                        }
                    }
                } else {
                    responseContent += `\nFailed to get crypto_password for customer_no: ${await cust.getID_Customer()}`;
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (dbConnection) {
                try {
                    console.log("=============== inside finally block ===============");
                    await dbConnection.end();
                } catch (e) {
                    console.error(e);
                }
            }
        }
    
        console.log("===================== Final Result ==================");
        console.log(responseContent);
        console.log("===================== Finished ==================");
        return responseContent;
    }

    async deleteQueryForCustomerPermission(cust, dbConnection) {
        console.log("==========  inside deleteQueryForCustomerPermission ==========");
        let customerInternalId = cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(cust.getId_CustomerInternal())) : null;
        let responseBody = "";
    
        const deleteQueryForCCustomerPermission = `DELETE FROM c_customer_permission WHERE attribute = ? AND customer_id = ? AND customer_internal_id = ?`;
    
        try {
            const start = Date.now();
            const customerId = await this.selectQueryForCCustomersTable(cust, dbConnection);
    
            if (customerId !== null) {
                const accessFor = ["sts_OrdersLinkAccess", "sts_OrdersLinkReady"];
    
                for (let cnt = 0; cnt < accessFor.length; cnt++) {
                    await dbConnection.execute(deleteQueryForCCustomerPermission, [
                        accessFor[cnt],
                        customerId,
                        customerInternalId
                    ]);
                }
            }
    
            console.log("=============== Records have been deleted from c_customer_permission table! ==================");
            console.log(`===============  Time Taken=${Date.now() - start} ===============`);
            responseBody += `\nRecords have been deleted successfully from c_customer_permission for customer_no: ${cust.getID_Customer()}`;
    
        } catch (e) {
            responseBody = `\nFailed to delete data for c_customer_permission: ${e.message}`;
            console.log(`============  Exception: ${e.message} =======================`);
        }
    
        return responseBody;
    }

    async getCustomerList(json) {
        console.log("==========  inside getCustomerList ==========");
        let customerList = [];
        let jsonOrderId = json.cust;
    
        for (let key in jsonOrderId) {
            if (jsonOrderId.hasOwnProperty(key) && key.trim() !== "") {
                try {
                    let customerData = jsonOrderId[key];
                    let customer = new Customer(customerData); // Assuming Customer class can be instantiated with an object
                    customerList.push(customer);
                } catch (e) {
                    console.log(`got exception while parsing json for customer section: ${e.message}`);
                }
            }
        }
    
        console.log("Customer List: ", customerList);
        return customerList;
    }

    async selectQueryForUsersTable(cust, dbConnection) {
        console.log("==========  inside selectQueryForUsersTable ==========");
        let userId = null;
    
        const unumber = cust.getID_Customer() ? parseInt(decodeURIComponent(cust.getID_Customer())) : null;
        const internalId = cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(cust.getId_CustomerInternal())) : null;
        const roleId = this.ROLE_CC;
    
        console.log(`Executing query with parameters: unumber=${unumber}, internalId=${internalId}, roleId=${roleId}`);
    
        const query = `SELECT id FROM users WHERE unumber = ? AND internal_id = ? AND role_id = ?`;
    
        try {
            const [rows] = await dbConnection.execute(query, [unumber, internalId, roleId]);
    
            console.log("Query results: ", rows);
    
            if (rows.length > 0) {
                userId = rows[0].id;
            } else {
                console.log("No matching user found.");
            }
        } catch (e) {
            console.log(`Error while retrieving id from users table for unumber: ${unumber}, Error:`, e.message);
        }
    
        return userId;
    }

    async deleteQueryForUsersTable(cust, dbConnection) {
        console.log("==========  inside deleteQueryForUsersTable ==========");
        let responseContent = null;
    
        const query = `DELETE FROM users WHERE unumber = ? AND internal_id = ? AND role_id = ?`;
    
        try {
    
            await dbConnection.execute(query, [
                cust.getID_Customer() ? parseInt(decodeURIComponent(cust.getID_Customer())) : null,
                cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(cust.getId_CustomerInternal())) : null,
                this.ROLE_CC
            ]);
    
            responseContent = "\nRecord has been deleted from users table";
        } catch (e) {
            responseContent = "\nFailed to delete from users table";
            console.log(`=== got exception while deleting from users table for unumber: ${cust.getID_Customer()} ===`);
        }
    
        return responseContent;
    }

    async deleteQueryForCCustomersTable(cust, dbConnection) {
        console.log("==========  inside deleteQueryForCCustomersTable ==========");
        let responseContent = null;
    
        const query = `DELETE FROM c_customers WHERE customer_no = ? AND customer_internal_id = ?`;
    
        try {;
    
            await dbConnection.execute(query, [
                decodeURIComponent(cust.getID_Customer()),
                cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(cust.getId_CustomerInternal())) : null
            ]);
    
            responseContent = "\nRecord has been deleted from c_customers table";
        } catch (e) {
            responseContent = "\nFailed to delete from c_customers table";
            console.log(`=== got exception while deleting id from c_customers table for customer_no: ${cust.getID_Customer()} ===`);
        }
    
        return responseContent;
    }

    async selectQueryForCCustomersTable(cust, dbConnection) {
        console.log("==========  inside selectQueryForCCustomersTable ==========");
        let customerId = null;
    
        const query = `SELECT id FROM c_customers WHERE customer_no = ? AND customer_internal_id = ?`;
    
        try {
    
            const results = await dbConnection.execute(query, [
                decodeURIComponent(await cust.getID_Customer()),
                await cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(await cust.getId_CustomerInternal())) : null
            ]);
            console.log("customerId: ", results[0][0].id);
    
            if (results.length > 0) {
                customerId = results[0][0].id;
            }
            return customerId;
    
        } catch (e) {
            console.log(`=== got exception while retrieving id from c_customers table for customer_no: ${cust.getID_Customer()} ===`);
        }
    }

    async insertQueryForUsers(cust, currentTime, cryptPassword, dbConnection) {
        console.log("==========  inside insertQueryForUsers ==========");
        let responseBody = "";
        let userId = null;
    
        if (cryptPassword) {
            const query = `INSERT INTO users SET password = ?, username = ?, unumber = ?, internal_id = ?, role_id = ?, created_at = ?, updated_at = ?`;
    
            try {
                const start = Date.now();
    
                const [results] = await dbConnection.execute(query, [
                    cryptPassword,
                    decodeURIComponent(cust.getOrdersLinkUsername()),
                    cust.getID_Customer() ? parseInt(decodeURIComponent(cust.getID_Customer())) : null,
                    cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(cust.getId_CustomerInternal())) : null,
                    this.ROLE_CC,
                    currentTime,
                    currentTime
                ]);
    
                // getting userId of created record
                if (results.insertId) {
                    userId = results.insertId;
                }
    
                console.log("=============== Records are inserted into users table! ==================");
                console.log(`===============  Time Taken=${Date.now() - start} ===============`);
                responseBody += `\nRecords have been inserted successfully to users for customer_no: ${cust.getID_Customer()}`;
    
                if (userId !== null) {
                    responseBody += await this.insertQueryForCCustomers(cust, currentTime, dbConnection, userId);
                }
    
            } catch (e) {
                responseBody = `\nFailed to save data in users: ${e.message}`;
                console.log(`============  Exception: ${e.message} =======================`);
            }
        }
    
        return responseBody;
    }

    async updateQueryForUsers(cust, currentTime, cryptPassword, userId, dbConnection) {
        console.log("==========  inside updateQueryForUsers ==========");
        let responseBody = "";
    
        if (cryptPassword) {
            const query = `UPDATE users SET password = ?, username = ?, unumber = ?, internal_id = ?, role_id = ?, updated_at = ? WHERE id = ?`;
    
            const unumber = await cust.getID_Customer() ? parseInt(decodeURIComponent(await cust.getID_Customer())) : null;
            const internalId = await cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(await cust.getId_CustomerInternal())) : null;
            const username = decodeURIComponent(await cust.getOrdersLinkUsername());
            const roleId = this.ROLE_CC;
    
            console.log(`Executing update query with parameters: cryptPassword=${cryptPassword}, username=${username}, unumber=${unumber}, internalId=${internalId}, roleId=${roleId}, updated_at=${currentTime}, userId=${userId}`);
    
            try {
                const start = Date.now();
    
                await dbConnection.execute(query, [
                    cryptPassword,
                    username,
                    unumber,
                    internalId,
                    roleId,
                    currentTime,
                    userId
                ]);
    
                console.log("=============== Records are updated in users table! ==================");
                console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
                responseBody += `\nRecords have been updated successfully in users for customer_no: ${await cust.getID_Customer()}`;
    
            } catch (e) {
                responseBody = `\nFailed to save data in users: ${e.message}`;
                console.log(`============  Exception: ${e.message} =======================`);
            }
        } else {
            responseBody = "\nNo password provided, update operation skipped.";
            console.log("No cryptPassword provided, skipping update.");
        }
    
        return responseBody;
    }    

    async insertQueryForCCustomers(cust, currentTime, dbConnection, userId) {
        console.log("==========  inside insertQueryForCCustomers ==========");
        let responseBody = "";
        let result = null;
        let customerId = null;
    
        if (userId !== null) {
            const query = `INSERT INTO c_customers SET address1 = ?, address2 = ?, city = ?, address_company = ?, country = ?, address_description = ?, state = ?, zip = ?, company_name = ?, customer_internal_id = ?, customer_no = ?, user_id = ?, order_link_access = ?, order_link_ready = ?, created_at = ?, updated_at = ?`;
    
            try {
                const start = Date.now();
    
                const results = await dbConnection.execute(query, [
                    decodeURIComponent(cust.getAddress1()),
                    decodeURIComponent(cust.getAddress2()),
                    decodeURIComponent(cust.getAddressCity()),
                    decodeURIComponent(cust.getAddressCompany()),
                    decodeURIComponent(cust.getAddressCountry()),
                    decodeURIComponent(cust.getAddressDescription()),
                    decodeURIComponent(cust.getAddressState()),
                    decodeURIComponent(cust.getAddressZip()),
                    decodeURIComponent(cust.getCompanyName()),
                    cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(cust.getId_CustomerInternal())) : null,
                    cust.getID_Customer() ? parseInt(decodeURIComponent(cust.getID_Customer())) : null,
                    userId,
                    cust.getSts_OrdersLinkAccess() ? parseFloat(decodeURIComponent(cust.getSts_OrdersLinkAccess())) : null,
                    cust.getSts_OrdersLinkReady() ? parseFloat(decodeURIComponent(cust.getSts_OrdersLinkReady())) : null,
                    currentTime,
                    currentTime
                ]);
    
                // getting customerId of created record
                if (results.insertId) {
                    customerId = results.insertId;
                }
    
                console.log("=============== Records are inserted into c_customers table! ==================");
                console.log(`===============  Time Taken=${Date.now() - start} ===============`);
                responseBody += `\nRecords have been inserted successfully to c_customers for customer_no: ${cust.getID_Customer()}`;
    
                if (customerId !== null) {
                    responseBody += await this.insertQueryForCCustomerPermission(cust, currentTime, dbConnection, customerId);
                }
    
            } catch (e) {
                responseBody = `\nFailed to save data in c_customers: ${e.message}`;
                console.log(`============  Exception: ${e.message} =======================`);
            }
        }
    
        return responseBody;
    }

    async updateQueryForCCustomers(cust, currentTime, dbConnection, userId) {
        console.log("==========  inside updateQueryForCCustomers ==========");
        let responseBody = "";
    
        if (userId !== null) {
            const query = `UPDATE c_customers SET 
                address1 = ?, 
                address2 = ?, 
                city = ?, 
                address_company = ?, 
                country = ?, 
                address_description = ?, 
                state = ?, 
                zip = ?, 
                company_name = ?, 
                customer_internal_id = ?, 
                customer_no = ?, 
                user_id = ?, 
                order_link_access = ?, 
                order_link_ready = ?, 
                updated_at = ? 
                WHERE user_id = ?`;
    
            const address1 = decodeURIComponent(await cust.getAddress1());
            const address2 = decodeURIComponent(await cust.getAddress2());
            const city = decodeURIComponent(await cust.getAddressCity());
            const addressCompany = decodeURIComponent(await cust.getAddressCompany());
            const country = decodeURIComponent(await cust.getAddressCountry());
            const addressDescription = decodeURIComponent(await cust.getAddressDescription());
            const state = decodeURIComponent(await cust.getAddressState());
            const zip = decodeURIComponent(await cust.getAddressZip());
            const companyName = decodeURIComponent(await cust.getCompanyName());
            const customerInternalId = await cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(await cust.getId_CustomerInternal())) : null;
            const customerNo = await cust.getID_Customer() ? parseInt(decodeURIComponent(await cust.getID_Customer())) : null;
            const orderLinkAccess = await cust.getSts_OrdersLinkAccess() ? parseFloat(decodeURIComponent(await cust.getSts_OrdersLinkAccess())) : null;
            const orderLinkReady = await cust.getSts_OrdersLinkReady() ? parseFloat(decodeURIComponent(await cust.getSts_OrdersLinkReady())) : null;
    
            console.log(`Executing update query with parameters:
                address1=${address1},
                address2=${address2},
                city=${city},
                addressCompany=${addressCompany},
                country=${country},
                addressDescription=${addressDescription},
                state=${state},
                zip=${zip},
                companyName=${companyName},
                customerInternalId=${customerInternalId},
                customerNo=${customerNo},
                userId=${userId},
                orderLinkAccess=${orderLinkAccess},
                orderLinkReady=${orderLinkReady},
                updated_at=${currentTime}`);
    
            try {
                const start = Date.now();
    
                await dbConnection.execute(query, [
                    address1,
                    address2,
                    city,
                    addressCompany,
                    country,
                    addressDescription,
                    state,
                    zip,
                    companyName,
                    customerInternalId,
                    customerNo,
                    userId,
                    orderLinkAccess,
                    orderLinkReady,
                    currentTime,
                    userId
                ]);
    
                console.log("=============== Records have been updated in c_customers table! ==================");
                console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
                responseBody += `\nRecords have been updated successfully in c_customers for customer_no: ${cust.getID_Customer()}`;
    
            } catch (e) {
                responseBody = `\nFailed to save data in c_customers: ${e.message}`;
                console.log(`============  Exception: ${e.message} =======================`);
            }
        } else {
            responseBody = "\nUser ID is null, update operation skipped.";
            console.log("User ID is null, skipping update.");
        }
    
        return responseBody;
    }

    async insertQueryForCCustomerPermission(cust, currentTime, dbConnection, customerId) {
        console.log("==========  inside insertQueryForCCustomerPermission ==========");
        let responseBody = "";
        let result = null;
    
        if (customerId !== null) {
            const query = `INSERT INTO c_customer_permission SET attribute = ?, value = ?, customer_internal_id = ?, customer_no = ?, customer_id = ?, created_at = ?, updated_at = ?`;
    
            try {
                const start = Date.now();
                const accessFor = ["sts_OrdersLinkAccess", "sts_OrdersLinkReady"];
    
                for (let cnt = 0; cnt < accessFor.length; cnt++) {
                    if (accessFor[cnt] === "sts_OrdersLinkAccess") {
                        await dbConnection.execute(query, [
                            "sts_OrdersLinkAccess",
                            cust.getSts_OrdersLinkAccess() ? parseFloat(decodeURIComponent(cust.getSts_OrdersLinkAccess())) : null,
                            cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(cust.getId_CustomerInternal())) : null,
                            cust.getID_Customer() ? parseInt(decodeURIComponent(cust.getID_Customer())) : null,
                            customerId,
                            currentTime,
                            currentTime
                        ]);
                    }
    
                    if (accessFor[cnt] === "sts_OrdersLinkReady") {
                        await dbConnection.execute(query, [
                            "sts_OrdersLinkReady",
                            cust.getSts_OrdersLinkReady() ? parseFloat(decodeURIComponent(cust.getSts_OrdersLinkReady())) : null,
                            cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(cust.getId_CustomerInternal())) : null,
                            cust.getID_Customer() ? parseInt(decodeURIComponent(cust.getID_Customer())) : null,
                            customerId,
                            currentTime,
                            currentTime
                        ]);
                    }
                }
    
                console.log("=============== Records are inserted into c_customer_permission table! ==================");
                console.log(`===============  Time Taken=${Date.now() - start} ===============`);
                responseBody += `\nRecords have been inserted successfully to c_customer_permission for customer_no: ${cust.getID_Customer()}`;
    
            } catch (e) {
                responseBody = `\nFailed to save data in c_customers: ${e.message}`;
                console.log(`============  Exception: ${e.message} =======================`);
            }
        }
    
        return responseBody;
    }

    async updateQueryForCCustomerPermission(cust, currentTime, dbConnection, customerId) {
        console.log("==========  inside updateQueryForCCustomerPermission ==========");
        let responseBody = "";
    
        if (customerId !== null) {
            const query = `UPDATE c_customer_permission SET 
                attribute = ?, 
                value = ?, 
                customer_internal_id = ?, 
                customer_no = ?, 
                customer_id = ?, 
                updated_at = ? 
                WHERE attribute = ? AND customer_id = ? AND customer_no = ? AND customer_internal_id = ?`;
    
            const customerInternalId = await cust.getId_CustomerInternal() ? parseInt(decodeURIComponent(await cust.getId_CustomerInternal())) : null;
            const customerNo = await cust.getID_Customer() ? parseInt(decodeURIComponent(await cust.getID_Customer())) : null;
        
            try {
                const start = Date.now();
                const accessFor = ["sts_OrdersLinkAccess", "sts_OrdersLinkReady"];
    
                for (let cnt = 0; cnt < accessFor.length; cnt++) {
                    const attribute = accessFor[cnt];
                    let value = null;
    
                    if (attribute === "sts_OrdersLinkAccess") {
                        value = await cust.getSts_OrdersLinkAccess() ? parseFloat(decodeURIComponent(await cust.getSts_OrdersLinkAccess())) : null;
                    } else if (attribute === "sts_OrdersLinkReady") {
                        value = await cust.getSts_OrdersLinkReady() ? parseFloat(decodeURIComponent(await cust.getSts_OrdersLinkReady())) : null;
                    }
    
                    console.log(`Updating attribute=${attribute} with value=${value}`);
    
                    await dbConnection.execute(query, [
                        attribute,
                        value,
                        customerInternalId,
                        customerNo,
                        customerId,
                        currentTime,
                        attribute,
                        customerId,
                        customerNo,
                        customerInternalId
                    ]);
                }
    
                console.log("=============== Records have been updated in c_customer_permission table! ==================");
                console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
                responseBody += `\nRecords have been updated successfully in c_customer_permission for customer_no: ${await cust.getID_Customer()}`;
    
            } catch (e) {
                responseBody = `\nFailed to save data in c_customer_permission: ${e.message}`;
                console.log(`============  Exception: ${e.message} =======================`);
            }
        } else {
            responseBody = "\nCustomer ID is null, update operation skipped.";
            console.log("Customer ID is null, skipping update.");
        }
    
        return responseBody;
    }
}

exports.handler = async (event, context) => {
    const handler = new CustHandler();
    return handler.handle(event, context);
};
module.exports = CustHandler;