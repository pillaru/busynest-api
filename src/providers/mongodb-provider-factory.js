const MongoDbProvider = require('./mongodb-provider');

class MongoDbProviderFactory {

    constructor(cachedDb) {
        this.cachedDb = cachedDb;
    }

    create(collectionName) {
        return new MongoDbProvider(this.cachedDb, collectionName);
    }
}

module.exports = MongoDbProviderFactory;
