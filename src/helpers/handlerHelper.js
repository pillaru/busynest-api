function validateSchema(ajv, schema, content) {
    ajv.validate(schema, content);
    if (ajv.errors && ajv.errors.length > 0) {
        console.log(ajv.errors);
        const errors = ajv.errors.map((error) => ({
            message: error.message,
            path: error.dataPath,
            params: error.params
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
}

function assign(obj, keyPath, value) {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
        const key = keyPath[i];
        if (!(key in obj)) {
            Object.assign(obj, { [key]: {} });
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

function parseFilter(querystring) {
    let filters = Object.keys(querystring).filter((key) => key.startsWith('filter['));
    filters = filters.map((key) => {
        const splitted = key.split(new RegExp(['\\[', '\\]', ' '].join('|'), 'g'))
            .filter((k) => k !== '').splice(1);
        // return splitted.reduce((o, s) => o[s] = {}, {});
        const filter = {};
        assign(filter, splitted, querystring[key]);
        return filter;
    });

    const result = {};
    for (let i = 0; i < filters.length; i++) {
        const key = Object.keys(filters[i])[0];
        result[key] = filters[i][key];
    }
    return result;
}

function badRequest(context, errors) {
    return {
        statusCode: 400,
        headers: {
            'Access-Control-Allow-Origin': '*',
            // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify({
            message: 'Validation failed',
            requestId: context.awsRequestId,
            errors
        })
    };
}

function handleOk(callback) {
    return (body) => callback(null, {
        statusCode: 200,
        headers: {
            // Required for CORS support to work
            'Access-Control-Allow-Origin': '*',
            // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify(body)
    });
}

function handleCreated(callback) {
    return () => callback(null, {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Credentials' : true
        }
    });
}

function handleNoContent(callback) {
    return () => callback(null, {
        statusCode: 204, // No-Content
        headers: {
            'Access-Control-Allow-Origin': '*',
            // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Credentials' : true
        }
    });
}

function handleUnhandledError(callback) {
    return (reason) => {
        console.error(reason);
        return callback(reason, {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                // Required for cookies, authorization headers with HTTPS
                'Access-Control-Allow-Credentials' : true
            }
        });
    };
}

function handleNotFound(callback) {
    return () => callback(null, {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Credentials' : true
        }
    });
}

function handleError(callback) {
    return (reason) => {
        if (reason && reason.statusCode === 404) {
            return handleNotFound(callback)(reason);
        }
        return handleUnhandledError(callback)(reason);
    };
}

module.exports = {
    badRequest,
    handleOk,
    handleCreated,
    handleNoContent,
    handleError,
    handleUnhandledError,
    validateSchema,
    parseFilter
};
