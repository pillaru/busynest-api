var Office = require('./../models/office'),
    Q = require('q');

function findByOrganization(orgId, req) {
    var deferred = Q.defer();

    var query = Office.find({organization: orgId}).populate('organization');

    query.exec().then(function(results) {
        var offices = results.map(function(office) {
            return transformModel(office, req);
        });
        deferred.resolve(offices);
    }).end(function(reason) {
        deferred.reject(reason);
    });
    return deferred.promise;
}

function findById(id, req) {
    var deferred = Q.defer();

    var query = Office.findById(id).populate('organization');

    query.exec().then(function(doc){
        deferred.resolve(transformModel(doc, req));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(orgId, newOffice, req) {
    var deferred = Q.defer();
    
    var office = new Office({
        address_line_1 : newOffice.address_line_1,
        address_line_2 : newOffice.address_line_2,
        town_or_city : newOffice.town_or_city,
        county : newOffice.county,
        country : newOffice.country,
        postcode : newOffice.postcode,
        organization : orgId
    }); 
    
    office.save().then(function(result) {
        return findById(result._id, req);
    }).then(function(result) {
        deferred.resolve(result);
    }).end(deferred.reject);
    
    return deferred.promise;
}

function transformModel(doc, req) {
    var urlBase = req.protocol + '://' + req.get('host');
    var transformed = doc.toObject();
    transformed.url = urlBase + transformed.url;
    delete transformed._id;
    delete transformed.organization._id;
    transformed.organization.url = urlBase + transformed.organization.url;
    return transformed;
}

module.exports = {
    findById : findById,
    findByOrganization : findByOrganization,
    create : create
}