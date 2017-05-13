const MongoClient = require('mongodb').MongoClient;
const helper = require('./helper');
// const Logger = require('mongodb').Logger;

// Set debug level
// Logger.setLevel('debug');

let cachedDb = null;

function badRequest(context, actual, message) {
    return {
        statusCode: 400,
        body: JSON.stringify({
            errorType: 'BadRequest',
            requestId: context.awsRequestId,
            actual,
            message
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
    qs.limit = Number(qs.limit || 10);
    if (qs.limit > 100) {
        const message = 'limit cannot be higher than 100';
        return callback(null, badRequest(context, qs.limit, message));
    }
    if (qs.limit < 0) {
        const message = 'limit cannot be less than 0';
        return callback(null, badRequest(context, qs.limit, message));
    }
    qs.offset = Number(qs.offset || 0);
    if (qs.offset < 0) {
        const message = 'offset cannot be less than 0';
        return callback(null, badRequest(context, qs.offset, message));
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

module.exports.create = (event, context, callback) => {
    const uri = process.env.MONGODB_CONNECTION_STRING;

    context.callbackWaitsForEmptyEventLoop = false;

    const jsonContents = JSON.parse(event.body);

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
            helper.createDoc(cachedDb, jsonContents, callback);
        }
    } catch (err) {
        console.error('an error occurred', err);
    }
};
