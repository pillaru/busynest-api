var Organization = require('./../models/organization'),
    Q = require('q');

function find(req) {
    var deferred = Q.defer();

    var query = Organization.find({});

    query.exec().then(function(results) {
        var organizations = results.map(function(organization) {
            return transformModel(organization, req);
        });
        deferred.resolve(organizations);
    }).end(function(reason) {
        deferred.reject(reason);
    });
    return deferred.promise;
}

function findById(id, req) {
    var deferred = Q.defer();

    var query = Organization.findById(id);

    query.exec().then(function(doc){
        deferred.resolve(transformModel(doc, req));
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newOrganization, req) {
    var deferred = Q.defer();
    
    var organization = new Organization({name : newOrganization.name}); 
    
    organization.save().then(function(result) {
        deferred.resolve(transformModel(result, req));
    }).end(deferred.reject);
    
    return deferred.promise;
}

function transformModel(doc, req) {
    var urlBase = req.protocol + '://' + req.get('host');
    var transformed = doc.toObject();
    transformed.url = urlBase + transformed.url;
    transformed.offices_url = urlBase + transformed.offices_url;
    delete transformed._id;
    return transformed;
}

module.exports = {
    find : find, 
    findById : findById,
    create: create
}