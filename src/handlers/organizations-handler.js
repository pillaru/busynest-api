const MongoDbProvider = require('../providers/mongodb-provider');

const Ajv = require('ajv');
const organizationSchema = require('../schemas/organization-schema.json');
const queryStringSchema = require('../schemas/querystring-schema.json');
const helper = require('../helpers/handlerHelper');

let cachedDb = null;
const collectioName = 'organizations';
const provider = new MongoDbProvider(collectioName);

function getCachedDb() {
    return MongoDbProvider.getDatabase(cachedDb)
    .then((db) => {
        cachedDb = db;
        return cachedDb;
    });
}

function get(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    const qs = event.queryStringParameters || { };
    qs.limit = isNaN(Number(qs.limit)) ? undefined : Number(qs.limit);
    qs.offset = isNaN(Number(qs.offset)) ? undefined : Number(qs.offset);

    const ajv = new Ajv({ useDefaults: true });
    const validationResult = helper.validateSchema(ajv, queryStringSchema, qs);

    if (!validationResult.isValid) {
        return callback(null, helper.badRequest(context, validationResult.errors));
    }

    return getCachedDb()
    .then((db) => provider.getAll(db, {}, qs.limit, qs.offset))
    .then((docs) => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(docs)
        });
    })
    .catch(helper.handleUnhandledError(callback));
}

function getById(event, context, callback) {
    if (!event.pathParameters || !event.pathParameters.id) {
        return callback(null,
            helper.badRequest(context, [{ message: 'missing parameter', path: '/id' }]));
    }
    context.callbackWaitsForEmptyEventLoop = false;

    return getCachedDb()
    .then((db) => provider.getById(db, event.pathParameters.id, callback))
    .catch(helper.handleUnhandledError(callback));
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
        return callback(null, helper.badRequest(context, errors));
    }

    return getCachedDb()
    .then(db => provider.create(db, jsonContents))
    .then(() => callback(null, {
        statusCode: 201
    }))
    .catch(helper.handleUnhandledError(callback));
}

function remove(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line no-param-reassign

    if (!event.pathParameters || !event.pathParameters.id) {
        return callback(null,
            helper.badRequest(context, [{ message: 'missing parameter', path: '/id' }]));
    }

    return getCachedDb()
    .then(db => provider.remove(db, event.pathParameters.id))
    .then(() => callback(null, {
        statusCode: 204 // No-Content
    }))
    .catch(helper.handleUnhandledError(callback));
}

module.exports = {
    get,
    getById,
    create,
    remove
};
