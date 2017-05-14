function badRequest(context, errors) {
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Validation failed',
            requestId: context.awsRequestId,
            errors
        })
    };
}

function handleUnhandledError(callback) {
    return (reason) => {
        console.error(reason);
        return callback(reason, '[500] Internal Server Error');
    };
}

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

module.exports = {
    badRequest,
    handleUnhandledError,
    validateSchema
};
