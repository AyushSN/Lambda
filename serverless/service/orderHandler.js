const dbUtils = require('../../utils/dbUtils');
const AuthHandler = require('../../authHandler');
const { ACTIONS } = require('../../authHandler');
const Orders = require('../../serverless/models/orders');
const Order = require('../../serverless/models/order');
const Attributes = require('../../serverless/models/attributes');
const Util = require('../../utils/util');
const { hmacSha1 } = require('../../authHandler');
const Designs = require('../../serverless/models/designs');
const Payment = require('../../serverless/models/payment');
const LineOeProduct = require('../../serverless/models/lineOeProduct');
const Shipping = require('../../serverless/models/shipping');
const Tracking = require('../../serverless/models/tracking');
const hashKey = '3zH14aB_9xF5za4*'

class OrderHandler{
    static hashkey = '3zH14aB_9xF5za4*';

    constructor(jsonQueryString) {
        this.jsonQueryString = jsonQueryString;
    }

    async handle(jsonQueryString) {
        return await this.processRequest(jsonQueryString);
    }

    async processRequest(jsonQueryString) {
        let responseContent = '';
        // Parsing JSON to get the data as a single object
        const orderList = await this.getorderInstance(jsonQueryString);
    
        for (const orderInstance of orderList) {
            console.log(`============ Working on ${orderInstance.order.ID_Order ? `order id ${orderInstance.order.ID_Order}` : 'separate entity'}  ========`);
            try {
                console.debug('====== Starting Query data ======');
                responseContent += await this.performDataOperationForOrders(Attributes.orderAttr, orderInstance, jsonQueryString);
                console.debug('====== Successfully completed query ======');
            } catch (e) {
                console.log(`====== Got exception while executing query ====== : ${e.message}`);
            }
        }
        console.log('===================== Final Result ==================');
        console.log(responseContent);
        console.log('===================== Finished ==================');
        return responseContent;
    }
    
