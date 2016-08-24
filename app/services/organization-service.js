const Organization = require('./../models/organization');
const Q = require('q');

function transformModel(doc, req) {
    const urlBase = `${req.protocol}://${req.get('host')}`;
    const transformed = doc.toObject();
    transformed.url = urlBase + transformed.url;
    transformed.officesUrl = urlBase + transformed.officesUrl;
    delete transformed._id;
    return transformed;
}

function find(req) {
    const deferred = Q.defer();

    const query = Organization.find({});

    query.exec().then((results) => {
        const organizations = results.map((organization) => transformModel(organization, req));
        deferred.resolve(organizations);
    }).end((reason) => {
        deferred.reject(reason);
    });
    return deferred.promise;
}

function findById(id, req) {
    const deferred = Q.defer();

    const query = Organization.findById(id);

    query.exec().then((doc) => {
        deferred.resolve(transformModel(doc, req));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newOrganization, req) {
    const deferred = Q.defer();

    const organization = new Organization({ name: newOrganization.name });

    organization.save().then((result) => {
        deferred.resolve(transformModel(result, req));
    }).end(deferred.reject);

    return deferred.promise;
}

module.exports = {
    find,
    findById,
    create
};
