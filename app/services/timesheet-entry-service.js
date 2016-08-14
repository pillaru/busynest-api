const Q = require('q');
const TimesheetEntry = require('./../models/timesheet-entry');

function transformModel(doc, req) {
    const urlBase = `${req.protocol}://${req.get('host')}`;
    const transformed = doc.toObject();
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

function find(req) {
    const deferred = Q.defer();

    const query = TimesheetEntry.find({}).populate({
        path: 'employer_office',
        populate: { path: 'organization' }
    });

    query.exec().then((results) => {
        const entries = results.map((entry) => transformModel(entry, req));
        deferred.resolve(entries);
    }).end((reason) => {
        deferred.reject(reason);
    });

    return deferred.promise;
}

function findById(id, req) {
    const deferred = Q.defer();

    const query = TimesheetEntry.findById(id).populate({
        path: 'employer_office',
        populate: { path: 'organization' }
    });

    query.exec().then((doc) => {
        deferred.resolve(transformModel(doc, req));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newEntry, req) {
    const deferred = Q.defer();

    const entry = new TimesheetEntry({
        employer_office: newEntry.employer_office.id,
        start: newEntry.start,
        end: newEntry.end,
        break: newEntry.break,
        rate_per_hour: newEntry.rate_per_hour
    });

    entry.save().then((result) => findById(result.id, req))
    .then((e) => {
        deferred.resolve(e);
    }).end(deferred.reject);

    return deferred.promise;
}

module.exports = {
    find,
    findById,
    create
};
