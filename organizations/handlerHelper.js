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

function assign(obj, keyPath, value) {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
       const key = keyPath[i];
        if (!(key in obj)) {
            obj[key] = {};
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

module.exports = {
    badRequest,
    handleUnhandledError,
    validateSchema,
    parseFilter
};
