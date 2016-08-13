var express = require('express');
var router = express.Router();
var Employer = require('./../app/models/employer');

router.get('/', function (req, res) {
    var urlBase = req.protocol + '://' + req.get('host');
    
    Employer.find(function(err, results) {
        if(err) {
            throw err;
        }
        var employers = results.map(function(employer) {
            var transformed = employer.toObject();
            transformed.url = urlBase + transformed.url;
            delete transformed._id;
            return transformed;
        });
        res.send(employers);
    });
});

router.post('/', function(req, res) {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('address_line_1', 'Addrees Line 1 is required').notEmpty();
    req.checkBody('town_or_city', 'Town or city is required').notEmpty();
    req.checkBody('country', 'Country is required').notEmpty();
    req.checkBody('postcode', 'Postcode is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var employer = new Employer({
        name: req.body.name,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        town_or_city: req.body.town_or_city,
        county: req.body.county,
        country: req.body.country,
        postcode: req.body.postcode
    });
    employer.save(function(err) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    var transformed = employer.toObject();
    var urlBase = req.protocol + '://' + req.get('host');
    transformed.url = urlBase + transformed.url;
    
    res.status(201).json(transformed);
});

router.get('/:id', function(req, res) {
    var urlBase = req.protocol + '://' + req.get('host')
    Employer.findById(req.params.id, function(err, doc) {
        if(err) {
            throw err;
        }
        var transformed = doc.toObject();
        transformed.url = urlBase + transformed.url;
        res.send(transformed);
    });
});

module.exports = router;