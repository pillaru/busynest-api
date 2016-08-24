const Office = require('./../models/office');
const Q = require('q');

function transformModel(doc, req) {
    const urlBase = `${req.protocol}://${req.get('host')}`;
    const transformed = doc.toObject();
    transformed.url = urlBase + transformed.url;
    delete transformed._id;
    if(transformed.organization) {
        delete transformed.organization._id;
        transformed.organization.url = urlBase + transformed.organization.url;
        transformed.organization.officesUrl = urlBase + transformed.organization.officesUrl;
    }
    return transformed;
}

function find(req) {
    const deferred = Q.defer();

    const query = Office.find({}).populate('organization');

    query.exec().then((results) => {
        const offices = results.map((office) => transformModel(office, req));
        deferred.resolve(offices);
    }).end((reason) => deferred.reject(reason));
    return deferred.promise;
}

function findByOrganization(orgId, req) {
    const deferred = Q.defer();

    const query = Office.find({ organization: orgId }).populate('organization');

    query.exec().then((results) => {
        const offices = results.map((office) => transformModel(office, req));
        deferred.resolve(offices);
    }).end((reason) => deferred.reject(reason));
    return deferred.promise;
}

function findById(id, req) {
    const deferred = Q.defer();

    const query = Office.findById(id).populate('organization');

    query.exec().then((doc) => {
        deferred.resolve(transformModel(doc, req));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newOffice, req) {
    const deferred = Q.defer();

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