    async getOrderInstance(json) {
    const ordersList = [];

    const superkeys = Object.keys(json.order);

    for (const orderId of superkeys) {
        const jsonOrderId = json.order[orderId];
        const keys = Object.keys(jsonOrderId);
        const orderInstance = {
            des: [],
            pay: [],
            lineoe: [],
            shipping: [],
            tracking: [],
            order: null
        };

        for (const key of keys) {
            try {
                // Parsing data for order des section
                if (key === "des") {
                    for (const innerKey of Object.keys(jsonOrderId[key])) {
                        const des = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                        orderInstance.des.push(des);
                    }
                }

                // Parsing data for order pay section
                if (key === "pay") {
                    for (const innerKey of Object.keys(jsonOrderId[key])) {
                        const pay = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                        orderInstance.pay.push(pay);
                    }
                }

                // Parsing data for order lineoe (product) section
                if (key === "lineoe") {
                    for (const innerKey of Object.keys(jsonOrderId[key])) {
                        const lineoe = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                        lineoe.index = innerKey;
                        orderInstance.lineoe.push(lineoe);
                    }
                }

                // Parsing data for order section
                if (key === "order") {
                    const order = JSON.parse(JSON.stringify(jsonOrderId[key]));
                    orderInstance.order = order;
                }

                // Parsing data for addr order_shipping section
                if (key === "addr") {
                    for (const innerKey of Object.keys(jsonOrderId[key])) {
                        const addr = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                        orderInstance.shipping.push(addr);
                    }
                }

                // Parsing data for tracking section
                if (key === "track") {
                    for (const innerKey of Object.keys(jsonOrderId[key])) {
                        const track = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                        orderInstance.tracking.push(track);
                    }
                }
            } catch (error) {
                console.log(`Got exception while parsing JSON for section ${key}: ${error.message}`);
            }
        }

        ordersList.push(orderInstance);
        console.debug("======= Order Instance : ==== \n", orderInstance);
    }

    return ordersList;
    }

    
    async performDataOperationForOrders(orderAttr, orderInstance, jsonQueryString) {
        console.log("==========  inside performDataOperationForOrders  ==========");
        let order = orderInstance.order;
        let responseBody = '';
    
        let dbConnection;
        const dt = new Date();
        const currentTime = dt.toISOString().slice(0, 19).replace('T', ' ');
    
        try {
            console.log("==========  Orders  ==========");
            const start = Date.now();
    
            // Get database connection
            dbConnection = await dbUtils.getConnection();
    
            // Start transaction
            await dbConnection.beginTransaction();
    
            const batchQueries = [];
    
            if (order && order.action) {
                const hmacValue = hmacSha1(
                    `${decodeURIComponent(order.ID_Order)}-${decodeURIComponent(order.Id_CustomerInternal)}-${decodeURIComponent(order.Id_Customer)}`, 
                    hashKey
                );
                console.log("=================ACTION==================", order.action);
    
                if (order.action === ACTIONS.ADD) {
                    console.debug("============= Inside Add Section ===================");
    
                    const insertQuery = `
                        INSERT INTO orders (
                            order_no, order_type_id, customer_internal_id, customer_no, backorder, 
                            invoiced, paid, produced, purchased, received, 
                            received_sub, purchased_sub, shipped, sizing_type, customer_rep, 
                            quantity, design_name, design_no, balance, sale_tax_total, 
                            total_invoice, adjustment, payments, shipping, subtotal, 
                            art_done, terms_days, terms_name, purchase_order, invoiced_date, 
                            order_date, req_ship_date, shipped_date, production_date, status, 
                            uid, created_at, updated_at, ExtOrderID, ExtSource
                        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                    `;
    
                    const insertValues = [
                        order.ID_Order ? parseInt(decodeURIComponent(order.ID_Order)) : null,
                        order.Id_OrderType ? parseFloat(decodeURIComponent(order.Id_OrderType)) : null,
                        order.Id_CustomerInternal ? parseInt(decodeURIComponent(order.Id_CustomerInternal)) : null,
                        order.Id_Customer ? parseInt(decodeURIComponent(order.Id_Customer)) : null,
                        decodeURIComponent(order.Sts_BackOrder),
                        decodeURIComponent(order.Sts_Invoiced),
                        decodeURIComponent(order.Sts_Paid),
                        decodeURIComponent(order.Sts_Produced),
                        decodeURIComponent(order.Sts_Purchased),
                        decodeURIComponent(order.Sts_Received),
                        order.Sts_ReceivedSub ? parseFloat(decodeURIComponent(order.Sts_ReceivedSub)) : null,
                        order.Sts_PurchasedSub ? parseFloat(decodeURIComponent(order.Sts_PurchasedSub)) : null,
                        order.Sts_Shipped ? parseFloat(decodeURIComponent(order.Sts_Shipped)) : null,
                        order.Sts_SizingType ? parseFloat(decodeURIComponent(order.Sts_SizingType)) : null,
                        decodeURIComponent(order.CustomerServiceRep),
                        order.Cn_TotalProductQty_Current ? parseFloat(decodeURIComponent(order.Cn_TotalProductQty_Current)) : null,
                        decodeURIComponent(order.DesignName),
                        order.Id_Design ? parseFloat(decodeURIComponent(order.Id_Design)) : null,
                        order.CnCur_Balance ? parseFloat(decodeURIComponent(order.CnCur_Balance)) : null,
                        order.CnCur_SalesTaxTotal ? parseFloat(decodeURIComponent(order.CnCur_SalesTaxTotal)) : null,
                        order.CnCur_TotalInvoice ? parseFloat(decodeURIComponent(order.CnCur_TotalInvoice)) : null,
                        order.Cur_Adjust ? parseFloat(decodeURIComponent(order.Cur_Adjust)) : null,
                        order.Cur_Payments ? parseFloat(decodeURIComponent(order.Cur_Payments)) : null,
                        order.Cur_Shipping ? parseFloat(decodeURIComponent(order.Cur_Shipping)) : null,
                        order.Cur_Subtotal ? parseFloat(decodeURIComponent(order.Cur_Subtotal)) : null,
                        order.Sts_ArtDone ? parseFloat(decodeURIComponent(order.Sts_ArtDone)) : null,
                        order.TermsDays ? parseInt(decodeURIComponent(order.TermsDays)) : null,
                        decodeURIComponent(order.TermsName),
                        decodeURIComponent(order.CustomerPurchaseOrder),
                        order.Date_OrderInvoiced ? decodeURIComponent(order.Date_OrderInvoiced) : null,
                        order.Date_OrderPlaced ? decodeURIComponent(order.Date_OrderPlaced) : null,
                        order.Date_OrderRequestedToShip ? decodeURIComponent(order.Date_OrderRequestedToShip) : null,
                        order.Date_OrderShipped ? decodeURIComponent(order.Date_OrderShipped) : null,
                        order.Date_ProductionDone ? decodeURIComponent(order.Date_ProductionDone) : null,
                        order.Cn_sts_HoldOrder ? parseFloat(decodeURIComponent(order.Cn_sts_HoldOrder)) : null,
                        hmacValue,
                        new Date().toISOString(), // created_at
                        new Date().toISOString(), // updated_at
                        order.ExtOrderID ? decodeURIComponent(order.ExtOrderID) : null,
                        order.ExtSource ? decodeURIComponent(order.ExtSource) : null
                    ];
    
                    if (insertValues.length !== 40) {
                        console.error(`Mismatch: Expected 40 values but got ${insertValues.length}`);
                    }
    
                    batchQueries.push({ query: insertQuery, values: insertValues });
                }
    
                if (order.action === ACTIONS.UPDATE) {
                    console.debug("============= Inside Update Section ===================");
    
                    const updateQuery = `
                        UPDATE orders SET
                        order_no = ?, order_type_id = ?, customer_internal_id = ?, customer_no = ?, backorder = ?, invoiced = ?, paid = ?,
                        produced = ?, purchased = ?, received = ?, received_sub = ?, purchased_sub = ?, shipped = ?, sizing_type = ?,
                        customer_rep = ?, quantity = ?, design_name = ?, design_no = ?, balance = ?, sale_tax_total = ?, total_invoice = ?,
                        adjustment = ?, payments = ?, shipping = ?, subtotal = ?, art_done = ?, terms_days = ?, terms_name = ?, purchase_order = ?,
                        invoiced_date = ?, order_date = ?, req_ship_date = ?, shipped_date = ?, production_date = ?, status = ?, uid = ?, 
                        updated_at = ?, ExtOrderID = ?, ExtSource = ? 
                        WHERE customer_internal_id = ? AND order_no = ?
                    `;
    
                    const updateValues = [
                        order.ID_Order ? parseInt(decodeURIComponent(order.ID_Order)) : null,
                        order.Id_OrderType ? parseFloat(decodeURIComponent(order.Id_OrderType)) : null,
                        order.Id_CustomerInternal ? parseInt(decodeURIComponent(order.Id_CustomerInternal)) : null,
                        order.Id_Customer ? parseInt(decodeURIComponent(order.Id_Customer)) : null,
                        decodeURIComponent(order.Sts_BackOrder),
                        decodeURIComponent(order.Sts_Invoiced),
                        decodeURIComponent(order.Sts_Paid),
                        decodeURIComponent(order.Sts_Produced),
                        decodeURIComponent(order.Sts_Purchased),
                        decodeURIComponent(order.Sts_Received),
                        order.Sts_ReceivedSub ? parseFloat(decodeURIComponent(order.Sts_ReceivedSub)) : null,
                        order.Sts_PurchasedSub ? parseFloat(decodeURIComponent(order.Sts_PurchasedSub)) : null,
                        order.Sts_Shipped ? parseFloat(decodeURIComponent(order.Sts_Shipped)) : null,
                        order.Sts_SizingType ? parseFloat(decodeURIComponent(order.Sts_SizingType)) : null,
                        decodeURIComponent(order.CustomerServiceRep),
                        order.Cn_TotalProductQty_Current ? parseFloat(decodeURIComponent(order.Cn_TotalProductQty_Current)) : null,
                        decodeURIComponent(order.DesignName),
                        order.Id_Design ? parseFloat(decodeURIComponent(order.Id_Design)) : null,
                        order.CnCur_Balance ? parseFloat(decodeURIComponent(order.CnCur_Balance)) : null,
                        order.CnCur_SalesTaxTotal ? parseFloat(decodeURIComponent(order.CnCur_SalesTaxTotal)) : null,
                        order.CnCur_TotalInvoice ? parseFloat(decodeURIComponent(order.CnCur_TotalInvoice)) : null,
                        order.Cur_Adjust ? parseFloat(decodeURIComponent(order.Cur_Adjust)) : null,
                        order.Cur_Payments ? parseFloat(decodeURIComponent(order.Cur_Payments)) : null,
                        order.Cur_Shipping ? parseFloat(decodeURIComponent(order.Cur_Shipping)) : null,
                        order.Cur_Subtotal ? parseFloat(decodeURIComponent(order.Cur_Subtotal)) : null,
                        order.Sts_ArtDone ? parseFloat(decodeURIComponent(order.Sts_ArtDone)) : null,
                        order.TermsDays ? parseInt(decodeURIComponent(order.TermsDays)) : null,
                        decodeURIComponent(order.TermsName),
                        decodeURIComponent(order.CustomerPurchaseOrder),
                        order.Date_OrderInvoiced ? decodeURIComponent(order.Date_OrderInvoiced) : null,
                        order.Date_OrderPlaced ? decodeURIComponent(order.Date_OrderPlaced) : null,
                        order.Date_OrderRequestedToShip ? decodeURIComponent(order.Date_OrderRequestedToShip) : null,
                        order.Date_OrderShipped ? decodeURIComponent(order.Date_OrderShipped) : null,
                        order.Date_ProductionDone ? decodeURIComponent(order.Date_ProductionDone) : null,
                        order.Cn_sts_HoldOrder ? parseFloat(decodeURIComponent(order.Cn_sts_HoldOrder)) : null,
                        hmacValue,
                        new Date().toISOString(), // updated_at
                        order.ExtOrderID ? decodeURIComponent(order.ExtOrderID) : null,
                        order.ExtSource ? decodeURIComponent(order.ExtSource) : null,
                        order.Id_CustomerInternal ? parseInt(decodeURIComponent(order.Id_CustomerInternal)) : null,
                        order.ID_Order ? parseInt(decodeURIComponent(order.ID_Order)) : null
                    ];
    
                    if (updateValues.length !== 41) {
                        console.error(`Mismatch: Expected 41 values but got ${updateValues.length}`);
                    }
    
                    batchQueries.push({ query: updateQuery, values: updateValues });
                }
            }
    
            for (const { query, values } of batchQueries) {
                console.log(`Executing query: ${query}`);
                console.log(`Values: ${JSON.stringify(values)}`);
                await dbConnection.query(query, values);
            }
    
            await dbConnection.commit();
    
            responseBody = JSON.stringify({ status: 'success' });
    
            console.log("==========  Duration  ==========");
            console.log(`Operation took ${Date.now() - start}ms`);
    
        } catch (error) {
            console.error('Error during database operation:', error);
    
            if (dbConnection) {
                await dbConnection.rollback();
            }
    
            responseBody = JSON.stringify({ status: 'error', message: error.message });
        } finally {
            if (dbConnection) {
                dbConnection.close();
            }
        }
    
        return responseBody;
    }
    


