function getAll(limit = 10, offset = 0, db, callback) {
    db.collection('organizations')
        .find({})
        .limit(limit)
        .skip(offset)
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

module.exports = {
    getAll,
    createDoc
};
