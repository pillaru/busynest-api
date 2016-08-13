var express = require('express');
var router = express.Router();
var Organization = require('./../app/models/organization');

router.get('/', function (req, res) {
    var urlBase = req.protocol + '://' + req.get('host');
    
    Organization.find(function(err, results) {
        if(err) {
            throw err;
        }
        var organizations = results.map(function(organization) {
            var transformed = organization.toObject();
            transformed.url = urlBase + transformed.url;
            delete transformed._id;
            return transformed;
        });
        res.send(organizations);
    });
});

router.post('/', function(req, res) {
    req.checkBody('name', 'Name is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var organization = new Organization({
        name: req.body.name,
    });
    organization.save(function(err) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    var transformed = organization.toObject();
    var urlBase = req.protocol + '://' + req.get('host');
    transformed.url = urlBase + transformed.url;
    
    res.status(201).json(transformed);
});

router.get('/:id', function(req, res) {
    var urlBase = req.protocol + '://' + req.get('host')
    Organization.findById(req.params.id, function(err, doc) {
        if(err) {
            throw err;
        }
        var transformed = doc.toObject();
        transformed.url = urlBase + transformed.url;
        res.send(transformed);
    });
});

module.exports = router;