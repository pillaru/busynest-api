const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

function getItDotted(obj) {
    const res = {};
    (function recurse(val, current) {
        for (const key in val) {
            const value = val[key];
            const newKey = (current ? `${current}.${key}` : key);  // joined key with dot
            if (value && typeof value === 'object') {
                recurse(value, newKey);  // it's a nested object, so do it again
            } else {
                res[newKey] = value;  // it's not an object, so set the property
            }
        }
    }(obj));
    return res;
}

function getDatabase(cachedDatabase) {
    const uri = process.env.MONGODB_CONNECTION_STRING;

    console.log(uri);

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

function transform(obj) {
    Object.defineProperty(obj, 'id', Object.getOwnPropertyDescriptor(obj, '_id'));
    delete obj._id;
    return obj;
}

function getAll(collection, db, filter, limit, offset) {
    filter = getItDotted(filter); // eslint-disable-line no-param-reassign

    function resolver(resolve, reject) {
        db.collection(collection)
        .find(filter)
        .limit(limit).skip(offset)
        .toArray((er, result) => {
            if (er) {
                console.error('an error occurred in getAll', er);
                reject(er);
            }
            db.collection(collection).count(filter, (err, count) => {
                if (err) {
                    console.error('an error occurred in getAll', err);
                    reject(err);
                }
                resolve({ totalSize: count, content: result });
            });
        });
    }
    return new Promise(resolver)
    .then((result) => {
        result.content = result.content // eslint-disable-line no-param-reassign
            .map(c => transform(c));
        return result;
    });
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
            return callback(null, {
                statusCode: 200, body: JSON.stringify(transform(doc))
            });
        });
}

function createDoc(collection, db, json) {
    function resolver(resolve, reject) {
        db.collection(collection).insertOne(json).then((result) => {
            console.log(`created an entry into the ${collection} collection with id:
            ${result.insertedId}`);
            resolve(result.insertedId);
        })
        .catch((err) => {
            reject(err);
        });
    }

    return new Promise(resolver);
}

function deleteDoc(collection, db, id) {
    function resolver(resolve, reject) {
        db.collection(collection).remove({
            _id: new ObjectID(id)
        }, { single: true }, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    }

    return new Promise(resolver);
}

module.exports = collection => ({
    getDatabase,
    getAll: (db, filter, limit, offset) => getAll(
        collection, db, filter, limit, offset),
    getById: (db, id, callback) => getById(collection, db, id, callback),
    create: (db, json) => createDoc(collection, db, json),
    remove: (db, id) => deleteDoc(collection, db, id)
});
