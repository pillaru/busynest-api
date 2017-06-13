const MongoDbProvider = require('../providers/mongodb-provider');

const Ajv = require('ajv');
const officeSchema = require('../schemas/office-schema');
const queryStringSchema = require('../schemas/querystring-schema.json');
const helper = require('../helpers/handlerHelper');

const collectionName = 'offices';
const provider = new MongoDbProvider(collectionName);

let cachedDb = null;

function getCachedDb() {
    return MongoDbProvider.getDatabase(cachedDb)
    .then((db) => {
        cachedDb = db;
        return cachedDb;
    });
}

function get(event, context, callback) {
    Object.assign(context, { callbackWaitsForEmptyEventLoop: false });

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
        .then((db) => provider.getAll(db, qs.filter, qs.limit, qs.offset))
        .then(helper.handleOk(callback))
        .catch(helper.handleUnhandledError(callback));
}

function create(event, context, callback) {
    Object.assign(context, { callbackWaitsForEmptyEventLoop: false });

    const jsonContents = JSON.parse(event.body);

    const ajv = new Ajv({ allErrors: true, removeAdditional: true });
    const validationResult = helper.validateSchema(ajv, officeSchema, jsonContents);
    if (!validationResult.isValid) {
        return callback(null, helper.badRequest(context, validationResult.errors));
    }

    return getCachedDb()
    .then((db) => provider.create(db, jsonContents))
    .then(helper.handleCreated(callback))
    .catch(helper.handleUnhandledError(callback));
}

module.exports = {
    create,
    get
};
