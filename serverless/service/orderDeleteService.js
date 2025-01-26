const { th } = require('date-fns/locale');
const dbUtils = require('../../utils/dbUtils');
const orderHandler = require('./orderHandler');
const OrderHandler = new orderHandler;
const thumbHandler = require('./thumbHandler');
const ThumbHandler = new thumbHandler;
const orderTypeHandler = require('./orderTypeHandler');
const OrderTypeHandler = new orderTypeHandler;
const empHandler = require('./empHandler');
const EmpHandler = new empHandler;
const custHandler = require('./custHandler');
const CustHandler = new custHandler;
const S3bucketUtils = require('../../utils/s3bucketUtils');

class OrderDeleteService {
    static DELETE_TYPE_ORDER = "order";
    static DELETE_TYPE_PRODUCT = "product";
    static DELETE_TYPE_PACKIMPORTID = "tracking";
    static DELETE_TYPE_SHIPPING = "shipping";
    static DELETE_TYPE_PAYMENT = "payment";

    async deleteOrder(dbConnection, order_no, customerInternalId) {
        let responseBody = '';
        let orderId = await OrderHandler.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
    
        if (orderId !== null) {
            let preparedStmt;
            try {
                const query = 'DELETE FROM orders WHERE customer_internal_id = ? AND order_no = ?';
                preparedStmt = await dbConnection.prepare(query);
                await preparedStmt.execute([customerInternalId, order_no]);
                console.log('====== Records have been deleted from orders table! ======');
                responseBody += `\n Records have been deleted successfully from Orders for order id: ${order_no}`;
                responseBody += await this.deleteLinesOE(dbConnection, order_no, customerInternalId, orderId, DELETE_TYPE_Order);
                responseBody += await this.deleteAddr(dbConnection, order_no, customerInternalId, orderId, DELETE_TYPE_SHIPPING);
                responseBody += await this.deletePackImport(dbConnection, order_no, customerInternalId, orderId, DELETE_TYPE_PACKIMPORTID);
                responseBody += await this.deleteSubPay(dbConnection, order_no, customerInternalId, orderId, DELETE_TYPE_PAYMENT);
            } catch (e) {
                console.log(`====== Got exception while executing order table query ====== : ${e.message}`);
                responseBody += `\nFailed to delete record for order id: ${order_no}. Due to exception: ${e.message}`;
            } finally {
                if (preparedStmt) {
                    await preparedStmt.close();
                }
            }
        }
        return responseBody;
    }

    async deleteLinesOE(dbConnection, order_no, customerInternalId, orderId, deleteType) {
        let responseBody = '';
        let preparedStmt;
        let productAttrPreparedStmt;
    
        try {
            if (orderId === null && deleteType === DELETE_TYPE_Order) {
                orderId = await OrderHandler.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
            }
            if (orderId !== null || deleteType === DELETE_TYPE_PRODUCT) {
                let product_Id = null;
                let productsDeleteQuery = '';
    
                if (deleteType === DELETE_TYPE_PRODUCT) {
                    product_Id = await this.selectRecordsFromProductTable(order_no, dbConnection, customerInternalId, deleteType);
                    productsDeleteQuery = 'DELETE FROM products WHERE product_no = ? AND customer_internal_id = ?';
                } else {
                    product_Id = await this.selectRecordsFromProductTable(orderId, dbConnection, customerInternalId, deleteType);
                    productsDeleteQuery = 'DELETE FROM products WHERE order_id = ? AND customer_internal_id = ?';
                }
    
                const productAttrDeleteQuery = 'DELETE FROM product_attribute WHERE product_id = ? AND customer_internal_id = ?';
    
                // Deleting data from products table
                preparedStmt = await dbConnection.prepare(productsDeleteQuery);
                if (deleteType === DELETE_TYPE_PRODUCT) {
                    await preparedStmt.execute([order_no, customerInternalId]);
                } else {
                    await preparedStmt.execute([orderId, customerInternalId]);
                }
    
                // Deleting data from product_attribute table
                productAttrPreparedStmt = await dbConnection.prepare(productAttrDeleteQuery);
                await productAttrPreparedStmt.execute([product_Id, customerInternalId]);
    
                console.log('====== Records have been deleted from Products table! ======');
                responseBody += `\n Records have been deleted successfully from Products for order id: ${order_no}`;
            }
        } catch (e) {
            console.log(`====== Got exception while executing Products table query ====== : ${e.message}`);
            responseBody += `\nFailed to delete record for Products for id: ${order_no}. Due to exception: ${e.message}`;
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
            if (productAttrPreparedStmt) {
                await productAttrPreparedStmt.close();
            }
        }
    
        return responseBody;
    }

