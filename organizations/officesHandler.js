const Ajv = require('ajv');
const officeSchema = require('./officeSchema');
const queryStringSchema = require('./querystring-schema.json');
const provider = require('./mongodb-provider')('offices');
const helper = require('./handlerHelper');

let cachedDb = null;

function getCachedDb() {
    return provider.getDatabase(cachedDb)
    .then((db) => {
        cachedDb = db;
        return cachedDb;
    });
}

function get(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    const qs = event.queryStringParameters || { };
    qs.limit = typeof qs.limit === 'number' ? Number(qs.limit) : undefined;
    qs.offset = typeof qs.limit === 'number' ? Number(qs.limit) : undefined;

    const ajv = new Ajv({ useDefaults: true });
    const validationResult = helper.validateSchema(ajv, queryStringSchema, qs);
    if (!validationResult.isValid) {
        return callback(null, helper.badRequest(context, validationResult.errors));
    }

    return getCachedDb()
    .then((db) => provider.getAll(db, qs.limit, qs.offset, callback))
    .catch(helper.handleUnhandledError(callback));
}

function create(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    const jsonContents = JSON.parse(event.body);

    const ajv = new Ajv({ allErrors: true, removeAdditional: true });
    const validationResult = helper.validateSchema(ajv, officeSchema, jsonContents);
    if (!validationResult.isValid) {
        return callback(null, helper.badRequest(context, validationResult.errors));
    }

    return getCachedDb()
    .then((db) => provider.create(db, jsonContents, callback))
    .catch(helper.handleUnhandledError(callback));
}

module.exports = {
    create,
    get
};
