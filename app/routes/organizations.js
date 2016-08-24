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
    req.checkBody('addressLine1', 'Address Line 1 is required').notEmpty();
    req.checkBody('townOrCity', 'Town or City is required').notEmpty();
    req.checkBody('country', 'Country is required').notEmpty();
    req.checkBody('postcode', 'Postcode is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    officeService.create({
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        townOrCity: req.body.townOrCity,
        county: req.body.county,
        country: req.body.country,
        postcode: req.body.postcode,
        organization: {
            id: req.params.id
        }
    }, req).then((office) => {
        res.status(201).json(office);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

module.exports = router;
