const MongoClient = require('mongodb').MongoClient;
// const Logger = require('mongodb').Logger;

// Set debug level
// Logger.setLevel('debug');

let cachedDb = null;

function getAll(db, callback) {
    db.collection('organizations')
        .find({})
        .limit(10)
        .toArray((err, docs) => {
            if (err) {
                console.error('an error occurred in getAll', err);
                callback(null, JSON.stringify(err));
            } else {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(docs)
                });
            }
        });
}

module.exports.get = (event, context, callback) => {
    const uri = process.env.MONGODB_CONNECTION_STRING;
    // the following line is critical for performance reasons to allow re-use
    // of database connections across calls to this Lambda function and avoid
    // closing the database connection. The first call to this lambda function
    // takes about 5 seconds to complete, while subsequent, close calls will
    // only take a few hundred milliseconds.
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (cachedDb === null) {
            console.log('=> connecting to database');
            MongoClient.connect(uri, (err, db) => {
                if (err) {
                    console.error('error connecting to database', err);
                    return callback(err, '[500] Internal Server Error');
                }
                cachedDb = db;
                return getAll(db, callback);
            });
        } else {
            getAll(cachedDb, callback);
        }
    } catch (err) {
        console.error('an error occurred', err);
    }
};

function createDoc(db, json, callback) {
    try {
        console.log(json);
        const result = db.collection('organizations').insertOne(json);
        console.log(result);
        console.log(`created an entry into the organizations collection with id: 
                ${result.insertedId}`);
        callback(null, { statusCode: 201 });
    } catch (err) {
        console.error('an error occurred in createDoc', err);
        callback(null, JSON.stringify(err));
    }
}

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
                return createDoc(db, jsonContents, callback);
            });
        } else {
            createDoc(cachedDb, jsonContents, callback);
        }
    } catch (err) {
        console.error('an error occurred', err);
    }
};
