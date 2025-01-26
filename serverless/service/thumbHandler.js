const  dbUtils  = require('../../utils/dbUtils');
const { ACTIONS } = require('../../authHandler');
const  {Util}  = require('../../utils/util');
const AuthHandler = require('../../authHandler');
const hashKey = "3zH14aB_9xF5za4";
const S3bucketUtils = require('../../utils/s3bucketUtils');

class ThumbHandler{


    constructor(jsonQueryString) {
        this.jsonQueryString = jsonQueryString;
    }
    
    async handle(jsonQueryString){
        return this.processRequest(jsonQueryString);
    }
    
    async processRequest(jsonQueryString) {
        console.log("================  inside processRequest ================", jsonQueryString);
        let dbConnection = null;
        let responseContent = "";
        
        const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        const thumbList = await this.getThumbList(jsonQueryString);
        dbConnection = await dbUtils.getConnection();
        
        try {
            console.log("===============  inside try block ================");
            for (const thumb of thumbList) {
                console.log("===============  inside for loop ================", thumb);
                if (thumb.action) {
                    if (thumb.action === ACTIONS.ADD) {
                        try {
                            console.log("============== Proceeding to insert value in db ====================");
                            responseContent += await this.insertQueryForDesignImage(thumb, currentTime, dbConnection);
                        } catch (error) {
                            console.error("Failed to process insert request. Exception: ", error.message);
                        }
                    } else if (thumb.action === ACTIONS.UPDATE) {
                        try {
                            responseContent += await this.updateQueryForDesignImage(thumb, currentTime, dbConnection);
                        } catch (error) {
                            console.error("Failed to process update request. Exception: ", error.message);
                        }
                    } else if (thumb.action === ACTIONS.DELETE) {
                        try {
                            responseContent += await this.deleteQueryForDesignImage(thumb, dbConnection);
                        } catch (error) {
                            console.error("Failed to process delete request. Exception: ", error.message);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Exception: ", error);
        } finally {
            if (dbConnection) {
                try {
                    await dbConnection.close();
                } catch (error) {
                    console.error("Failed to close connection. Exception: ", error);
                }
            }
        }
        
        return responseContent;
    }    
    
    async getThumbList(json) {
        console.log("================  inside getThumbList ================");
        const thumbList = [];
        const jsonOrderId = json.thumb;
    
        for (const key in jsonOrderId) {
            if (jsonOrderId.hasOwnProperty(key) && key) {
                try {
                    const thumb = JSON.parse(JSON.stringify(jsonOrderId[key]));
                    thumbList.push(thumb);
                } catch (error) {
                    console.log("Got exception while parsing JSON for thumb section: " + error.message);
                }
            }
        }
        console.log("Thumb: ", thumbList);
        return thumbList;
    }

    async insertQueryForDesignImage(thumb, currentTime, dbConnection) {
        console.log("================  inside insertQueryForDesignImage ================");
        let responseBody = "";
    
        const path = await this.uploadAndGetS3FilePath(thumb);
    
        const query = `
            INSERT INTO design_image 
            (extension, name, path, design_image_no, customer_internal_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    
        try {
            const start = Date.now();
            if (path) {
                // Executing the query with parameters directly
                const [result] = await dbConnection.execute(query, [
                    decodeURIComponent(thumb.FileExtension),
                    `${decodeURIComponent(thumb.FileName)}.${decodeURIComponent(thumb.FileExtension)}`,
                    path,
                    thumb.ID_Serial ? parseInt(decodeURIComponent(thumb.ID_Serial)) : null,
                    thumb.id_CustomerInternal ? parseInt(decodeURIComponent(thumb.id_CustomerInternal)) : null,
                    currentTime,
                    currentTime
                ]);
    
                console.log("=============== Records are inserted into design_image table! ==================");
                console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
                responseBody = `\nRecords have been inserted successfully to design_image for design_image_no: ${thumb.ID_Serial}`;
            } else {
                responseBody = `\nSkipped record. Failed to upload image on S3 bucket for design_image_no: ${thumb.ID_Serial}`;
            }
        } catch (error) {
            responseBody = `\nFailed to save data in design_image: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        }
    
        return responseBody;
    }
    
    async updateQueryForDesignImage(thumb, currentTime, dbConnection) {
        console.log("================  inside updateQueryForDesignImage ================");
        let responseBody = "";
    
        const path = await this.uploadAndGetS3FilePath(thumb);
    
        const query = `
            UPDATE design_image 
            SET extension = ?, name = ?, path = ?, design_image_no = ?, customer_internal_id = ?, updated_at = ? 
            WHERE design_image_no = ? AND customer_internal_id = ?
        `;
    
        try {
            const start = Date.now();
            if (path) {
                // Executing the query with parameters directly
                const [result] = await dbConnection.execute(query, [
                    decodeURIComponent(thumb.FileExtension),
                    `${decodeURIComponent(thumb.FileName)}.${decodeURIComponent(thumb.FileExtension)}`,
                    path,
                    thumb.ID_Serial ? parseInt(decodeURIComponent(thumb.ID_Serial)) : null,
                    thumb.id_CustomerInternal ? parseInt(decodeURIComponent(thumb.id_CustomerInternal)) : null,
                    currentTime,
                    thumb.ID_Serial ? parseInt(decodeURIComponent(thumb.ID_Serial)) : null,
                    thumb.id_CustomerInternal ? parseInt(decodeURIComponent(thumb.id_CustomerInternal)) : null
                ]);
    
                console.log("=============== Records have been updated in design_image table! ==================");
                console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
                responseBody = `\nRecords have been updated successfully in design_image for design_image_no: ${thumb.ID_Serial}`;
            } else {
                responseBody = `\nSkipped record. Failed to upload image on S3 bucket for design_image_no: ${thumb.ID_Serial}`;
            }
        } catch (error) {
            responseBody = `\nFailed to save data in design_image: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        }
    
        return responseBody;
    }
    
    async selectQueryForDesignImage(thumb, dbConnection) {
        const resultList = [];
    
        const query = `SELECT path, name FROM design_image WHERE customer_internal_id = ? AND design_image_no = ?`;
    
        let preparedStmt = null;
    
        try {
            preparedStmt = await dbConnection.prepare(query);
            await preparedStmt.bind([
                thumb.id_CustomerInternal ? parseInt(decodeURIComponent(thumb.id_CustomerInternal)) : null,
                thumb.ID_Serial ? parseInt(decodeURIComponent(thumb.ID_Serial)) : null
            ]);
    
            const rs = await preparedStmt.executeQuery();
    
            while (rs.next()) {
                resultList.push(rs.getString("path") + rs.getString("name"));
            }
        } catch (error) {
            console.log("=== got exception while fetching image path from design_image: ", error.message);
        } finally {
            if (preparedStmt) {
                await preparedStmt.close();
            }
        }
    
        return resultList;
    }

    async deleteQueryForDesignImage(thumb, dbConnection) {
        console.log("================  inside deleteQueryForDesignImage ================");
        let responseBody = "";
    
        const imageKey = await this.selectQueryForDesignImage(thumb, dbConnection);
        const query = `DELETE FROM design_image WHERE customer_internal_id = ? AND design_image_no = ?`;
    
        try {
            const start = Date.now();
    
            // Executing the query with parameters directly
            const [result] = await dbConnection.execute(query, [
                thumb.id_CustomerInternal ? parseInt(decodeURIComponent(thumb.id_CustomerInternal)) : null,
                thumb.ID_Serial ? parseInt(decodeURIComponent(thumb.ID_Serial)) : null
            ]);
    
            console.log("=============== Records have been deleted from design_image table! ==================");
            console.log("===============  Time Taken=" + (Date.now() - start) + " ===============");
            responseBody = `\nRecords have been deleted successfully from design_image for design_image_no: ${thumb.ID_Serial}`;
    
            for (const key of imageKey) {
                await S3bucketUtils.deleteFile(key);
            }
        } catch (error) {
            responseBody = `\nFailed to delete data in design_image: ${error.message}`;
            console.log("============  Exception: " + error.message + " =======================");
        }
    
        return responseBody;
    }
    
    async uploadAndGetS3FilePath(thumb) {
        // getting image file name
        const FileName = `${decodeURIComponent(thumb.FileName)}.${decodeURIComponent(thumb.FileExtension)}`;
        
        // creating hash keys for folder name
        const hash1 = AuthHandler.hmacSha1(`_${decodeURIComponent(thumb.id_CustomerInternal)}`, hashKey);
        const reversehash1 = hash1.split('').reverse().join('');
    
        const hash2 = AuthHandler.hmacSha1(`this is a test${decodeURIComponent(thumb.id_CustomerInternal)}`, hashKey);
        const reversehash2 = hash2.split('').reverse().join('');
    
        // setting folder name to save the files
        const folder2 = reversehash1.substring(0, 20);
        const folder3 = reversehash2.substring(0, 20);
    
        const folderlocation = `${folder2}/${folder3}/`;
        const fileKeyLocation = `${folderlocation}${FileName}`;
        
        // changed after evaluation by shop work team
        const path = folderlocation; //DBUtils.BUCKETURL + DBUtils.S3BUCKET_NAME + "/" + fileKeyLocation;
    
        // Decode and validate the base64 string
        const thumbBase64 = decodeURIComponent(thumb.ThumbBase64);
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

}

exports.handler = async (event, context) => {
    const handler = new ThumbHandler();
    return handler.handle(event, context);
};

module.exports.ThumbHandler = ThumbHandler;