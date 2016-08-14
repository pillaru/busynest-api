var Q = require('q'),
    TimesheetEntry = require('./../models/timesheet-entry');

function find(req) {
    var deferred = Q.defer();

    var query = TimesheetEntry.find({}).populate({
        path: 'employer_office',
        populate: { path: 'organization' }
    });

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

function findById(id, req) {
    var deferred = Q.defer();

    var query = TimesheetEntry.findById(id).populate({
        path: 'employer_office',
        populate: { path: 'organization' }
    });

    query.exec().then(function(doc) {
        deferred.resolve(transformModel(doc, req));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newEntry, req) {
    var deferred = Q.defer();
    
    var entry = new TimesheetEntry({
        employer_office: newEntry.employer_office.id,
        start: newEntry.start,
        end: newEntry.end,
        break: newEntry.break,
        rate_per_hour: newEntry.rate_per_hour
    }); 
    
    entry.save().then(function(result) {
        return findById(result.id, req);
    }).then(function(entry) {
        deferred.resolve(entry);        
    }).end(deferred.reject);
    
    return deferred.promise;
}

function transformModel(doc, req) {
    var urlBase = req.protocol + '://' + req.get('host');
    var transformed = doc.toObject();
    transformed.url = urlBase + transformed.url;
    delete transformed._id;
    if (transformed.employer_office) {
        transformed.employer_office.url = urlBase + transformed.employer_office.url;
        delete transformed.employer_office._id;
    }
    if (transformed.employer_office && transformed.employer_office.organization) {
        transformed.employer_office.organization.url = urlBase + 
            transformed.employer_office.organization.url;
        transformed.employer_office.organization.offices_url = urlBase + 
            transformed.employer_office.organization.offices_url;        
        delete transformed.employer_office.organization._id;
    }
    return transformed;
}

module.exports = {
    find : find,
    findById : findById,
    create : create
}