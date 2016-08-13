var Q = require('q'),
    TimesheetEntry = require('./../models/timesheet-entry');

function find(req) {
    var deferred = Q.defer();

    var query = TimesheetEntry.find({});

    query.exec().then(function(results) {
        var entries = results.map(function(entry) {
            return transformModel(entry, req);
        });
        deferred.resolve(entries);
    }).end(function(reason) {
        deferred.reject(reason);
    });

    return deferred.promise;
}

function create(newEntry, req) {
    var deferred = Q.defer();
    
    var entry = new TimesheetEntry({
        start: newEntry.start,
        end: newEntry.end,
        break: newEntry.break,
        rate_per_hour: newEntry.rate_per_hour
    }); 
    
    entry.save().then(function(result) {
        deferred.resolve(transformModel(result, req));
    }).end(deferred.reject);
    
    return deferred.promise;
}

function transformModel(doc, req) {
    var urlBase = req.protocol + '://' + req.get('host');
    var transformed = doc.toObject();
    transformed.url = urlBase + transformed.url;
    delete transformed._id;
    return transformed;
}

module.exports = {
    find : find,
    create : create
}