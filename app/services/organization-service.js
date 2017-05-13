const Organization = require('./../models/organization');
const organizationFactory = require('./../factories/organization.factory');

function find() {
    function resolver(resolve, reject) {
        const urlBase = 'https://api.bizhub.io';

        const query = Organization.find({});

        const promise = query.exec();

        promise.then((results) => {
            console.log('was here inside execute');
            resolve(results.map((doc) =>
                organizationFactory.create(doc.toObject(), urlBase)));
        }).catch(reject);
    }
    return new Promise(resolver);
}

function findById(id, req) {
    function resolver(resolve, reject) {
        const urlBase = `${req.protocol}://${req.get('host')}`;

        const query = Organization.findById(id);

        query.exec().then((doc) => {
            resolve(organizationFactory.create(doc.toObject(), urlBase));
        }).catch(reject);
    }
    return new Promise(resolver);
}

function create(newOrganization, req) {
    function resolver(resolve, reject) {
        const urlBase = `${req.protocol}://${req.get('host')}`;

        const organization = new Organization({ name: newOrganization.name });

        organization.save().then((doc) => {
            resolve(organizationFactory.create(doc.toObject(), urlBase));
        }).catch(reject);
    }
    return new Promise(resolver);
}

module.exports = {
    find,
    findById,
    create
};
