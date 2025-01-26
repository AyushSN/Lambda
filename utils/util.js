class Util {
    static parseStr(str) {
        const pairs = str.split('&');
        const result = new OurMap();

        if (!pairs || pairs.length === 0) {
            return result;
        }

        for (let pair of pairs) {
            const tmp = pair.split('=', 2);
            let key, value;

            try {
                key = decodeURIComponent(tmp[0]);
                value = tmp.length > 1 ? decodeURIComponent(tmp[1]) : '';
            } catch (e) {
                console.error(`Failed to decode pair: ${pair}`);
                continue; // Skip this pair if there's an error
            }

            const path = this.keyToPath(key);

            let map = result;
            for (let i = 0; i < path.length; i++) {
                const part = path[i];

                if (i === path.length - 1) {
                    map.set(part, value);
                } else {
                    if (!map.has(part)) {
                        map.set(part, new OurMap());
                    }
                    map = map.get(part);
                }
            }
        }

        return Util.mapToObject(result);
    }

    static decodeURIComponent(encodedString) {
        if (encodedString && encodedString.trim()) {
            try {
                return decodeURIComponent(encodedString);
            } catch (e) {
                console.error(`Could not decode string ${encodedString}`);
                return encodedString;
            }
        }
        return encodedString;
    }

    // Convert date string to a different format
    static convertStringDateToFormat(date) {
        try {
            const [month, day, year] = date.split('/');
            const formattedDate = new Date(`${year}-${month}-${day}`);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'UTC',
            };
            return new Intl.DateTimeFormat('en-GB', options).format(formattedDate).replace(',', '');
        } catch (e) {
            console.error('Error formatting date:', e);
            return null;
        }
    }


    static keyToPath(key) {
        const pattern = /([^\[\]]+)/g;
        const result = [];
        let match;

        while ((match = pattern.exec(key)) !== null) {
            result.push(match[0]);
        }

        return result;
    }

    static mapToObject(map) {
        const obj = {};
        for (const [key, value] of map) {
            obj[key] = value instanceof Map ? Util.mapToObject(value) : value;
        }
        return obj;
    }

    static isBlank(str){
        return str == undefined || str == null || str.trim().length === 0;
    }
}

class OurMap extends Map {
    add(obj) {
        this.set(this.size.toString(), obj);
    }
}

module.exports = {
    Util,
    OurMap
};
