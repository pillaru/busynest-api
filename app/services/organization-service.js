var Organization = require('./../models/organization'),
    Q = require('q');

function find(req) {
    var deferred = Q.defer();

    var query = Organization.find({});

    query.exec().then(function(results) {
        var organizations = results.map(function(organization) {
            var urlBase = req.protocol + '://' + req.get('host');
            var transformed = organization.toObject();
            transformed.url = urlBase + transformed.url;
            delete transformed._id;
            return transformed;
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
        var urlBase = req.protocol + '://' + req.get('host');
        var transformed = doc.toObject();
        transformed.url = urlBase + transformed.url;
        delete transformed._id;
        deferred.resolve(transformed);
    }).end(deferred.reject);

    return deferred.promise;
}

function create(newOrganization, req) {
    var deferred = Q.defer();
    var organization = new Organization({name : newOrganization.name}); 
    organization.save().then(function(result) {
        console.log(result);
        var transformed = organization.toObject();
        var urlBase = req.protocol + '://' + req.get('host');
        transformed.url = urlBase + transformed.url;
        delete transformed._id;
        deferred.resolve(transformed);
    }).end(deferred.reject);
    return deferred.promise;
}

module.exports = {
    find : find, 
    findById : findById,
    create: create
}