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
    validateSchema
};
