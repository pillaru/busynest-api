const Ajv = require('ajv');
const organizationSchema = require('./organization-schema.json');
const queryStringSchema = require('./querystring-schema.json');
const provider = require('./mongodb-provider')('organizations');
// const Logger = require('mongodb').Logger;

// Set debug level
// Logger.setLevel('debug');

let cachedDb = null;

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

function getCachedDb() {
    return provider.getDatabase(cachedDb)
    .then((db) => {
        cachedDb = db;
        return cachedDb;
    });
}

function handleUnhandledError(callback) {
    return (reason) => {
        console.error(reason);
        return callback(reason, '[500] Internal Server Error');
    };
}

function get(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    const qs = event.queryStringParameters || { };
    qs.limit = typeof qs.limit === 'number' ? Number(qs.limit) : undefined;
    qs.offset = typeof qs.limit === 'number' ? Number(qs.limit) : undefined;

    console.log(qs.limit);

    const ajv = new Ajv({ useDefaults: true });
    ajv.validate(queryStringSchema, qs);
    if (ajv.errors && ajv.errors.length > 0) {
        console.log(ajv.errors);
        const errors = ajv.errors.map((error) => ({
            message: error.message,
            path: error.dataPath
        }));
        return callback(null, badRequest(context, errors));
    }

    return getCachedDb()
    .then((db) => provider.getAll(db, qs.limit, qs.offset, callback))
    .catch(handleUnhandledError(callback));
}

function getById(event, context, callback) {
    if (!event.pathParameters || !event.pathParameters.id) {
        return callback(null, badRequest(context, [{ message: 'missing parameter', path: '/id' }]));
    }
    context.callbackWaitsForEmptyEventLoop = false;

    return getCachedDb()
    .then((db) => provider.getById(db, event.pathParameters.id, callback))
    .catch(handleUnhandledError(callback));
}

function create(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    const jsonContents = JSON.parse(event.body);

    const ajv = new Ajv({ allErrors: true, removeAdditional: true });
    ajv.validate(organizationSchema, jsonContents);
    if (ajv.errors && ajv.errors.length > 0) {
        console.log(ajv.errors);
        const errors = ajv.errors.map((error) => ({
            message: error.message,
            path: error.dataPath,
            params: error.params
        }));
        return callback(null, badRequest(context, errors));
    }

    return getCachedDb()
    .then((db) => provider.create(db, jsonContents, callback))
    .catch(handleUnhandledError(callback));
}

module.exports = {
    get,
    getById,
    create
};
