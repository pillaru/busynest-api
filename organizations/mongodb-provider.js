const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

function getItDotted(obj) {
    const res = {};
    (function recurse(val, current) {
        for (const key in val) {
            const value = val[key];
            const newKey = (current ? current + "." + key : key);  // joined key with dot
            if (value && typeof value === 'object') {
                recurse(value, newKey);  // it's a nested object, so do it again
            } else {
                res[newKey] = value;  // it's not an object, so set the property
            }
        }
    })(obj);
    return res;
}

function getDatabase(cachedDatabase) {
    const uri = process.env.MONGODB_CONNECTION_STRING;

    function resolver(resolve, reject) {
        if (cachedDatabase != null) {
            return resolve(cachedDatabase);
        }
        console.log('=> connecting to database');
        return MongoClient.connect(uri, (err, db) => {
            if (err) {
                console.error('error connecting to database', err);
                return reject(err);
            }
            return resolve(db);
        });
    }
    return new Promise(resolver);
}

function getAll(collection, db, filter, limit, offset) {
    function resolver(resolve, reject) {
        filter = getItDotted(filter);
        db.collection(collection)
            .find(filter)
            .limit(limit)
            .skip(offset)
            .toArray((err, docs) => {
                if (err) {
                    console.error('an error occurred in getAll', err);
                    reject(err);
                }
                resolve(docs);
            });
    }
    return new Promise(resolver);
}

function getById(collection, db, id, callback) {
    console.log(id);
    db.collection(collection)
        .findOne({ _id: new ObjectID(id) }, (err, doc) => {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!doc) {
                return callback(null, { statusCode: 404 });
            }
            return callback(null, { statusCode: 200, body: JSON.stringify(doc) });
        });
}

function createDoc(collection, db, json, callback) {
    // console.log(json);
    return db.collection(collection).insertOne(json).then((result) => {
        // console.log(result);
        console.log(`created an entry into the ${collection} collection with id:
            ${result.insertedId}`);
        callback(null, { statusCode: 201 });
    })
    .catch((err) => {
        console.error('an error occurred in createDoc', err);
        callback(null, JSON.stringify(err));
    });
}

module.exports = collection => ({
    getDatabase,
    getAll: (db, filter, limit, offset) => getAll(
        collection, db, filter, limit, offset),
    getById: (db, id, callback) => getById(collection, db, id, callback),
    create: (db, json, callback) => createDoc(collection, db, json, callback)
});
