var express = require('express'),
    router = express.Router(),
    orgService = require('./../services/organization-service'),
    officeService = require('./../services/organization-office-service');

router.get('/', function (req, res) {
    orgService.find(req).then(function(organizations){
        res.send(organizations);
    }).catch(function(reason){
        console.log(reason);
        res.sendStatus(500);
    });
});

router.post('/', function(req, res) {
    req.checkBody('name', 'Name is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    orgService.create({
        name: req.body.name,
    }, req).then(function(model) {
        res.status(201).json(model);
    }).catch(function(reason) {
        console.log(reason)
        res.sendStatus(500);
    });
});

router.get('/:id', function(req, res) {
    orgService.findById(req.params.id, req).then(function(model) {
        res.send(model);
    }).catch(function(reason) {
        console.log(reason)
        res.sendStatus(500);
    });
});

// organizations/{id}/offices
router.get('/:id/offices', function(req, res) {
    officeService.findByOrganization(req.params.id, req).then(function(offices) {
        res.send(offices);
    }).catch(function(reason) {
        console.log(reason)
        res.sendStatus(500);
    });
});

router.post('/:id/offices', function(req, res) {
    req.checkBody('address_line_1', 'Address Line 1 is required').notEmpty();
    req.checkBody('town_or_city', 'Town or City is required').notEmpty();
    req.checkBody('country', 'Country is required').notEmpty();
    req.checkBody('postcode', 'Postcode is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    officeService.create(req.params.id, {
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        town_or_city: req.body.town_or_city,
        county: req.body.county,
        country: req.body.country,
        postcode: req.body.postcode
    }, req).then(function(office) {
        res.status(201).json(office)
    }).catch(function(reason) {
        console.log(reason)
        res.sendStatus(500);
    });
})

module.exports = router;