const handler = require('./handler');
const MongoDbProvider = require('../providers/mongodb-provider');

const orgSchema = require('../schemas/organization-schema.json');
const timeEntrySchema = require('../schemas/time-entry-schema.json');
const officeSchema = require('../schemas/office-schema.json');
const querystringSchema = require('../schemas/querystring-schema.json');

const schemas = {
    '/time-entries': timeEntrySchema,
    '/organizations': orgSchema,
    '/offices': officeSchema
};

const cachedDb = null;

function getCollectionName(resource) {
    const collectionNames = {
        '/time-entries': 'time-entries',
        '/time-entries/{id}': 'time-entries',
        '/organizations': 'organizations',
        '/organizations/{id}': 'organizations',
        '/offices': 'offices',
        '/offices/{id}': 'offices'
    };
    return collectionNames[resource];
}

function getSchema(resource) {
    return schemas[resource];
}

function create(event, context, callback) {
    const jsonContents = JSON.parse(event.body);

    const schema = getSchema(event.resource);

    const collectionName = getCollectionName(event.resource);
    const provider = new MongoDbProvider(cachedDb, collectionName);

    handler.create(jsonContents, provider, schema, context, callback);
}

function get(event, context, callback) {
    const collectionName = getCollectionName(event.resource);
    const provider = new MongoDbProvider(cachedDb, collectionName);
    handler.get(event, provider, querystringSchema, context, callback);
}

function getById(event, context, callback) {
    const collectionName = getCollectionName(event.resource);
    const provider = new MongoDbProvider(cachedDb, collectionName);
    handler.getById(event, provider, context, callback);
}

function remove(event, context, callback) {
    const collectionName = getCollectionName(event.resource);
    const provider = new MongoDbProvider(cachedDb, collectionName);
    handler.remove(event, provider, context, callback);
}

module.exports = {
    create,
    get,
    getById,
    remove
};