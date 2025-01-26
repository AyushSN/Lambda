const dbUtils = require('../../utils/dbUtils');
const { ACTIONS } = require('../../authHandler');
const { Util } = require('../../utils/util');
const axios = require('axios');
const Attributes = require('../models/attributes');


class EmpHandler {
    static POST_URL = "https://manageorders.com/get_crypt_password";
    static ROLE_EMP = 4;

    constructor(jsonQueryString) {
        this.jsonQueryString = jsonQueryString;
    }

    async handle(jsonQueryString) {
        return await this.processRequest(jsonQueryString);
    }


    async processRequest(jsonQueryString) {
        let dbConnection = null;
        let responseContent = "";

        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const empList = await this.getEmployeeList(jsonQueryString);
        dbConnection = await dbUtils.getConnection();

        try {
            for (const emp of empList) {
                const POST_PARAMS = `password=${Util.decodeCurrentString(emp.acs_OrdersLink_Password)}`;
                const cryptPassword = await this.sendPOST(EmpHandler.POST_URL, POST_PARAMS);

                if (emp.action) {
                    const userId = await this.selectQueryForUsersTable(emp, dbConnection);
                    if (emp.action === ACTIONS.ADD) {
                        responseContent += userId === null 
                            ? await this.insertQueryForUsers(emp, currentTime, cryptPassword, dbConnection) 
                            : await this.insertQueryForEmployees(emp, currentTime, userId, dbConnection);
                    } else if (emp.action === ACTIONS.UPDATE) {
                        responseContent += await this.updateQueryForUsers(emp, currentTime, cryptPassword, userId, dbConnection);
                        responseContent += await this.updateQueryForEmployees(emp, currentTime, dbConnection);
                        responseContent += await this.updateQueryForEmployeePermission(emp, currentTime, dbConnection);
                    } else if (emp.action === ACTIONS.DELETE) {
                        responseContent += await this.deleteQueryForEmployeePermission(emp, dbConnection);
                        responseContent += await this.deleteQueryForEmployees(emp, dbConnection);
                        responseContent += await this.deleteQueryForUsers(emp, dbConnection);
                    }
                }
            }
        } catch (error) {
            console.error(error);
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

    async insertQueryForUsers(emp, currentTime, cryptPassword, dbConnection) {
        const query = "INSERT INTO users SET password = ?, username = ?, unumber = ?, internal_id = ?, role_id = ?, created_at = ?, updated_at = ?";

        try {
            const [result] = await dbConnection.execute(query, [
                cryptPassword,
                Util.decodeCurrentString(emp.acs_OrdersLink_Username),
                emp.ID_Employee ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                emp.id_CustomerInternal ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null,
                EmpHandler.ROLE_EMP,
                currentTime,
                currentTime
            ]);

            const userId = result.insertId;
            return `\nRecords have been inserted successfully to users for employee id: ${emp.ID_Employee}` + 
                   await this.insertQueryForEmployees(emp, currentTime, userId, dbConnection);

        } catch (error) {
            console.error(`Failed to save data in users: ${error.message}`);
            return `\nFailed to save data in users: ${error.message}`;
        }
    }

    async updateQueryForUsers(emp, currentTime, cryptPassword, userId, dbConnection) {
        const query = "UPDATE users SET password = ?, username = ?, unumber = ?, internal_id = ?, role_id = ?, updated_at = ? WHERE id = ?";

        try {
            await dbConnection.execute(query, [
                cryptPassword,
                Util.decodeCurrentString(emp.acs_OrdersLink_Username),
                emp.ID_Employee ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                emp.id_CustomerInternal ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null,
                EmpHandler.ROLE_EMP,
                currentTime,
                userId
            ]);

            return `\nRecords have been updated successfully in users for employee id: ${emp.ID_Employee}`;

        } catch (error) {
            console.error(`Failed to update data in users: ${error.message}`);
            return `\nFailed to update data in users: ${error.message}`;
        }
    }

    async insertQueryForEmployees(emp, currentTime, userId, dbConnection) {
        const query = "INSERT INTO employees SET employee_no = ?, customer_internal_id = ?, first_name = ?, last_name = ?, full_name = ?, status = ?, user_id = ?, created_at = ?, updated_at = ?";

        try {
            const [result] = await dbConnection.execute(query, [
                emp.ID_Employee ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                emp.id_CustomerInternal ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null,
                Util.decodeCurrentString(emp.NameFirst),
                Util.decodeCurrentString(emp.NameLast),
                Util.decodeCurrentString(emp.ct_NameFull),
                emp.sts_Active ? parseInt(Util.decodeCurrentString(emp.sts_Active)) : null,
                userId,
                currentTime,
                currentTime
            ]);

            const empId = result.insertId;
            return `\nRecords have been inserted successfully to employees for employee id: ${emp.ID_Employee}` + 
                   await this.insertQueryForEmployeePermission(emp, currentTime, empId, dbConnection);

        } catch (error) {
            console.error(`Failed to save data in employees: ${error.message}`);
            return `\nFailed to save data in employees: ${error.message}`;
        }
    }

    async deleteQueryForEmployees(emp, dbConnection) {
        const query = "DELETE FROM employees WHERE employee_no = ? AND customer_internal_id = ?";
    
        try {
            const start = Date.now();
    
            await dbConnection.execute(query, [
                emp.ID_Employee ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                emp.id_CustomerInternal ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null
            ]);
    
            console.log("=============== Records deleted from employees table! ==================");
            console.log(`=============== Time Taken = ${Date.now() - start}ms ===============`);
    
            return `\nRecords have been deleted successfully from employees for employee id: ${emp.ID_Employee}`;
    
        } catch (error) {
            console.error(`Failed to delete data from employees: ${error.message}`);
            return `\nFailed to delete data from employees: ${error.message}`;
        }
    }
    

    async deleteQueryForEmployeePermission(emp, dbConnection) {
        console.log("==========  inside deleteQueryForEmployee_permission ==========");
        
        const query = `DELETE FROM employee_permission WHERE employee_no = ? AND customer_internal_id = ? AND attribute = ?`;
        let responseBody = "";
    
        try {
            const start = Date.now();
    
            // Prepare the parameters for the query
            const employeeNo = !Util.isBlank(emp.ID_Employee) ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null;
            const customerInternalId = !Util.isBlank(emp.id_CustomerInternal) ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null;
            const attribute = "acs_OrdersLink_cn_sts_Ready";
    
            // Execute the delete query
            const [result] = await dbConnection.execute(query, [employeeNo, customerInternalId, attribute]);
    
            console.log("=============== Records deleted from employee_permission table! ==================");
            console.log(`=============== Time Taken=${Date.now() - start} ms ===============`);
    
            responseBody = `\nRecords have been deleted successfully from employee_permission for employee id: ${emp.ID_Employee}`;
    
        } catch (error) {
            console.error(`Failed to delete data from employee_permission: ${error.message}`);
            responseBody = `\nFailed to delete data from employee_permission: ${error.message}`;
        }
    
        return responseBody;
    }
    

    async deleteQueryForUsers(emp, dbConnection) {
        const query = "DELETE FROM users WHERE unumber = ? AND internal_id = ?";
    
        try {
            const start = Date.now();
    
            await dbConnection.execute(query, [
                emp.ID_Employee ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                emp.id_CustomerInternal ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null
            ]);
    
            console.log("=============== Records deleted from users table! ==================");
            console.log(`=============== Time Taken = ${Date.now() - start}ms ===============`);
    
            return `\nRecords have been deleted successfully from users for employee id: ${emp.ID_Employee}`;
    
        } catch (error) {
            console.error(`Failed to delete data from users table: ${error.message}`);
            return `\nFailed to delete data from users table: ${error.message}`;
        }
    }
    

    async updateQueryForEmployees(emp, currentTime, dbConnection) {
        const query = "UPDATE employees SET first_name = ?, last_name = ?, full_name = ?, status = ?, updated_at = ? WHERE employee_no = ? AND customer_internal_id = ?";

        try {
            await dbConnection.execute(query, [
                Util.decodeCurrentString(emp.NameFirst),
                Util.decodeCurrentString(emp.NameLast),
                Util.decodeCurrentString(emp.ct_NameFull),
                emp.sts_Active ? parseInt(Util.decodeCurrentString(emp.sts_Active)) : null,
                currentTime,
                emp.ID_Employee ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                emp.id_CustomerInternal ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null
            ]);

            return `\nRecords have been updated successfully in employees for employee id: ${emp.ID_Employee}`;

        } catch (error) {
            console.error(`Failed to update data in employees: ${error.message}`);
            return `\nFailed to update data in employees: ${error.message}`;
        }
    }

    async insertQueryForEmployeePermission(emp, currentTime, empId, dbConnection) {
        const baseQuery = `INSERT INTO employee_permission (attribute, value, employee_no, customer_internal_id, employee_id, created_at, updated_at) VALUES `;
        let responseBody = "";
        const ascAttr = Attributes.ascAttr; // Assuming Attributes.ascAttr is available
    
        try {
            // Prepare a batch of inserts
            const inserts = [];
    
            for (const attr of ascAttr) {
                let temp = null;
    
                try {
                    temp = Util.decodeCurrentString(emp[attr]);
                    inserts.push([
                        attr,
                        temp,
                        !Util.isBlank(emp.ID_Employee) ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                        !Util.isBlank(emp.id_CustomerInternal) ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null,
                        empId,
                        currentTime,
                        currentTime
                    ]);
                } catch (e) {
                    console.error(`==== No value for key: ${attr} ==== ex: ${e.message}`);
                }
            }
    
            // Build the query with multiple value sets
            if (inserts.length > 0) {
                const values = inserts.map(() => `(?, ?, ?, ?, ?, ?, ?)`).join(", ");
                const query = `${baseQuery} ${values}`;
                const flatInserts = inserts.flat(); // Flatten the array of arrays into a single array
                const start = Date.now();
    
                await dbConnection.query(query, flatInserts);
    
                console.log("=============== Records are inserted into employee_permission table! ==================");
                console.log(`=============== Time Taken=${Date.now() - start} ===============`);
                responseBody = `\nRecords have been inserted successfully to employee_permission for employee id: ${emp.ID_Employee}`;
            } else {
                responseBody = "\nNo records to insert.";
            }
    
        } catch (error) {
            console.error(`Failed to save data in employee_permission: ${error.message}`);
            responseBody = `\nFailed to save data in employee_permission: ${error.message}`;
        }
    
        return responseBody;
    }
    
    

    async updateQueryForEmployeePermission(emp, currentTime, dbConnection) {
        const query = "UPDATE employee_permission SET updated_at = ? WHERE employee_no = ? AND customer_internal_id = ? AND attribute = ?";

        try {
            await dbConnection.execute(query, [
                currentTime,
                emp.ID_Employee ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                emp.id_CustomerInternal ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null,
                emp.attr_Permission ? parseInt(Util.decodeCurrentString(emp.attr_Permission)) : null
            ]);

            return `\nRecords have been updated successfully in employee_permission for employee id: ${emp.ID_Employee}`;

        } catch (error) {
            console.error(`Failed to update data in employee_permission: ${error.message}`);
            return `\nFailed to update data in employee_permission: ${error.message}`;
        }
    }

    async selectQueryForUsersTable(emp, dbConnection) {
        const query = "SELECT id FROM users WHERE unumber = ? AND internal_id = ?";

        try {
            const [rows] = await dbConnection.execute(query, [
                emp.ID_Employee ? parseInt(Util.decodeCurrentString(emp.ID_Employee)) : null,
                emp.id_CustomerInternal ? parseInt(Util.decodeCurrentString(emp.id_CustomerInternal)) : null
            ]);

            return rows.length > 0 ? rows[0].id : null;

        } catch (error) {
            console.error(`Failed to select data from users: ${error.message}`);
            return null;
        }
    }

    async sendPOST(url, params) {
        try {
            const response = await axios.post(url, params);
            return response.data;
        } catch (error) {
            console.error(`Failed to send POST request: ${error.message}`);
            return null;
        }
    }

    async getEmployeeList(json) {
        const empList = [];
        const jsonEmp = json.emp;

        for (const key in jsonEmp) {
            if (jsonEmp.hasOwnProperty(key) && key.trim() !== "") {
                try {
                    const emp = JSON.parse(JSON.stringify(jsonEmp[key]));
                    empList.push(emp);
                } catch (error) {
                    console.log("Got exception while parsing JSON for emp list: " + error.message);
                }
            }
        }

        return empList;
    }

}

module.exports.EmpHandler = EmpHandler;