    async selectIdFromOrdersTable(dbConnection, order_no, customerInternalId) {
        let orderId = null;
    
        const selectSQL = 'SELECT id FROM orders WHERE order_no = ? AND customer_internal_id = ?';
    
        try {
            const [rows] = await dbConnection.execute(selectSQL[order_no, customerInternalId]);
    
            if (rows.length > 0) {
                orderId = rows[0].id;
            }
        } catch (e) {
            console.log(`=== got exception while retrieving id from orders table for order id: ${order_no}`);
        } finally {
            if (dbConnection) {
                await dbConnection.close();
            }
        }
    
        return orderId;
    }

    async selectRecordsFromProductsTable(orderId, dbConnection, product_no, customerInternalId) {
        let productId = null;
    
        try {
            const selectSQL = "SELECT id FROM products WHERE order_id = ? AND product_no = ? AND customer_internal_id = ?";
            const [rows] = await dbConnection.execute(selectSQL, [orderId, product_no, customerInternalId]);
    
            if (rows.length > 0) {
                productId = rows[0].id;
            }
    
        } catch (error) {
            console.error(`=== got exception while retrieving id from products table for order id: ${orderId} ===`, error.message);
        }
    
        return productId;
    }

    async desQuery(dbConnection, currentTime, orderId, design, order) {
        console.log("================  inside desQuery method ================");
        let responseBody = "";
        const queries = [];
        const params = [];
    
        try {
            console.log("============= Designs ===================");
    
            if (design && design.action) {
                const customerInternalId = order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null;
                const order_no = design.id_Order ? parseInt(decodeURIComponent(design.id_Order)) : null;
    
                if (!orderId) {
                    orderId = await this.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
                }
    
                if (design.action === ACTIONS.ADD) {
                    console.log("============= Inside Insert section ===================");
    
                    const designsInsertQuery = `
                        INSERT INTO designs (
                            color_total, name, design_no, type_id, location, serial,
                            format, stitches_total, order_id, created_at, updated_at,
                            customer_internal_id, design_image_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    params.push([
                        design.colorsTotal ? parseFloat(decodeURIComponent(design.colorsTotal)) : null,
                        decodeURIComponent(design.designName),
                        design.id_Design ? parseFloat(decodeURIComponent(design.id_Design)) : null,
                        design.id_DesignType ? parseInt(decodeURIComponent(design.id_DesignType)) : null,
                        decodeURIComponent(design.location),
                        decodeURIComponent(design.ID_Serial),
                        decodeURIComponent(design.id_DesignFormat),
                        design.stitchesTotal ? parseFloat(decodeURIComponent(design.stitchesTotal)) : null,
                        orderId,
                        currentTime || null,
                        currentTime || null,
                        customerInternalId,
                        design.id_OrderDesLoc ? parseInt(decodeURIComponent(design.id_OrderDesLoc)) : null
                    ]);
                    queries.push(designsInsertQuery);
                    
                    console.log("=============== Record has been added to batch! ==================");
    
                } else if (design.action === ACTIONS.UPDATE) {
                    console.log("============= Inside Update Section ===================");
    
                    const designsUpdateQuery = `
                        UPDATE designs SET 
                            color_total = ?, name = ?, design_no = ?, type_id = ?, location = ?, 
                            serial = ?, format = ?, stitches_total = ?, order_id = ?, updated_at = ?, design_image_id = ?
                        WHERE 
                            order_id = ? AND design_image_id = ? AND customer_internal_id = ?
                    `;
                    params.push([
                        design.colorsTotal ? parseFloat(decodeURIComponent(design.colorsTotal)) : null,
                        decodeURIComponent(design.designName),
                        design.id_Design ? parseFloat(decodeURIComponent(design.id_Design)) : null,
                        design.id_DesignType ? parseInt(decodeURIComponent(design.id_DesignType)) : null,
                        decodeURIComponent(design.location),
                        decodeURIComponent(design.ID_Serial),
                        decodeURIComponent(design.id_DesignFormat),
                        design.stitchesTotal ? parseFloat(decodeURIComponent(design.stitchesTotal)) : null,
                        orderId,
                        currentTime || null,
                        design.id_OrderDesLoc ? parseInt(decodeURIComponent(design.id_OrderDesLoc)) : null,
                        orderId,
                        design.id_OrderDesLoc ? parseInt(decodeURIComponent(design.id_OrderDesLoc)) : null,
                        customerInternalId
                    ]);
                    queries.push(designsUpdateQuery);
    
                    console.log("=============== Record has been updated to batch! ==================");
    
                } else if (design.action === ACTIONS.DELETE) {
                    console.log("============= Inside Delete Section ===================");
    
                    const designsDeleteQuery = `
                        DELETE FROM designs WHERE order_id = ? AND customer_internal_id = ? AND design_no = ?
                    `;
                    params.push([
                        orderId,
                        customerInternalId,
                        design.id_Design ? parseFloat(decodeURIComponent(design.id_Design)) : null
                    ]);
                    queries.push(designsDeleteQuery);
    
                    console.log("=============== Record has been deleted from batch! ==================");
    
                }
    
                // Execute batched queries
                if (queries.length > 0) {
                    const transaction = await dbConnection.beginTransaction();
    
                    try {
                        for (let i = 0; i < queries.length; i++) {
                            const [query] = queries[i];
                            const [paramsList] = params[i];
                            await dbConnection.execute(query, paramsList);
                        }
    
                        await transaction.commit();
                    } catch (e) {
                        await transaction.rollback();
                        responseBody = `\nFailed to execute batch operations. Due to exception: ${e.message}`;
                        console.error("============ got exception during batch execution: ", e.message, " =======================");
                    }
                }
    
            }
        } catch (e) {
            responseBody = `\nFailed to save data into designs table. Due to exception: ${e.message}`;
            console.error("============ got exception inside designs table: ", e.message, " =======================");
        } finally {
            if (dbConnection) {
                try {
                    await dbConnection.close();
                } catch (e) {
                    console.error("============ got exception while closing db connection: ", e.message, " =======================");
                }
            }
        }
    
        return responseBody;
    }    

    async paymentQuery(dbConnection, currentTime, orderId, pay, order) {
        console.log("================  inside paymentQuery method ================");
        let responseBody = "";
        let paymentsPreparedStmt = null;
    
        try {
            console.log("============= payment types ===================");
    
            if (pay && pay.action) {
                const customerInternalId = order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null;
                const id_paymentType = parseFloat(decodeURIComponent(pay.id_PaymentType));
                const paymentId = await this.selectRecordsFromOrderPaymentTable(id_paymentType, dbConnection);
                const order_no = pay.id_Order ? parseInt(decodeURIComponent(pay.id_Order)) : null;
    
                if (!orderId) {
                    orderId = await this.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
                }
    
                // Prepare statements for batch execution
                const batchStatements = [];
                const batchValues = [];
    
                if (pay.action === ACTIONS.ADD) {
                    const paymentsInsertQuery = `
                        INSERT INTO payments (
                            sub_payment, type, number, date_applied, sub_payment_no, order_id, 
                            payment_type_id, created_at, updated_at, customer_internal_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    batchStatements.push(paymentsInsertQuery);
                    batchValues.push([
                        pay.cur_SubPayment ? parseFloat(decodeURIComponent(pay.cur_SubPayment)) : null,
                        decodeURIComponent(pay.paymentType).substring(0, 30), // Abbreviate
                        decodeURIComponent(pay.paymentNumber),
                        decodeURIComponent(pay.date_Applied),
                        pay.ID_SubPayment ? parseInt(decodeURIComponent(pay.ID_SubPayment)) : null,
                        orderId,
                        paymentId,
                        currentTime || null,
                        currentTime || null,
                        customerInternalId
                    ]);
                }
    
                if (pay.action === ACTIONS.UPDATE) {
                    const paymentsUpdateQuery = `
                        UPDATE payments SET 
                            sub_payment = ?, type = ?, number = ?, date_applied = ?, sub_payment_no = ?, 
                            order_id = ?, payment_type_id = ?, updated_at = ? 
                        WHERE 
                            order_id = ? AND sub_payment_no = ? AND customer_internal_id = ?
                    `;
                    batchStatements.push(paymentsUpdateQuery);
                    batchValues.push([
                        pay.cur_SubPayment ? parseFloat(decodeURIComponent(pay.cur_SubPayment)) : null,
                        decodeURIComponent(pay.paymentType).substring(0, 30), // Abbreviate
                        decodeURIComponent(pay.paymentNumber),
                        decodeURIComponent(pay.date_Applied),
                        pay.ID_SubPayment ? parseInt(decodeURIComponent(pay.ID_SubPayment)) : null,
                        orderId,
                        paymentId,
                        currentTime || null,
                        orderId,
                        pay.ID_SubPayment ? parseInt(decodeURIComponent(pay.ID_SubPayment)) : null,
                        customerInternalId
                    ]);
                }
    
                if (pay.action === ACTIONS.DELETE) {
                    const paymentsDeleteQuery = `
                        DELETE FROM payments 
                        WHERE order_id = ? AND customer_internal_id = ? AND sub_payment_no = ?
                    `;
                    batchStatements.push(paymentsDeleteQuery);
                    batchValues.push([
                        orderId,
                        customerInternalId,
                        pay.cur_SubPayment ? parseFloat(decodeURIComponent(pay.cur_SubPayment)) : null
                    ]);
                }
    
                // Execute batch
                if (batchStatements.length > 0) {
                    for (let i = 0; i < batchStatements.length; i++) {
                        paymentsPreparedStmt = await dbConnection.prepare(batchStatements[i]);
                        await paymentsPreparedStmt.execute(batchValues[i]);
                    }
                }
    
                console.log("=============== Record has been processed in payments table! ==================");
            }
        } catch (e) {
            responseBody = `\nFailed to save data into payments table. Due to exception: ${e.message}`;
            console.error("============ got exception inside payments table: ", e.message, " =======================");
        } finally {
            if (dbConnection) {
                await dbConnection.close();
            }
        }
    
        return responseBody;
    }    

    async orderAttributeInsertUpdateQuery(orderAttr, dbConnection, currentTime, orderId, order, jsonQueryString) {
        console.log("================  inside orderAttributeInsertUpdateQuery method ================");
        let responseBody = "";
        let result = null;
        let odrAttPreparedStmt = null;
    
        try {
            console.log("============= Order Attribute ===================");
    
            if (order && order.action) {
                const customerInternalId = order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null;
                const order_no = order.id_Order ? parseInt(decodeURIComponent(order.id_Order)) : null;
    
                if (orderId === null) {
                    orderId = await this.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
                }
    
                if (order.action === ACTIONS.ADD) {
                    const orderAttributeInsertQuery = `
                        INSERT INTO order_attribute (order_id, attribute, value, created_at, updated_at, customer_internal_id) 
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;
    
                    odrAttPreparedStmt = await dbConnection.prepare(orderAttributeInsertQuery);
    
                    for (let cnt = 0; cnt < orderAttr.length; cnt++) {
                        let temp = null;
                        try {
                            temp = decodeURIComponent(
                                jsonQueryString.order[
                                    decodeURIComponent(order.id_Order)
                                ].order[orderAttr[cnt]]
                            );
    
                            odrAttPreparedStmt.setObject(1, orderId);
                            odrAttPreparedStmt.setString(2, orderAttr[cnt]);
                            odrAttPreparedStmt.setString(3, temp || null);
                            odrAttPreparedStmt.setString(4, currentTime || null);
                            odrAttPreparedStmt.setString(5, currentTime || null);
                            odrAttPreparedStmt.setObject(6, customerInternalId);
                            odrAttPreparedStmt.addBatch();
                        } catch (e) {
                            console.log(`==== No value for key: ${orderAttr[cnt]} ==== ex: ${e.message}`);
                        }
                    }
    
                    result = await odrAttPreparedStmt.executeBatch();
                    console.log("=============== Records are inserted into order_attribute table! ==================");
                }
    
                if (order.action === ACTIONS.UPDATE) {
                    const orderAttributeUpdateQuery = `
                        UPDATE order_attribute 
                        SET value = ?, updated_at = ? 
                        WHERE order_id = ? AND customer_internal_id = ? AND attribute = ?
                    `;
    
                    odrAttPreparedStmt = await dbConnection.prepare(orderAttributeUpdateQuery);
    
                    for (let cnt = 0; cnt < orderAttr.length; cnt++) {
                        let temp = null;
                        try {
                            temp = decodeURIComponent(
                                jsonQueryString.order[
                                    decodeURIComponent(order.id_Order)
                                ].order[orderAttr[cnt]]
                            );
    
                            odrAttPreparedStmt.setString(1, temp || null);
                            odrAttPreparedStmt.setString(2, currentTime || null);
                            odrAttPreparedStmt.setObject(3, orderId);
                            odrAttPreparedStmt.setObject(4, customerInternalId);
                            odrAttPreparedStmt.setString(5, orderAttr[cnt]);
                            odrAttPreparedStmt.addBatch();
                        } catch (e) {
                            console.log(`==== No value for key: ${orderAttr[cnt]} ==== ex: ${e.message}`);
                        }
                    }
    
                    result = await odrAttPreparedStmt.executeBatch();
                    console.log("=============== Records have been updated in order_attribute table! ==================");
                }
    
                if (order.action === ACTIONS.DELETE) {
                    const orderAttributeDeleteQuery = `
                        DELETE FROM order_attribute 
                        WHERE order_id = ? AND customer_internal_id = ?
                    `;
    
                    odrAttPreparedStmt = await dbConnection.prepare(orderAttributeDeleteQuery);
    
                    odrAttPreparedStmt.setObject(1, orderId);
                    odrAttPreparedStmt.setObject(2, customerInternalId);
                    odrAttPreparedStmt.addBatch();
    
                    result = await odrAttPreparedStmt.executeBatch();
                    console.log("=============== Records have been deleted from order_attribute table! ==================");
                }
            }
        } catch (e) {
            responseBody = `\nFailed to save data into order_attribute table. Due to exception: ${e.message}`;
            console.error(`============ got exception while saving data for order_attributes table: ${e.message} =======================`);
        } finally {
            if (odrAttPreparedStmt) {
                await odrAttPreparedStmt.close();
            }
        }
    
        return responseBody;
    }    

    async orderContactInsertQuery(dbConnection, currentTime, orderId, order) {
        console.log("================  inside orderContactInsertQuery method ================");
        let responseBody = "";
        let result = null;
        let odrContactPreparedStmt = null;
    
        try {
            console.log("============= Order Contact ===================");
    
            if (order && order.action) {
                const customerInternalId = order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null;
                const order_no = order.id_Order ? parseInt(decodeURIComponent(order.id_Order)) : null;
    
                if (orderId === null) {
                    orderId = await this.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
                }
    
                // Insert
                if (order.action === ACTIONS.ADD) {
                    const orderContactInsertQuery = `
                        INSERT INTO order_contact (company_name, first_name, last_name, email, fax, phone, title, department, order_id, created_at, updated_at, customer_internal_id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
    
                    odrContactPreparedStmt = await dbConnection.prepare(orderContactInsertQuery);
                    await odrContactPreparedStmt.addBatch([
                        decodeURIComponent(order.companyName),
                        decodeURIComponent(order.contactFirst),
                        decodeURIComponent(order.contactLast),
                        decodeURIComponent(order.contactEmail),
                        decodeURIComponent(order.contactFax),
                        decodeURIComponent(order.contactPhone),
                        decodeURIComponent(order.contactTitle),
                        decodeURIComponent(order.contactDepartment),
                        orderId,
                        currentTime || null,
                        currentTime || null,
                        customerInternalId
                    ]);
    
                    result = await odrContactPreparedStmt.executeBatch();
                    console.log("=============== Records are inserted into order_contact table! ==================");
                }
    
                // Update
                if (order.action === ACTIONS.UPDATE) {
                    const orderContactUpdateQuery = `
                        UPDATE order_contact 
                        SET company_name = ?, first_name = ?, last_name = ?, email = ?, fax = ?, phone = ?, title = ?, department = ?, order_id = ?, updated_at = ?
                        WHERE order_id = ? AND customer_internal_id = ?
                    `;
    
                    odrContactPreparedStmt = await dbConnection.prepare(orderContactUpdateQuery);
                    await odrContactPreparedStmt.addBatch([
                        decodeURIComponent(order.companyName),
                        decodeURIComponent(order.contactFirst),
                        decodeURIComponent(order.contactLast),
                        decodeURIComponent(order.contactEmail),
                        decodeURIComponent(order.contactFax),
                        decodeURIComponent(order.contactPhone),
                        decodeURIComponent(order.contactTitle),
                        decodeURIComponent(order.contactDepartment),
                        orderId,
                        currentTime || null,
                        orderId,
                        customerInternalId
                    ]);
    
                    result = await odrContactPreparedStmt.executeBatch();
                    console.log("=============== Records have been updated in order_contact table! ==================");
                }
    
                // Delete
                if (order.action === ACTIONS.DELETE) {
                    const orderContactDeleteQuery = `
                        DELETE FROM order_contact 
                        WHERE order_id = ? AND customer_internal_id = ?
                    `;
    
                    odrContactPreparedStmt = await dbConnection.prepare(orderContactDeleteQuery);
                    await odrContactPreparedStmt.addBatch([
                        orderId,
                        customerInternalId
                    ]);
    
                    result = await odrContactPreparedStmt.executeBatch();
                    console.log("=============== Records have been deleted from order_contact table! ==================");
                }
            }
        } catch (e) {
            responseBody = `\nFailed to save data into order_contact table. Due to exception: ${e.message}`;
            console.error(`============ got exception while saving data for order_contact table: ${e.message} =======================`);
        } finally {
            if (odrContactPreparedStmt) {
                await odrContactPreparedStmt.close();
            }
        }
    
        return responseBody;
    }    

    async orderShippingInsertOrUpdateQuery(dbConnection, currentTime, orderId, addr, order) {
        console.log("================  inside orderShippingInsertOrUpdateQuery method ================");
        let responseBody = "";
        let odrShippingPreparedStmt = null;
    
        try {
            console.log("============= Order Shipping ===================");
    
            if (addr && addr.action) {
                const customerInternalId = addr.id_CustomerInternal ? parseInt(decodeURIComponent(addr.id_CustomerInternal)) : null;
                const order_no = addr.id_Order ? parseInt(decodeURIComponent(addr.id_Order)) : null;
    
                if (orderId == null) {
                    orderId = await this.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
                }
    
                if (addr.action === ACTIONS.ADD) {
                    console.log("============= Inside Insert Section ===================");
    
                    const orderShippingInsertQuery = `
                        INSERT INTO order_shipping (address1, address2, city, company_address, country, state, zip, shipping_no, key_alpha, 
                        shipping_method, order_id, created_at, updated_at, customer_internal_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
    
                    odrShippingPreparedStmt = await dbConnection.prepare(orderShippingInsertQuery);
                    await odrShippingPreparedStmt.addBatch([
                        decodeURIComponent(addr.address1),
                        decodeURIComponent(addr.address2),
                        decodeURIComponent(addr.addressCity),
                        decodeURIComponent(addr.addressCompany),
                        decodeURIComponent(addr.addressCountry),
                        decodeURIComponent(addr.addressState),
                        decodeURIComponent(addr.addressZip),
                        addr.id_Address ? parseInt(decodeURIComponent(addr.id_Address)) : null,
                        decodeURIComponent(addr.id_OrderKeyAlpha),
                        decodeURIComponent(addr.shipMethod),
                        orderId,
                        currentTime || null,
                        currentTime || null,
                        customerInternalId
                    ]);
    
                    // Execute the batch
                    await odrShippingPreparedStmt.executeBatch();
                    console.log("=============== Records have been inserted successfully into order_shipping. ==================");
                }
    
                if (addr.action === ACTIONS.UPDATE) {
                    console.log("============= Inside Update Section ===================");
    
                    const orderShippingUpdateQuery = `
                        UPDATE order_shipping SET address1 = ?, address2 = ?, city = ?, company_address = ?, country = ?, state = ?, 
                        zip = ?, shipping_no = ?, key_alpha = ?, shipping_method = ?, updated_at = ? 
                        WHERE order_id = ? AND customer_internal_id = ? AND shipping_no = ?
                    `;
    
                    odrShippingPreparedStmt = await dbConnection.prepare(orderShippingUpdateQuery);
                    await odrShippingPreparedStmt.addBatch([
                        decodeURIComponent(addr.address1),
                        decodeURIComponent(addr.address2),
                        decodeURIComponent(addr.addressCity),
                        decodeURIComponent(addr.addressCompany),
                        decodeURIComponent(addr.addressCountry),
                        decodeURIComponent(addr.addressState),
                        decodeURIComponent(addr.addressZip),
                        addr.id_Address ? parseInt(decodeURIComponent(addr.id_Address)) : null,
                        decodeURIComponent(addr.id_OrderKeyAlpha),
                        decodeURIComponent(addr.shipMethod),
                        currentTime || null,
                        orderId,
                        customerInternalId,
                        addr.id_Address ? parseInt(decodeURIComponent(addr.id_Address)) : null
                    ]);
    
                    // Execute the batch
                    await odrShippingPreparedStmt.executeBatch();
                    console.log("=============== Records have been updated successfully in order_shipping. ==================");
                }
    
                if (addr.action === ACTIONS.DELETE) {
                    console.log("============= Inside Delete Section ===================");
    
                    const orderShippingDeleteQuery = `
                        DELETE FROM order_shipping WHERE order_id = ? AND customer_internal_id = ? AND shipping_no = ?
                    `;
    
                    odrShippingPreparedStmt = await dbConnection.prepare(orderShippingDeleteQuery);
                    await odrShippingPreparedStmt.addBatch([
                        orderId,
                        customerInternalId,
                        addr.id_Address ? parseInt(decodeURIComponent(addr.id_Address)) : null
                    ]);
    
                    // Execute the batch
                    await odrShippingPreparedStmt.executeBatch();
                    console.log("=============== Records have been deleted successfully from order_shipping. ==================");
                }
            }
    
        } catch (e) {
            responseBody += `\nFailed to save data into order_shipping table. Due to exception: ${e.message}`;
            console.error(`============ got exception while saving data for order_shipping table: ${e.message} =======================`);
        } finally {
            if (odrShippingPreparedStmt) {
                await odrShippingPreparedStmt.close();
            }
        }
    
        return responseBody;
    }

    async selectRecordsFromOrderPaymentTable(id_PaymentType, dbConnection) {
        let paymentId = null;
    
        try {
            const selectSQL = "SELECT id FROM payment_types WHERE CAST(payment_type_no AS DECIMAL(5,1)) = ?";
            const [rows] = await dbConnection.execute(selectSQL, [id_PaymentType]);
    
            if (rows.length > 0) {
                paymentId = rows[0].id;
            }
    
        } catch (error) {
            console.error(`=== got exception while retrieving payment_types table for payment_type_no: ${id_PaymentType} ===`, error.message);
        }
    
        return paymentId;
    }

    async getKeyName(json) {
        let keyname = null;
        const order = json.order;
    
        if (order && Object.keys(order).length > 0) {
            keyname = Object.keys(order)[0];
        }
    
        return keyname;
    }

    async getorderInstance(json){
        const ordersList = [];
        console.log("======= JSON : ==== \n", json);
        const superkeys = Object.keys(json.order);
        console.log("======= Superkeys : ==== \n", superkeys);
        
        superkeys.forEach(orderId => { // Add opening curly brace
            const jsonOrderId = json.order[orderId];
            const keys = Object.keys(jsonOrderId);
            console.log("======= Keys : ==== \n", keys);
            const orderInstance = new Orders();
            
            keys.forEach(key => {
                if (key === 'des') {
                    const innerKeys = Object.keys(jsonOrderId[key]);
                    innerKeys.forEach(innerKey => {
                        try {
                            const des = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                            orderInstance.getDes().push(new Designs(des));
                        } catch (e) {
                            console.error("Error parsing JSON for order des section", e.message);
                        }
                    });
                }
    
                if (key === 'pay') {
                    const innerKeys = Object.keys(jsonOrderId[key]);
                    innerKeys.forEach(innerKey => {
                        try {
                            const pay = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                            orderInstance.getPay().push(new Payment(pay));
                        } catch (e) {
                            console.error("Error parsing JSON for order pay section", e.message);
                        }
                    });
                }
    
                if (key === 'lineoe') {
                    const innerKeys = Object.keys(jsonOrderId[key]);
                    innerKeys.forEach(innerKey => {
                        try {
                            const lineoe = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                            lineoe.index = innerKey;
                            orderInstance.getLineoe().push(new LineOeProduct(lineoe));
                        } catch (e) {
                            console.error("Error parsing JSON for order product section", e.message);
                        }
                    });
                }
    
                if (key === 'order') {
                    try {
                        const order = JSON.parse(JSON.stringify(jsonOrderId[key]));
                        orderInstance.setOrder(new Order(order));
                    } catch (e) {
                        console.error("Error parsing JSON for order section", e.message);
                    }
                }
    
                if (key === 'addr') {
                    const innerKeys = Object.keys(jsonOrderId[key]);
                    innerKeys.forEach(innerKey => {
                        try {
                            const addr = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                            orderInstance.getShipping().push(new Shipping(addr));
                        } catch (e) {
                            console.error("Error parsing JSON for address section", e.message);
                        }
                    });
                }
    
                if (key === 'track') {
                    const innerKeys = Object.keys(jsonOrderId[key]);
                    innerKeys.forEach(innerKey => {
                        try {
                            const track = JSON.parse(JSON.stringify(jsonOrderId[key][innerKey]));
                            console.log("======= Track : ==== \n", track);
                            orderInstance.getTracking().push(new Tracking(track));
                        } catch (e) {
                            console.error("Error parsing JSON for tracking section", e.message);
                        }
                    });
                }
            });
            
            ordersList.push(orderInstance);
            console.debug("======= Order Instance : ==== \n", orderInstance);
        });
    
        return ordersList;
    }

    async orderTrackingInsertOrUpdateOrDeleteQuery(dbConnection, currentTime, orderId, track, order) {
        console.debug("================  inside orderTrackingInsertOrUpdateOrDeleteQuery method ================");
        let responseBody = "";
        
        let ordTrackingPreparedStmt = null;
    
        try {
            console.debug("============= Order Tracking ===================");
    
            if (track && track.action) {
                const customerInternalId = order.id_CustomerInternal 
                    ? parseInt(decodeURIComponent(order.id_CustomerInternal)) 
                    : null;
                const orderNo = track.id_Order 
                    ? parseInt(decodeURIComponent(track.id_Order)) 
                    : null;
    
                if (!orderId) {
                    orderId = await this.selectIdFromOrdersTable(dbConnection, orderNo, customerInternalId);
                }
    
                if (track.action === ACTIONS.ADD) {
                    console.debug("============= Inside Insert Section ===================");
    
                    const orderTrackingInsertQuery = `
                        INSERT INTO order_tracking 
                        (address1, address2, city, company_address, country, state, zip, pack_import, tracking_number, order_id, created_at, updated_at, customer_internal_id, order_no, date_Creation, date_Imported, Weight, Cost, Type) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
                    const values = [
                        decodeURIComponent(track.address1),
                        decodeURIComponent(track.address2),
                        decodeURIComponent(track.addressCity),
                        decodeURIComponent(track.addressCompany),
                        decodeURIComponent(track.addressCountry),
                        decodeURIComponent(track.addressState),
                        decodeURIComponent(track.addressZip),
                        decodeURIComponent(track.ID_PackImport),
                        decodeURIComponent(track.trackingNumber),
                        orderId,
                        currentTime || null,
                        currentTime || null,
                        customerInternalId,
                        decodeURIComponent(track.id_Order),
                        track.date_Creation ? Util.convertStringDateToFormat(decodeURIComponent(track.date_Creation)) : null,
                        track.date_Imported ? Util.convertStringDateToFormat(decodeURIComponent(track.date_Imported)) : null,
                        track.weight ? parseFloat(decodeURIComponent(track.weight)) : 0,
                        track.cost ? parseFloat(decodeURIComponent(track.cost)) : 0,
                        track.type ? decodeURIComponent(track.type) : null
                    ];
    
                    ordTrackingPreparedStmt = await dbConnection.prepareStatement(orderTrackingInsertQuery);
                    ordTrackingPreparedStmt.addBatch(values);
                    await ordTrackingPreparedStmt.executeBatch();
    
                } else if (track.action === ACTIONS.UPDATE) {
                    console.debug("============= Inside Update Section ===================");
    
                    const orderTrackingUpdateQuery = `
                        UPDATE order_tracking 
                        SET address1 = ?, address2 = ?, city = ?, company_address = ?, country = ?, state = ?, zip = ?, pack_import = ?, tracking_number = ?, order_id = ?, updated_at = ?, order_no = ?, date_Creation = ?, date_Imported = ?, Weight = ?, Cost = ?, Type = ?
                        WHERE order_id = ? AND pack_import = ? AND customer_internal_id = ?`;
    
                    const values = [
                        decodeURIComponent(track.address1),
                        decodeURIComponent(track.address2),
                        decodeURIComponent(track.addressCity),
                        decodeURIComponent(track.addressCompany),
                        decodeURIComponent(track.addressCountry),
                        decodeURIComponent(track.addressState),
                        decodeURIComponent(track.addressZip),
                        decodeURIComponent(track.ID_PackImport),
                        decodeURIComponent(track.trackingNumber),
                        orderId,
                        currentTime || null,
                        decodeURIComponent(track.id_Order),
                        track.date_Creation ? Util.convertStringDateToFormat(decodeURIComponent(track.date_Creation)) : null,
                        track.date_Imported ? Util.convertStringDateToFormat(decodeURIComponent(track.date_Imported)) : null,
                        track.weight ? parseFloat(decodeURIComponent(track.weight)) : 0,
                        track.cost ? parseFloat(decodeURIComponent(track.cost)) : 0,
                        track.type ? decodeURIComponent(track.type) : null,
                        orderId,
                        decodeURIComponent(track.ID_PackImport),
                        customerInternalId
                    ];
    
                    ordTrackingPreparedStmt = await dbConnection.prepareStatement(orderTrackingUpdateQuery);
                    ordTrackingPreparedStmt.addBatch(values);
                    await ordTrackingPreparedStmt.executeBatch();
    
                } else if (track.action === ACTIONS.DELETE) {
                    console.debug("============= Inside Delete Section ===================");
    
                    const orderTrackingDeleteQuery = `
                        DELETE FROM order_tracking 
                        WHERE order_id = ? AND pack_import = ? AND customer_internal_id = ?`;
    
                    const values = [
                        orderId,
                        decodeURIComponent(track.ID_PackImport),
                        customerInternalId
                    ];
    
                    ordTrackingPreparedStmt = await dbConnection.prepareStatement(orderTrackingDeleteQuery);
                    ordTrackingPreparedStmt.addBatch(values);
                    await ordTrackingPreparedStmt.executeBatch();
                }
            }
    
        } catch (error) {
            responseBody = `\nFailed to save data into order_tracking table. Due to exception: ${error.message}`;
            console.error("============ got exception while saving data for order_tracking table: ", error.message, " =======================");
            console.error(error.stack);
    
        } finally {
            if (ordTrackingPreparedStmt) {
                await ordTrackingPreparedStmt.close();
            }
        }
        
        return responseBody;
    }

    async productQuery(dbConnection, currentTime, orderId, product, order, index, jsonQueryString) {
        console.log("================  inside productQuery method ================ " + product.ID_LineOE);
        let responseBody = "";
        let productId = null;
    
        try {
            console.log("============= Products ===================");
    
            const customerInternalId = order.id_CustomerInternal ? parseInt(decodeURIComponent(order.id_CustomerInternal)) : null;
            const order_no = product.id_Order ? parseInt(decodeURIComponent(product.id_Order)) : null;
    
            if (orderId === null) {
                orderId = await this.selectIdFromOrdersTable(dbConnection, order_no, customerInternalId);
            }
    
            if (product && product.action) {
                if (product.action === ACTIONS.ADD) {
                    console.log("============= Inside Insert section ===================");
    
                    const productsInsertQuery = `
                        INSERT INTO products (quantity, price, product_no, unit_price, sort_order, order_id, name, created_at, updated_at, customer_internal_id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
                    const [result] = await dbConnection.execute(productsInsertQuery, [
                        product.cn_LineQuantity_Current ? parseFloat(decodeURIComponent(product.cn_LineQuantity_Current)) : null,
                        product.cnCur_LinePrice_Current ? parseFloat(decodeURIComponent(product.cnCur_LinePrice_Current)) : null,
                        product.ID_LineOE ? parseInt(decodeURIComponent(product.ID_LineOE)) : null,
                        product.cnCur_UnitPriceUsed ? parseFloat(decodeURIComponent(product.cnCur_UnitPriceUsed).replace(',', '')) : null,
                        product.sortMaster ? parseFloat(decodeURIComponent(product.sortMaster)) : null,
                        orderId,
                        `${decodeURIComponent(product.nameFirst)} ${decodeURIComponent(product.nameLast)}`,
                        currentTime || null,
                        currentTime || null,
                        customerInternalId
                    ]);
    
                    productId = result.insertId;
    
                    if (productId !== null) {
                        const productAttr = Attributes.productAttr;
                        const productAttrInsertQuery = `
                            INSERT INTO product_attribute (product_id, attribute, value, created_at, updated_at, customer_internal_id)
                            VALUES (?, ?, ?, ?, ?, ?)`;
    
                        for (const attr of productAttr) {
                            try {
                                const temp = decodeURIComponent(jsonQueryString.order[product.id_Order].lineoe[index][attr]) || null;
    
                                await dbConnection.execute(productAttrInsertQuery, [
                                    productId,
                                    attr,
                                    temp,
                                    currentTime || null,
                                    currentTime || null,
                                    customerInternalId
                                ]);
                            } catch (e) {
                                console.error(`==== No value for index : ${index} and key : ${attr} ==== ex: ${e.message}`);
                            }
                        }
                    }
    
                    console.log("=============== Record has been inserted to Products table! ==================");
    
                } else if (product.action === ACTIONS.UPDATE) {
                    console.log("============= Inside Update Section ===================");
    
                    const product_no = product.ID_LineOE ? parseInt(decodeURIComponent(product.ID_LineOE)) : null;
                    const product_Id = await this.selectRecordsFromProductsTable(orderId, dbConnection, product_no, customerInternalId);
    
                    if (product_Id !== null) {
                        const productsUpdateQuery = `
                            UPDATE products
                            SET quantity = ?, price = ?, product_no = ?, unit_price = ?, sort_order = ?, order_id = ?, name = ?, updated_at = ?, customer_internal_id = ?
                            WHERE id = ?`;
    
                        await dbConnection.execute(productsUpdateQuery, [
                            product.cn_LineQuantity_Current ? parseFloat(decodeURIComponent(product.cn_LineQuantity_Current)) : null,
                            product.cnCur_LinePrice_Current ? parseFloat(decodeURIComponent(product.cnCur_LinePrice_Current)) : null,
                            product.ID_LineOE ? parseInt(decodeURIComponent(product.ID_LineOE)) : null,
                            product.cnCur_UnitPriceUsed ? parseFloat(decodeURIComponent(product.cnCur_UnitPriceUsed)) : null,
                            product.sortMaster ? parseFloat(decodeURIComponent(product.sortMaster)) : null,
                            orderId,
                            `${decodeURIComponent(product.nameFirst)} ${decodeURIComponent(product.nameLast)}`,
                            currentTime || null,
                            customerInternalId,
                            product_Id
                        ]);
    
                        const productAttr = Attributes.productAttr;
                        const productAttrUpdateQuery = `
                            UPDATE product_attribute
                            SET value = ?, updated_at = ?
                            WHERE attribute = ? AND product_id = ? AND customer_internal_id = ?`;
    
                        for (const attr of productAttr) {
                            try {
                                const temp = decodeURIComponent(jsonQueryString.order[product.id_Order].lineoe[index][attr]) || null;
    
                                await dbConnection.execute(productAttrUpdateQuery, [
                                    temp,
                                    currentTime || null,
                                    attr,
                                    product_Id,
                                    customerInternalId
                                ]);
                            } catch (e) {
                                console.error(`==== No value for index : ${index} and key : ${attr} ==== ex: ${e.message}`);
                            }
                        }
    
                        console.log("=============== Record has been updated to Products table! ==================");
                    }
    
                } else if (product.action === ACTIONS.DELETE) {
                    console.log("============= Inside Delete Section ===================");
    
                    const product_no = product.ID_LineOE ? parseInt(decodeURIComponent(product.ID_LineOE)) : null;
                    const product_Id = await this.selectRecordsFromProductsTable(orderId, dbConnection, product_no, customerInternalId);
    
                    const productsDeleteQuery = `
                        DELETE FROM products WHERE order_id = ? AND product_no = ? AND customer_internal_id = ?`;
    
                    const productAttrDeleteQuery = `
                        DELETE FROM product_attribute WHERE product_id = ? AND customer_internal_id = ?`;
    
                    await dbConnection.execute(productsDeleteQuery, [
                        orderId,
                        product_no,
                        customerInternalId
                    ]);
    
                    if (product_Id !== null) {
                        await dbConnection.execute(productAttrDeleteQuery, [
                            product_Id,
                            customerInternalId
                        ]);
                    }
    
                    console.log("=============== Record deleted from Products table! ==================");
                }
            }
    
        } catch (e) {
            responseBody = `\nFailed to save data into Products table. Due to exception : ${e.message}`;
            console.error(`============ got exception inside Products table : ${e.message} ======================= \n`);
        }
    
        return responseBody;
    }    
}

exports.handler = async (event, context) => {
    const handler = new OrderHandler();
    return handler.handle(event, context);
};

module.exports = OrderHandler;