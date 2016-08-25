var Office = require('./../models/office'),
    Q = require('q'),
    officeFactory = require('./../factories/office.factory');

function find(req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

    const query = Office.find({}).populate('organization');

    query.exec().then((results) => {
        deferred.resolve(results.map((office) =>
            officeFactory.create(office.toObject(), urlBase)));
    }).end((reason) => deferred.reject(reason));
    return deferred.promise;
}

function findByOrganization(orgId, req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

    const query = Office.find({ organization: orgId }).populate('organization');

    query.exec().then((results) => {
        deferred.resolve(results.map((office) =>
            officeFactory.create(office.toObject(), urlBase)));
    }).end((reason) => deferred.reject(reason));
    return deferred.promise;
}

function findById(id, req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

    const query = Office.findById(id).populate('organization');

    query.exec().then((doc) => {
        deferred.resolve(officeFactory.create(doc.toObject(), urlBase));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newOffice, req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

    const office = new Office({
        addressLine1: newOffice.addressLine1,
        addressLine2: newOffice.addressLine2,
        townOrCity: newOffice.townOrCity,
        county: newOffice.county,
        country: newOffice.country,
        postcode: newOffice.postcode,
        organization: newOffice.organization.id
    });

    office.save().then((result) => findById(result._id, req)).then((result) => {
        deferred.resolve(result);
    }).end(deferred.reject);

    return deferred.promise;
}

function remove(id, req) {
    const deferred = Q.defer();

    Office.findById(id).remove().exec().then(() => {
        deferred.resolve();
    }).end(deferred.rejec);

    return deferred.promise;
}

module.exports = {
    find,
    findById,
    findByOrganization,
    create,
    remove
};
