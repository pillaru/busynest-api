var Q = require('q'),
    TimesheetEntry = require('./../models/timesheet-entry'),
    timesheetEntryFactory = require('./../factories/timesheet-entry.factory');

function find(req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

    const query = TimesheetEntry.find({}).populate({
        path: 'employerOffice',
        populate: { path: 'organization' }
    });

    query.exec().then((results) => {
        deferred.resolve(results.map((entry) =>
            timesheetEntryFactory.create(entry.toObject(), urlBase)));
    }).end((reason) => {
        deferred.reject(reason);
    });

    return deferred.promise;
}

function findById(id, req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

    const query = TimesheetEntry.findById(id).populate({
        path: 'employerOffice',
        populate: { path: 'organization' }
    });

    query.exec().then((doc) => {
        deferred.resolve(timesheetEntryFactory.create(doc.toObject(), urlBase));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newEntry, req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

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
