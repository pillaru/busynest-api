var express = require('express'),
    officeService = require('./../services/organization-office-service');

var router = express.Router();

router.get('/', (req, res) => {
    officeService.find(req).then((offices) => {
        res.send(offices);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
    req.checkBody('addressLine1', 'Address Line 1 is required').notEmpty();
    req.checkBody('townOrCity', 'Town or City is required').notEmpty();
    req.checkBody('country', 'Country is required').notEmpty();
    req.checkBody('postcode', 'Postcode is required').notEmpty();
    req.checkBody('organization.id', 'Organization id is required').notEmpty();

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
            id: req.body.organization.id
        }
    }, req).then((office) => {
        res.status(201).json(office);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.get('/:id', (req, res) => {
    officeService.findById(req.params.id, req).then((office) => {
        res.send(office);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

router.delete('/:id', (req, res) => {
    officeService.remove(req.params.id, req).then(() => {
        res.sendStatus(204);
    }).catch((reason) => {
        console.log(reason);
        res.sendStatus(500);
    });
});

module.exports = router;
