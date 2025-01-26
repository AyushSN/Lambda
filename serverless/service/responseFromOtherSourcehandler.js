const axios = require('axios');

class ResponseFromOtherSource {
    
    async sendPOST(POST_URL, POST_PARAMS) {
        const USER_AGENT = "Mozilla/5.0";
        try {
            const response = await axios.post(POST_URL, POST_PARAMS, {
                headers: {
                    'User-Agent': USER_AGENT
                }
            });
    
            if (response.status === 200) {
                return response.data;
            } else {
                console.log("POST request not worked");
                return null;
            }
        } catch (e) {
            console.log(`==> Failed to get response from url: ${POST_URL} exception message: ${e.message}`);
            return null;
        }
    }
}

module.exports = ResponseFromOtherSource;