    async selectRecordsFromProductTable(orderId, dbConnection, customerInternalId, deleteType) {
        let productId = null;
        let preparedStatement;
        let selectSQL = '';
    
        if (deleteType === DELETE_TYPE_PRODUCT) {
            selectSQL = 'SELECT id FROM products WHERE product_no = ? AND customer_internal_id = ?';
        } else {
            selectSQL = 'SELECT id FROM products WHERE order_id = ? AND customer_internal_id = ?';
        }
    
        try {
            preparedStatement = await dbConnection.prepare(selectSQL);
            const [rows] = await preparedStatement.execute([orderId, customerInternalId]);
    
            if (rows.length > 0) {
                productId = rows[0].id;
            }
        } catch (e) {
            console.log(`=== got exception while retrieving id from products table for order id: ${orderId}`);
        } finally {
            if (preparedStatement) {
                await preparedStatement.close();
            }
        }
    
        return productId;
    }

    async deleteAddr(dbConnection, order_no, customerInternalId, orderId, deleteType) {
        let responseBody = '';
        let preparedStmt;
    
        try {
            if (orderId === null && deleteType === DELETE_TYPE_Order) {
                orderId = await OrderHandler.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
            }
            if (orderId !== null || deleteType === DELETE_TYPE_SHIPPING) {
                let orderShippingDeleteQuery = '';
    
                if (deleteType === DELETE_TYPE_SHIPPING) {
                    orderShippingDeleteQuery = 'DELETE from order_shipping WHERE shipping_no = ? AND customer_internal_id = ?';
                } else {
                    orderShippingDeleteQuery = 'DELETE from order_shipping WHERE order_id = ? AND customer_internal_id = ?';
                }
    
                preparedStmt = await dbConnection.prepare(orderShippingDeleteQuery);
    
                if (deleteType === DELETE_TYPE_SHIPPING) {
                    await preparedStmt.execute([order_no, customerInternalId]);
                } else {
                    await preparedStmt.execute([orderId, customerInternalId]);
                }
    
                console.log('====== Records have been deleted from order_shipping table! ======');
                responseBody += `\n Records have been deleted successfully from order_shipping for order id: ${order_no}`;
            }
        } catch (e) {
            console.log(`====== Got exception while executing order_shipping table query ====== : ${e.message}`);
            responseBody += `\nFailed to delete record for order_shipping id: ${order_no}. Due to exception: ${e.message}`;
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }

    async deletePackImport(dbConnection, order_no, customerInternalId, orderId, deleteType) {
        let responseBody = '';
        let preparedStmt;
    
        try {
            if (orderId === null && deleteType === DELETE_TYPE_Order) {
                orderId = await OrderHandler.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
            }
            if (orderId !== null || deleteType === DELETE_TYPE_PACKIMPORTID) {
                let orderTrackingDeleteQuery = '';
    
                if (deleteType === DELETE_TYPE_PACKIMPORTID) {
                    orderTrackingDeleteQuery = 'DELETE FROM order_tracking WHERE pack_import = ? AND customer_internal_id = ?';
                } else {
                    orderTrackingDeleteQuery = 'DELETE FROM order_tracking WHERE order_id = ? AND customer_internal_id = ?';
                }
    
                preparedStmt = await dbConnection.prepare(orderTrackingDeleteQuery);
    
                if (deleteType === DELETE_TYPE_PACKIMPORTID) {
                    await preparedStmt.execute([order_no, customerInternalId]);
                } else {
                    await preparedStmt.execute([orderId, customerInternalId]);
                }
    
                console.log('====== Records have been deleted from order_tracking table! ======');
                responseBody += `\n Records have been deleted successfully from order_tracking for order id: ${order_no}`;
            }
        } catch (e) {
            console.log(`====== Got exception while executing order_tracking table query ====== : ${e.message}`);
            responseBody += `\nFailed to delete record for order_tracking id: ${order_no}. Due to exception: ${e.message}`;
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }

    async deleteSubPay(dbConnection, order_no, customerInternalId, orderId, deleteType) {
        let responseBody = '';
        let preparedStmt;
    
        try {
            if (orderId === null && deleteType === DELETE_TYPE_Order) {
                orderId = await OrderHandler.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
            }
            if (orderId !== null || deleteType === DELETE_TYPE_PAYMENT) {
                let paymentsDeleteQuery = '';
    
                if (deleteType === DELETE_TYPE_PAYMENT) {
                    paymentsDeleteQuery = 'DELETE FROM payments WHERE sub_payment_no = ? AND customer_internal_id = ?';
                } else {
                    paymentsDeleteQuery = 'DELETE FROM payments WHERE order_id = ? AND customer_internal_id = ?';
                }
    
                preparedStmt = await dbConnection.prepare(paymentsDeleteQuery);
    
                if (deleteType === DELETE_TYPE_PAYMENT) {
                    await preparedStmt.execute([order_no, customerInternalId]);
                } else {
                    await preparedStmt.execute([orderId, customerInternalId]);
                }
    
                console.log('====== Records have been deleted from payments table! ======');
                responseBody += `\n Records have been deleted successfully from payments for order id: ${order_no}`;
            }
        } catch (e) {
            console.log(`====== Got exception while executing payments table query ====== : ${e.message}`);
            responseBody += `\nFailed to delete record from payments for order id: ${order_no}. Due to exception: ${e.message}`;
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }

    async deleteOrderDesLoc(dbConnection, design) {
        let responseBody = 'Failed to delete data';
        let preparedStmt;
    
        try {
            const design_no = design.ID_OrderDesLoc ? parseInt(decodeURIComponent(design.ID_OrderDesLoc)) : null;
            const customerInternalId = design.Id_CustomerInternal ? parseInt(decodeURIComponent(design.Id_CustomerInternal)) : null;
            const designsDeleteQuery = 'DELETE FROM designs WHERE design_image_id = ? AND customer_internal_id = ?';
    
            preparedStmt = await dbConnection.prepare(designsDeleteQuery);
            await preparedStmt.execute([design_no, customerInternalId]);
    
            console.log('=============== Record deleted from designs table! ==================');
            responseBody = `\nRecord has been deleted successfully from designs for: ${design.ID_OrderDesLoc}`;
        } catch (e) {
            responseBody = `\nFailed to delete data in designs: ${e.message}`;
            console.log(`============  Exception: ${e.message} =======================`);
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }

    async deleteThumb(dbConnection, thumb) {
        let responseBody = "";
    
        try {
            const imageKey = await ThumbHandler.selectQueryForDesignImage(thumb, dbConnection);
            const query = "DELETE FROM design_image WHERE customer_internal_id = ? AND design_image_no = ?";
            const preparedStmt = await dbConnection.prepare(query);
    
            const customerInternalId = thumb.id_CustomerInternal ? parseInt(decodeURIComponent(thumb.id_CustomerInternal)) : null;
            const designImageNo = thumb.id_Serial ? parseInt(decodeURIComponent(thumb.id_Serial)) : null;
    
            preparedStmt.bind([customerInternalId, designImageNo]);
            await preparedStmt.addBatch();
    
            const start = Date.now();
            const result = await preparedStmt.executeBatch();
            console.log(`=============== Records have been deleted from design_image table! ==================`);
            console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
            responseBody = `\nRecords have been deleted successfully from design_image for design_image_no : ${thumb.id_Serial}`;
    
            for (const key of imageKey) {
                await S3bucketUtils.deleteFile(key);
            }
    
        } catch (error) {
            responseBody = `\nFailed to delete data in design_image : ${error.message}`;
            console.error(`============  Exception : ${error.message} =======================`);
    
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
        return responseBody;
    }

    async deleteOrdTyp(dbConnection, order) {
        let responseBody = "Failed to delete data";
    
        try {
            const imageKey = await OrderTypeHandler.selectQueryForOrderTypesTable(order, dbConnection);
            const query = "DELETE FROM order_types WHERE customer_internal_id = ? AND order_type_no = ?";
            const preparedStmt = await dbConnection.prepare(query);
    
            const customerInternalId = order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null;
            const orderTypeNo = order.id_OrderType ? parseFloat(decodeURIComponent(order.id_OrderType)) : null;
    
            preparedStmt.bind([customerInternalId, orderTypeNo]);
            await preparedStmt.addBatch();
    
            const start = Date.now();
            const result = await preparedStmt.executeBatch();
            console.log(`=============== Records have been deleted from order_types table! ==================`);
            console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
            responseBody = "Records have been deleted successfully from order_types.";
    
            for (const key of imageKey) {
                await S3bucketUtils.deleteFile(key);
            }
    
        } catch (error) {
            responseBody = `\nFailed to delete data in order_types : ${error.message}`;
            console.error(`============  Exception : ${error.message} =======================`);
    
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
        return responseBody;
    }

    async deleteEmp(dbConnection, emp) {
        let responseContent = "";
        try {
            responseContent += await EmpHandler.deleteQueryForEmployees(emp, dbConnection);
            let responseBody = "";
    
            const query = "DELETE FROM employee_permission WHERE employee_no = ? AND customer_internal_id = ?";
            const preparedStmt = await dbConnection.prepare(query);
    
            const employeeNo = emp.id_Employee ? parseInt(decodeURIComponent(emp.id_Employee)) : null;
            const customerInternalId = emp.id_CustomerInternal ? parseInt(decodeURIComponent(emp.id_CustomerInternal)) : null;
    
            preparedStmt.bind([employeeNo, customerInternalId]);
            await preparedStmt.addBatch();
    
            const start = Date.now();
            const result = await preparedStmt.executeBatch();
            console.log(`=============== Records deleted from employee_permission table! ==================`);
            console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
    
            responseBody += `\nRecords have been deleted successfully from employee_permission for employee id: ${emp.id_Employee}`;
    
        } catch (error) {
            responseBody = `\nFailed to delete data from employee_permission: ${error.message}`;
            console.error(`============  Exception: ${error.message} =======================`);
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
        responseContent += responseBody;
        return responseContent;
    }

    async deleteCust(dbConnection, cust) {
        let responseContent = "";
        try {
            responseContent += await CustHandler.deleteQueryForCCustomersTable(cust, dbConnection);
            let responseBody = "";
    
            const deleteQueryForCCustomerPermission = "DELETE FROM c_customer_permission WHERE customer_no = ? AND customer_internal_id = ?";
            const preparedStmt = await dbConnection.prepare(deleteQueryForCCustomerPermission);
    
            const customerNo = decodeURIComponent(cust.id_Customer);
            const customerInternalId = cust.id_CustomerInternal ? parseInt(decodeURIComponent(cust.id_CustomerInternal)) : null;
    
            preparedStmt.bind([customerNo, customerInternalId]);
            await preparedStmt.addBatch();
    
            const start = Date.now();
            const result = await preparedStmt.executeBatch();
            console.log(`=============== Records have been deleted from c_customer_permission table! ==================`);
            console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
    
            responseBody += `\nRecords have been deleted successfully from c_customer_permission for customer_no: ${cust.id_Customer}`;
    
        } catch (error) {
            responseBody = `\nFailed to delete data for c_customer_permission: ${error.message}`;
            console.error(`============  Exception: ${error.message} =======================`);
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
        responseContent += responseBody;
        return responseContent;
    }

    async deleteDesTyp(dbConnection, destyp) {
        console.log("==========  inside deleteDesTyp ==========");
        let responseBody = "";
    
        try {
            const query = "DELETE FROM design_types WHERE customer_internal_id = ? AND design_type_no = ?";
            const preparedStmt = await dbConnection.prepare(query);
    
            const customerInternalId = destyp.id_CustomerInternal ? parseInt(decodeURIComponent(destyp.id_CustomerInternal)) : null;
            const designTypeNo = destyp.id_DesignType ? parseInt(decodeURIComponent(destyp.id_DesignType)) : null;
    
            preparedStmt.bind([customerInternalId, designTypeNo]);
            await preparedStmt.addBatch();
    
            const start = Date.now();
            const result = await preparedStmt.executeBatch();
            console.log(`=============== Records deleted from design_types table! ==================`);
            console.log(`===============  Time Taken=${Date.now() - start} ms ===============`);
            responseBody += `\nRecords have been deleted successfully from design_types for design type id: ${destyp.id_DesignType}`;
    
        } catch (error) {
            responseBody = `\nFailed to delete data in design_types: ${error.message}`;
            console.error(`============  Exception: ${error.message} =======================`);
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return responseBody;
    }
}

exports.handler = async (event, context) => {
    const handler = new OrderDeleteService();
    return handler.handle(event, context);
};

module.exports = OrderDeleteService;
