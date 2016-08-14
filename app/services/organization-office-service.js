const Office = require('./../models/office');
const Q = require('q');

function transformModel(doc, req) {
    const urlBase = `${req.protocol}://${req.get('host')}`;
    const transformed = doc.toObject();
    transformed.url = urlBase + transformed.url;
    delete transformed._id;
    delete transformed.organization._id;
    transformed.organization.url = urlBase + transformed.organization.url;
    return transformed;
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

function create(orgId, newOffice, req) {
    const deferred = Q.defer();

    const office = new Office({
        address_line_1: newOffice.address_line_1,
        address_line_2: newOffice.address_line_2,
        town_or_city: newOffice.town_or_city,
        county: newOffice.county,
        country: newOffice.country,
        postcode: newOffice.postcode,
        organization: orgId
    });

    office.save().then((result) => findById(result._id, req)).then((result) => {
        deferred.resolve(result);
    }).end(deferred.reject);

    return deferred.promise;
}

module.exports = {
    findById,
    findByOrganization,
    create
};
