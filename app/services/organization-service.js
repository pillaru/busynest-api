var Organization = require('./../models/organization'),
    Q = require('q'),
    organizationFactory = require('./../factories/organization.factory');

function find(req) {
    const urlBase = `${req.protocol}://${req.get('host')}`;
    const deferred = Q.defer();

    const query = Organization.find({});

    query.exec().then((results) => {
        const organizations = results.map((doc) =>
            deferred.resolve(organizationFactory.create(doc.toObject(), urlBase)));
    }).end((reason) => {
        deferred.reject(reason);
    });
    return deferred.promise;
}

function findById(id, req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

    const query = Organization.findById(id);

    query.exec().then((doc) => {
        deferred.resolve(organizationFactory.create(doc.toObject(), urlBase));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newOrganization, req) {
    const deferred = Q.defer();
    const urlBase = `${req.protocol}://${req.get('host')}`;

    const organization = new Organization({ name: newOrganization.name });

    organization.save().then((doc) => {
        deferred.resolve(organizationFactory.create(doc.toObject(), urlBase));
    }).end(deferred.reject);

    return deferred.promise;
}

module.exports = {
    find,
    findById,
    create
};
