const ObjectID = require('mongodb').ObjectID;
const MongoDbProvider = require('../../src/providers/mongodb-provider');

describe('the MongoDbProvider module', () => {
    const collectionStub = {
        id: '',
        remove(filter, options, cb) {
            this.id = filter._id;
            cb();
        }
    };
    const dbStub = {
        collectionStub,
        name: '',
        collection(name) {
            this.collectionName = name;
            return this.collectionStub;
        }
    };

    test('remove calls collection with passed in collection name', () => {
        const sut = new MongoDbProvider('foo');
        return sut.remove(dbStub, '59172d619e43b10ebeb90e4b')
        .then(() => {
            expect(dbStub.collectionName).toEqual('foo');
        });
    });

    test('remove calls remove on collection with id', () => {
        const id = '59172d619e43b10ebeb90e4b';
        const sut = new MongoDbProvider('foo');
        return sut.remove(dbStub, id)
        .then(() => {
            expect(dbStub.collectionStub.id).toEqual(new ObjectID(id));
        });
    });
});
