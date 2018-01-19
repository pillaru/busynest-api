const headers = {
    // Required for CORS support to work
    "Access-Control-Allow-Origin": "*",
    // Required for cookies, authorization headers with HTTPS
    "Access-Control-Allow-Credentials": true
};

function extend(...args) {
    // Create a new object
    const extended = {};

    // Merge the object into the extended object
    function merge(obj) {
        Object.keys(obj)
            .filter(prop => Object.prototype.hasOwnProperty.call(obj, prop))
            .forEach((prop) => {
                // Push each value from `obj` into `extended`
                extended[prop] = obj[prop];
            });
    }

    // Loop through each object and conduct a merge
    args.forEach((arg) => {
        merge(arg);
    });

    return extended;
}

function validateSchema(ajv, schema, content) {
    ajv.validate(schema, content);
    if (ajv.errors && ajv.errors.length > 0) {
        console.log(ajv.errors);
        const errors = ajv.errors.map(error => ({
            message: error.message,
            path: error.dataPath,
            params: error.params
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
}

function badRequest(context, errors) {
    return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
            message: "Validation failed",
            requestId: context.awsRequestId,
            errors
        })
    };
}

function handleOk(callback) {
    return body => callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(body)
    });
}

function handleCreated(callback) {
    return id => callback(null, {
        statusCode: 201,
        headers: extend(headers, {
            "access-control-allow-headers": "Location",
            "access-control-expose-headers": "Location",
            Location: id
        })
    });
}

function handleNoContent(callback) {
    return () => callback(null, {
        statusCode: 204, // No-Content
        headers
    });
}

function handleUnhandledError(callback) {
    return (reason) => {
        console.error(reason);
        return callback(reason, {
            statusCode: 500,
            headers
        });
    };
}

function handleNotFound(callback) {
    return () => callback(null, {
        statusCode: 404,
        headers
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

function handleForbidden(callback) {
    return () => callback(null, {
        statusCode: 403,
        headers
    });
}

module.exports = {
    badRequest,
    handleOk,
    handleCreated,
    handleNoContent,
    handleError,
    handleForbidden,
    handleUnhandledError,
    validateSchema
};
