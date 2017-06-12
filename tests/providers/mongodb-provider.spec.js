const mongodbProviderFactory = require('../../src/providers/mongodb-provider');

describe('the mongodbProvider module', () => {
    test('remove calls collection with passed in collection name', () => {
        const collectionStub = {
            remove(filter, options, cb) {
                cb();
            }
        };
        const dbStub = {
            name: '',
            collection(name) {
                this.collectionName = name;
                return collectionStub;
            }
        };
        const sut = mongodbProviderFactory('foo');
        return sut.remove(dbStub, '59172d619e43b10ebeb90e4b')
        .then(() => {
            expect(dbStub.collectionName).toEqual('foo');
        });
    });
});
