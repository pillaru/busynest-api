const Ajv = require('ajv');
const helper = require('../helpers/handlerHelper');

function create(body, provider, schema, context, callback) {
    Object.assign(context, { callbackWaitsForEmptyEventLoop: false });

    const ajv = new Ajv({ allErrors: true, removeAdditional: true });
    ajv.validate(schema, body);

    if (ajv.errors && ajv.errors.length > 0) {
        const errors = ajv.errors.map((error) => ({
            message: error.message,
            path: error.dataPath,
            params: error.params
        }));
        return callback(null, helper.badRequest(context, errors));
    }
    return provider.create(body)
    .then(helper.handleCreated(callback))
    .catch(helper.handleUnhandledError(callback));
}

function get(qs, provider, queryStringSchema, context, callback) {
    Object.assign(context, { callbackWaitsForEmptyEventLoop: false });
    Object.assign(qs, {
        limit: isNaN(Number(qs.limit)) ? undefined : Number(qs.limit),
        offset: isNaN(Number(qs.offset)) ? undefined : Number(qs.offset)
    });

    const ajv = new Ajv({ useDefaults: true });
    const validationResult = helper.validateSchema(ajv, queryStringSchema, qs);

    if (!validationResult.isValid) {
        return callback(null, helper.badRequest(context, validationResult.errors));
    }

    return provider
    .getAll(qs.filter, qs.limit, qs.offset)
    .then(helper.handleOk(callback))
    .catch(helper.handleUnhandledError(callback));
}

function getById(event, provider, context, callback) {
    if (!event.pathParameters || !event.pathParameters.id) {
        return callback(null,
            helper.badRequest(context, [{ message: 'missing parameter', path: '/id' }]));
    }
    Object.assign(context, { callbackWaitsForEmptyEventLoop: false });

    return provider.getById(event.pathParameters.id)
    .then(helper.handleOk(callback))
    .catch(helper.handleError(callback));
}

function remove(event, provider, context, callback) {
    Object.assign(context, { callbackWaitsForEmptyEventLoop: false });

    if (!event.pathParameters || !event.pathParameters.id) {
        return callback(null,
            helper.badRequest(context, [{ message: 'missing parameter', path: '/id' }]));
    }

    return provider.remove(event.pathParameters.id)
    .then(helper.handleNoContent(callback))
    .catch(helper.handleUnhandledError(callback));
}

module.exports = {
    create,
    get,
    getById,
    remove
};
