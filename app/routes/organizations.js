const express = require('express');
const orgService = require('./../services/organization-service');
const officeService = require('./../services/organization-office-service');

const router = express.Router();

router.get('/', (req, res) => {
    orgService.find(req).then((organizations) => {
        res.send(organizations);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
    req.checkBody('name', 'Name is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    orgService.create({
        name: req.body.name
    }, req).then((model) => {
        res.status(201).json(model);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.get('/:id', (req, res) => {
    orgService.findById(req.params.id, req).then((model) => {
        res.send(model);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

// organizations/{id}/offices
router.get('/:id/offices', (req, res) => {
    officeService.findByOrganization(req.params.id, req).then((offices) => {
        res.send(offices);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.post('/:id/offices', (req, res) => {
    req.checkBody('address_line_1', 'Address Line 1 is required').notEmpty();
    req.checkBody('town_or_city', 'Town or City is required').notEmpty();
    req.checkBody('country', 'Country is required').notEmpty();
    req.checkBody('postcode', 'Postcode is required').notEmpty();

    const errors = req.validationErrors();
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
    }, req).then((office) => {
        res.status(201).json(office);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

// organizations/{id}/offices/{id}
router.get('/:id/offices/:oid', (req, res) => {
    officeService.findById(req.params.oid, req).then((office) => {
        res.send(office);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

module.exports = router;
