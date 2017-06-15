const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

function transform(obj) {
    Object.defineProperty(obj, 'id', Object.getOwnPropertyDescriptor(obj, '_id'));
    const transformed = obj;
    delete transformed._id;
    return transformed;
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
    constructor(database, collectionName) {
        this.database = database;
        this.collectionName = collectionName;
    }

    getDatabase() {
        const uri = process.env.MONGODB_CONNECTION_STRING;
        const self = this;

        function resolver(resolve, reject) {
            if (self.database != null) {
                return resolve(self.database);
            }
            console.log('=> connecting to database');
            return MongoClient.connect(uri, (err, db) => {
                if (err) {
                    console.error('error connecting to database', err);
                    return reject(err);
                }
                self.database = db;
                return resolve(self.database);
            });
        }
        return new Promise(resolver);
    }

    getAll(filter, limit, offset) {
        const parsedFilter = getItDotted(filter);
        const self = this;

        function resolver(resolve, reject) {
            return self.getDatabase()
            .then((db) => {
                db.collection(self.collectionName)
                .find(parsedFilter)
                .limit(limit).skip(offset)
                .toArray((er, result) => {
                    if (er) {
                        console.error('an error occurred in getAll', er);
                        reject(er);
                    }
                    db.collection(self.collectionName).count(parsedFilter, (err, count) => {
                        if (err) {
                            console.error('an error occurred in getAll', err);
                            reject(err);
                        }
                        resolve({ totalSize: count, content: result });
                    });
                });
            });
        }
        return new Promise(resolver)
        .then((result) => {
            const transformed = result.content
                .map(c => transform(c));
            Object.assign(result, { content: transformed });
            return result;
        });
    }

    getById(id) {
        const self = this;
        function resolver(resolve, reject) {
            self.getDatabase().then((db) => {
                db.collection(self.collectionName)
                .findOne({ _id: new ObjectID(id) }, (err, doc) => {
                    if (err) {
                        reject(err);
                    }
                    if (!doc) {
                        return reject({ statusCode: 404 });
                    }
                    return resolve(transform(doc));
                });
            });
        }

        return new Promise(resolver);
    }

    create(json) {
        const self = this;
        function resolver(resolve, reject) {
            self.getDatabase()
            .then((db) => db.collection(self.collectionName).insertOne(json).then((result) => {
                console.log(`created an entry into the ${self.collectionName} collection with id:
                ${result.insertedId}`);
                resolve(result.insertedId);
            }))
            .catch((err) => {
                reject(err);
            });
        }

        return new Promise(resolver);
    }

    remove(id) {
        const self = this;
        function resolver(resolve, reject) {
            try {
                self.getDatabase().then((db) => {
                    db.collection(self.collectionName).remove({
                        _id: new ObjectID(id)
                    }, { single: true }, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
                });
            } catch (err) {
                reject(err);
            }
        }

        return new Promise(resolver);
    }
}

module.exports = MongoDbProvider;
