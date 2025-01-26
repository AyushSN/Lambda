const AWS = require('aws-sdk');
const DBUtils = require('./dbUtils');
const s3 = new AWS.S3({
    
    // accessKeyId: DBUtils.AWS_ACCESS_KEY,
    // secretAccessKey: DBUtils.AWS_SECRET_KEY,
    // region: 'us-east-1',
    apiVersion: '2006-03-01'
});

class S3BucketUtils {

    static async uploadFile(fileKeyLocation, base64Data) {
        const contents = Buffer.from(base64Data, 'base64');
        const contentType = this.getContentType(fileKeyLocation);

        if (contents.length === 0) {
            return false;
        }

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKeyLocation,
            Body: contents,
            ContentType: contentType,
            ACL: 'public-read'
        };

        try {
            await s3.putObject(params).promise();
            console.log(`== Successfully uploaded ==> path: ${fileKeyLocation}`);
            return true;
        } catch (err) {
            console.error(`== Failed to upload image == path: ${fileKeyLocation}, exception: ${err.message}`);
            return false;
        }
    }

    static async uploadText(bucketName, fileKeyLocation, textData) {
        console.log(`========= upload text ========== ::: ${JSON.stringify(s3)}`)
        if (!textData.trim()) {
            return false;
        }

        const params = {
            Bucket: bucketName,
            Key: fileKeyLocation,
            Body: textData,
            ACL: 'public-read'
        };

        try {
            await s3.putObject(params).promise();
            console.log(`== Successfully uploaded ==> path: ${fileKeyLocation}`);
            return true;
        } catch (err) {
            console.error(`== Failed to upload text == path: ${fileKeyLocation}, exception: ${err.message}`);
            return false;
        }
    }

    static async deleteFile(fileName) {
        const bucketName = process.env.S3_BUCKET_NAME;
        const fileKey = fileName.replace(`https://s3.amazonaws.com/${bucketName}/`, '');

        const params = {
            Bucket: bucketName,
            Key: fileKey
        };

        try {
            await s3.deleteObject(params).promise();
            console.log(`== Successfully deleted ==> file: ${fileKey}`);
        } catch (err) {
            console.error(`== Failed to delete file == file: ${fileKey}, exception: ${err.message}`);
        }
    }

    static async moveFilesOnS3Bucket(bucketName, keyName, destinationBucketName, destinationKeyName) {
        console.log(`====== Renaming File and moving it to new place ====== ${keyName} ==== ${bucketName}`);

        const copyParams = {
            Bucket: destinationBucketName,
            CopySource: `/${bucketName}/${keyName}`,
            Key: destinationKeyName
        };

        const deleteParams = {
            Bucket: bucketName,
            Key: keyName
        };

        try {
            await s3.copyObject(copyParams).promise();
            await s3.deleteObject(deleteParams).promise();
            console.log(`====== Done ======`);
        } catch (err) {
            console.error(`== Failed to move file == exception: ${err.message}`);
        }
    }

    static renameRequestFile(status, keyName) {
        console.log("====== Handling renameRequestFile =======");
        if (!keyName) return keyName;

        const beforeJsonPos = keyName.indexOf(".json");
        return `${keyName.substring(0, beforeJsonPos)}_${status}${keyName.substring(beforeJsonPos)}`;
    }

    static async createFolder(bucketName, folderName) {
        const params = {
            Bucket: bucketName,
            Key: `${folderName}/`,
            Body: '',
            ACL: 'public-read',
            Metadata: {
                'whattype': 'testtype'
            }
        };

        try {
            await s3.putObject(params).promise();
            console.log('== Folder created successfully ==');
        } catch (err) {
            console.error(`== Failed to create folder == exception: ${err.message}`);
        }
    }

    static getContentType(fileKeyLocation) {
        if (fileKeyLocation.endsWith('png')) {
            return 'image/png';
        } else if (fileKeyLocation.endsWith('jpeg')) {
            return 'image/jpeg';
        } else if (fileKeyLocation.endsWith('gif')) {
            return 'image/gif';
        }
        return 'application/octet-stream';
    }
}

module.exports = S3BucketUtils;
