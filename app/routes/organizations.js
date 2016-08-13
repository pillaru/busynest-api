var express = require('express');
var router = express.Router();
var orgService = require('./../services/organization-service');

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

module.exports = router;