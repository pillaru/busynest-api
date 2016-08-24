const Q = require('q');
const TimesheetEntry = require('./../models/timesheet-entry');

function transformModel(doc, req) {
    const urlBase = `${req.protocol}://${req.get('host')}`;
    const transformed = doc.toObject();
    transformed.url = urlBase + transformed.url;
    delete transformed._id;
    if (transformed.employerOffice) {
        transformed.employerOffice.url = urlBase + transformed.employerOffice.url;
        delete transformed.employerOffice._id;
    }
    if (transformed.employerOffice && transformed.employerOffice.organization) {
        transformed.employerOffice.organization.url = urlBase +
            transformed.employerOffice.organization.url;
        transformed.employerOffice.organization.officesUrl = urlBase +
            transformed.employerOffice.organization.officesUrl;
        delete transformed.employerOffice.organization._id;
    }
    return transformed;
}

function find(req) {
    const deferred = Q.defer();

    const query = TimesheetEntry.find({}).populate({
        path: 'employerOffice',
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
        path: 'employerOffice',
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
        employerOffice: newEntry.employerOffice.id,
        start: newEntry.start,
        end: newEntry.end,
        break: newEntry.break,
        ratePerHour: newEntry.ratePerHour
    });

    entry.save().then((result) => findById(result.id, req))
    .then((e) => {
        deferred.resolve(e);
    }).end(deferred.reject);

    return deferred.promise;
}

function remove(id, req) {
    const deferred = Q.defer();

    TimesheetEntry.findById(id).remove().exec().then(() => {
        deferred.resolve();
    }).end(deferred.rejec);

    return deferred.promise;
}

module.exports = {
    find,
    findById,
    create,
    remove
};
