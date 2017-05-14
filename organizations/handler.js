const MongoClient = require('mongodb').MongoClient;
const Ajv = require('ajv');
const organizationSchema = require('./organization-schema.json');
const queryStringSchema = require('./querystring-schema.json');
const helper = require('./helper');
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

module.exports.get = (event, context, callback) => {
    const uri = process.env.MONGODB_CONNECTION_STRING;
    // the following line is critical for performance reasons to allow re-use
    // of database connections across calls to this Lambda function and avoid
    // closing the database connection. The first call to this lambda function
    // takes about 5 seconds to complete, while subsequent, close calls will
    // only take a few hundred milliseconds.
    context.callbackWaitsForEmptyEventLoop = false;

    const qs = event.queryStringParameters || { };
    qs.limit = Number(qs.limit) || 0;
    qs.offset = Number(qs.offset) || 0;

    const ajv = new Ajv();
    ajv.validate(queryStringSchema, qs);
    if (ajv.errors && ajv.errors.length > 0) {
        console.log(ajv.errors);
        const errors = ajv.errors.map((error) => ({
            message: error.message,
            path: error.dataPath
        }));
        return callback(null, badRequest(context, errors));
    }

    try {
        if (cachedDb === null) {
            console.log('=> connecting to database');
            MongoClient.connect(uri, (err, db) => {
                if (err) {
                    console.error('error connecting to database', err);
                    return callback(err, '[500] Internal Server Error');
                }
                cachedDb = db;
                return helper.getAll(qs.limit, qs.offset, db, callback);
            });
        } else {
            helper.getAll(qs.limit, qs.offset, cachedDb, callback);
        }
    } catch (err) {
        console.error('an error occurred', err);
    }
};

module.exports.getById = (event, context, callback) => {
    if (!event.pathParameters || !event.pathParameters.id) {
        return callback(null, badRequest(context, [{ message: 'missing parameter', path: '/id' }]));
    }
    const uri = process.env.MONGODB_CONNECTION_STRING;

    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (cachedDb === null) {
            console.log('=> connecting to database');
            return MongoClient.connect(uri, (err, db) => {
                if (err) {
                    console.error('error connecting to database', err);
                    return callback(err, '[500] Internal Server Error');
                }
                cachedDb = db;
                return helper.getById(db, event.pathParameters.id, callback);
            });
        }
        return helper.getById(cachedDb, event.pathParameters.id, callback);
    } catch (err) {
        console.error('an error occurred', err);
        return callback(err, '[500] Internal Server Error');
    }
};

module.exports.create = (event, context, callback) => {
    const uri = process.env.MONGODB_CONNECTION_STRING;

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

    try {
        if (cachedDb === null) {
            console.log('=> connecting to database');
            MongoClient.connect(uri, (err, db) => {
                if (err) {
                    console.error('error connecting to database', err);
                    return callback(err, '[500] Internal Server Error');
                }
                cachedDb = db;
                return helper.createDoc(db, jsonContents, callback);
            });
        } else {
            return helper.createDoc(cachedDb, jsonContents, callback);
        }
    } catch (err) {
        console.error('an error occurred', err);
    }
};
