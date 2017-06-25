const https = require('https');
const url = require('url');

function getDefaultOptions(href) {
    const parsedUrl = url.parse(href);
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return options;
}

function post(href, data) {
    function resolver(resolve, reject) {
        const options = getDefaultOptions(href);
        options.method = 'POST';
        options.headers['Content-Length'] = Buffer.byteLength(data);

        // Set up the request
        const postReq = https.request(options, (res) => {
            res.setEncoding('utf8');
            const response = {
                statusCode: res.statusCode,
                headers: res.headers
            };
            let body = '';
            res.on('data', (chunk) => {
                if (chunk) {
                    body += chunk;
                }
            });
            res.on('end', () => {
                response.body = JSON.parse(body);
                resolve(response);
            });
        }).on('error', (e) => {
            reject(e);
        });

        postReq.write(data);
        postReq.end();
    }
    return new Promise(resolver);
}

function get(href, headers) {
    function resolver(resolve, reject) {
        const options = getDefaultOptions(href);
        Object.assign(options.headers, headers);
        const getRequest = https.request(options, (res) => {
            res.setEncoding('utf8');
            const response = {
                statusCode: res.statusCode,
                headers: res.headers
            };
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                response.body = JSON.parse(data);
                resolve(response);
            });
        }).on('error', (e) => {
            reject(e);
        });
        getRequest.end();
    }
    return new Promise(resolver);
}

module.exports = {
    post,
    get
};
