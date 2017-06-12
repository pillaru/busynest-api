const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

function transform(obj) {
    Object.defineProperty(obj, 'id', Object.getOwnPropertyDescriptor(obj, '_id'));
    delete obj._id;
    return obj;
}

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

class MongoDbProvider {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    static getDatabase(cachedDatabase) {
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

    getAll(db, filter, limit, offset) {
        filter = getItDotted(filter);
        const self = this;

        function resolver(resolve, reject) {
            db.collection(self.collectionName)
            .find(filter)
            .limit(limit).skip(offset)
            .toArray((er, result) => {
                if (er) {
                    console.error('an error occurred in getAll', er);
                    reject(er);
                }
                db.collection(self.collectionName).count(filter, (err, count) => {
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
            result.content = result.content
                .map(c => transform(c));
            return result;
        });
    }

    getById(db, id, callback) {
        db.collection(this.collectionName)
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

    create(db, json) {
        const self = this;
        function resolver(resolve, reject) {
            db.collection(self.collectionName).insertOne(json).then((result) => {
                console.log(`created an entry into the ${self.collectionName} collection with id:
                ${result.insertedId}`);
                resolve(result.insertedId);
            })
            .catch((err) => {
                reject(err);
            });
        }

        return new Promise(resolver);
    }

    remove(db, id) {
        const self = this;
        function resolver(resolve, reject) {
            db.collection(self.collectionName).remove({
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
}

module.exports = MongoDbProvider;
