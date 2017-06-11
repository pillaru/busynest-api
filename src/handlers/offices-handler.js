const Ajv = require('ajv');
const officeSchema = require('../schemas/office-schema');
const queryStringSchema = require('../schemas/querystring-schema.json');
const provider = require('../providers/mongodb-provider')('offices');
const helper = require('../helpers/handlerHelper');

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
    qs.limit = isNaN(Number(qs.limit)) ? undefined : Number(qs.limit);
    qs.offset = isNaN(Number(qs.offset)) ? undefined : Number(qs.offset);

    qs.filter = helper.parseFilter(qs);

    const ajv = new Ajv({ useDefaults: true });
    const validationResult = helper.validateSchema(ajv, queryStringSchema, qs);
    if (!validationResult.isValid) {
        return callback(null, helper.badRequest(context, validationResult.errors));
    }

    return getCachedDb()
        .then((db) => {
            console.log('provider');
            return provider.getAll(db, qs.filter, qs.limit, qs.offset);
        })
        .then((docs) => {
            console.log('was herer');
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(docs)
            });
            return Promise.resolve();
        })
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
    .then((db) => provider.create(db, jsonContents))
    .then(() => callback(null, {
        statusCode: 201
    }))
    .catch(helper.handleUnhandledError(callback));
}

module.exports = {
    create,
    get
};
